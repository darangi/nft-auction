// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./SignatureVerifier.sol";
import "hardhat/console.sol";

contract NftAuction is ReentrancyGuard, SignatureVerifier {
    uint256 private auctionId;

    struct Auction {
        address creator;
        address recipient;
        bool quickFinish;
        bool ended;
        bool settled;
        uint256 minimumBid;
        uint256 endTime;
        uint256 highestBid;
        Nft[] nfts;
        address highestBidder;
        address acceptedERC20Token;
    }

    struct Bid {
        address creator;
        address bidERC20Token;
        uint256 auctionId;
        uint256 amount;
        address recipient;
        string signature;
    }

    struct Nft {
        address contractAddress;
        uint256 tokenId;
    }

    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256) private refunds;

    event AuctionCreated(address creator, uint256 auctionId, address acceptedERC20Token);
    event AuctionSettled(address winner, address settledBy);
    event AuctionEnded(address creator, uint256 auctionId);
    event MinimumBidUpdated(address creator, uint256 auctionId, uint256 amount);
    event BidMade(address bidder, uint256 bid, uint256 auctionId);

    modifier auctionInProgress(uint256 _auctionId) {
        require(_auctionInProgress(_auctionId), "AUCTION HAS ENDED");
        _;
    }

    modifier ownsNft(address nftContractAddress, uint256 tokenId) {
        require(_ownsNft(nftContractAddress, tokenId, msg.sender), "YOU DO NOT OWN THE NFT");
        _;
    }

    modifier onlyCreatorOrWinner(uint256 _auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(msg.sender == auction.creator || msg.sender == auction.highestBidder, "YOU CANNOT SETTLE THIS AUCTION");
        _;
    }

    modifier onlyCreator(uint256 _auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(msg.sender == auction.creator, "ONLY CREATOR CAN PERFORM THIS ACTION");
        _;
    }

    modifier auctionExists(uint256 _auctionId) {
        require(auctions[_auctionId].creator != address(0), "AUCTION NOT FOUND");
        _;
    }

    modifier validThirdPartyReceipient(
        address recipient,
        bytes memory signature,
        string memory message
    ) {
        require(isValidSignature(recipient, message, signature), "INVALID RECIPIENT");
        _;
    }

    function _ownsNft(
        address nftContractAddress,
        uint256 tokenId,
        address owner
    ) private view returns (bool) {
        return owner == IERC721(nftContractAddress).ownerOf(tokenId);
    }

    function _auctionInProgress(uint256 _auctionId) private view returns (bool) {
        Auction storage auction = auctions[_auctionId];

        return (auction.endTime == 0 || block.timestamp < auction.endTime);
    }

    function _transferNft(
        address from,
        address to,
        address nftContractAddress,
        uint256 tokenId
    ) private returns (bool) {
        IERC721(nftContractAddress).transferFrom(from, to, tokenId);

        return true;
    }

    function _transferNfts(
        address from,
        address to,
        Nft[] memory nfts
    ) private returns (bool) {
        // loop ? what about gas costs?
        for (uint256 i = 0; i < nfts.length; i++) {
            _transferNft(from, to, nfts[i].contractAddress, nfts[i].tokenId);
        }

        return true;
    }

    function ownsNfts(Nft[] memory nfts) private returns (bool) {
        for (uint256 i = 0; i < nfts.length; i++) {
            if (!_ownsNft(nfts[i].contractAddress, nfts[i].tokenId, msg.sender)) {
                return false;
            }
        }

        return true;
    }

    function _transferTokens(address to, uint256 amount) private nonReentrant returns (bool) {
        (bool sent, bytes memory data) = to.call{ value: amount }("");

        return sent;
    }

    function _endAuction(uint256 _auctionId) private {
        auctions[_auctionId].ended = true;

        emit AuctionEnded(msg.sender, _auctionId);
    }

    function _resetAuction(uint256 _auctionId) private {
        Auction storage auction = auctions[_auctionId];
        auction.creator = address(0);
        auction.recipient = address(0);
        auction.highestBidder = address(0);
        auction.acceptedERC20Token = address(0);
        auction.highestBid = 0;
        auction.minimumBid = 0;
        auction.settled = false;
        auction.ended = false;
        auction.quickFinish = false;

        for (uint256 i; i < auction.nfts.length; i++) {
            auction.nfts[i].contractAddress = address(0);
            auction.nfts[i].tokenId = 0;
        }
    }

    function createAuction(
        address nftContractAddress,
        uint256 tokenId,
        address acceptedERC20Token
    ) external ownsNft(nftContractAddress, tokenId) {
        bool success = _transferNft(msg.sender, address(this), nftContractAddress, tokenId);
        require(success, "FAILED TO CREATE AUCTION");

        Auction storage auction = auctions[++auctionId];
        auction.creator = msg.sender;
        auction.nfts.push(Nft({ contractAddress: nftContractAddress, tokenId: tokenId }));
        auction.acceptedERC20Token = acceptedERC20Token;

        emit AuctionCreated(msg.sender, auctionId, acceptedERC20Token);
    }

    function createAuctionWithMultipleNfts(
        address[] memory nftContractAddresses,
        uint256[] memory tokenIds,
        address acceptedERC20token
    ) external {
        require(nftContractAddresses.length == tokenIds.length, "CONTRACT ADDRESSES AND TOKENIDS MISMATCH");

        Auction storage auction = auctions[++auctionId];
        for (uint256 i = 0; i < nftContractAddresses.length; i++) {
            auction.nfts.push(Nft({ contractAddress: nftContractAddresses[i], tokenId: tokenIds[i] }));
        }

        bool success = _transferNfts(msg.sender, address(this), auction.nfts);
        require(success, "FAILED TO CREATE AUCTION");

        auction.creator = msg.sender;
        auction.acceptedERC20Token = acceptedERC20token;

        emit AuctionCreated(msg.sender, auctionId, acceptedERC20token);
    }

    function getAuction(uint256 _auctionId)
        public
        view
        returns (
            address creator,
            bool ended,
            Nft[] memory nfts,
            uint256 minimumBid,
            uint256 endTime,
            uint256 highestBid,
            address highestBidder,
            address acceptedERC20Token,
            bool _quickFinish
        )
    {
        Auction storage auction = auctions[_auctionId];

        return (
            auction.creator,
            auction.ended,
            auction.nfts,
            auction.minimumBid,
            auction.endTime,
            auction.highestBid,
            auction.highestBidder,
            auction.acceptedERC20Token,
            auction.quickFinish
        );
    }

    function setMinimumBid(uint256 _auctionId, uint256 amount) external onlyCreator(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        // prevent setting a minimumm bid price after an auction is on
        require(auction.endTime == 0, "UNABLE TO SET MINIMU BID PRICE");
        auction.minimumBid = amount;

        emit MinimumBidUpdated(msg.sender, _auctionId, amount);
    }

    function bid(uint256 _auctionId, address bidERC20Token)
        external
        payable
        auctionExists(_auctionId)
        auctionInProgress(_auctionId)
    {
        Bid memory _bid;
        _bid.auctionId = _auctionId;
        _bid.bidERC20Token = bidERC20Token;
        _bid.amount = msg.value;

        makeBid(_bid);
    }

    function bid(
        uint256 _auctionId,
        address bidERC20Token,
        address recipient,
        bytes memory signature,
        string memory message
    )
        external
        payable
        auctionExists(_auctionId)
        auctionInProgress(_auctionId)
        validThirdPartyReceipient(recipient, signature, message)
    {
        Bid memory _bid;
        _bid.auctionId = _auctionId;
        _bid.bidERC20Token = bidERC20Token;
        _bid.amount = msg.value;
        _bid.recipient = recipient;

        makeBid(_bid);
    }

    function makeBid(Bid memory _bid) internal auctionInProgress(_bid.auctionId) {
        Auction storage auction = auctions[_bid.auctionId];
        uint256 previousHighestBid = auction.highestBid;
        address previousHighestBidder = auction.highestBidder;

        require(!auction.ended, "AUCTION HAS ENDED");
        require(_bid.amount > auction.minimumBid, "YOU DONT HAVE ENOUGH TOKENS TO MAKE A BID");
        require(address(_bid.bidERC20Token) == address(auction.acceptedERC20Token), "BID WITH AN ACCEPTED TOKEN");
        require(_bid.amount > auction.highestBid, "A HIGHER BID IS NEEDED");

        auction.highestBid = _bid.amount;
        auction.highestBidder = msg.sender;

        if (_bid.recipient != address(0)) {
            auction.recipient = _bid.recipient;
        } else {
            auction.recipient = address(0);
        }

        refunds[previousHighestBidder] += previousHighestBid;

        if ((previousHighestBid > 0) && (_bid.amount >= (previousHighestBid * 5))) {
            auction.quickFinish = true;
        }

        auction.endTime = block.timestamp + 15 minutes;

        emit BidMade(msg.sender, _bid.amount, _bid.auctionId);
    }

    // TODO updateBid()

    function withdrawFund() external {
        require(refunds[msg.sender] > 0, "NO REFUND FOUND");

        refunds[msg.sender] = 0;
        bool success = _transferTokens(msg.sender, refunds[msg.sender]);

        require(success, "UNABLE TO WITHDRAW FUNDS");
    }

    function quickFinish(uint256 _auctionId) external onlyCreator(_auctionId) {
        require(auctions[_auctionId].quickFinish, "YOU CANNOT END THIS AUCTION");
        _endAuction(_auctionId);
    }

    function settleAuction(uint256 _auctionId) external auctionExists(_auctionId) onlyCreatorOrWinner(_auctionId) {
        require(!_auctionInProgress(_auctionId), "AUCTION IS STILL IN PROGRESS");
        Auction storage auction = auctions[_auctionId];
        require(!auction.settled, "AUCTION HAS BEEN SETTLED");

        auction.settled = true;

        address recipient = auction.recipient == address(0) ? auction.highestBidder : auction.recipient;
        bool nftsTransferred = _transferNfts(address(this), recipient, auction.nfts);
        bool tokensTransferred = _transferTokens(auction.creator, auction.highestBid);

        require(nftsTransferred && tokensTransferred, "UNABLE TO SETTLE AUCTION");

        _resetAuction(_auctionId);

        emit AuctionSettled(auction.highestBidder, msg.sender);
    }
}
