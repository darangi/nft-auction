/* eslint-disable @typescript-eslint/no-floating-promises */

import hre, { ethers, network } from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { NftAuction, NftMockContract } from "../../typechain";
import { accounts, Signers, Signature } from "../types";
import { expect } from "chai";

const { deployContract } = hre.waffle;

const usdt = "0x55d398326f99059ff775485246999027b3197955";
const bnb = "0xb8c77482e45f1f44de1745f52c74426c631bdd52";

const toEther = (amount: number) => ethers.utils.parseEther(String(amount));

describe("NftAuction", function () {
  before(async function () {
    this.signers = {} as Signers;
    this.accounts = {} as accounts;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];

    const nftAuctionArtifact: Artifact = await hre.artifacts.readArtifact("NftAuction");
    this.nftAuction = <NftAuction>await deployContract(this.signers.admin, nftAuctionArtifact);

    const NftMockContractArtifact: Artifact = await hre.artifacts.readArtifact("NftMockContract");
    this.nftMockContract = <NftMockContract>(
      await deployContract(this.signers.admin, NftMockContractArtifact, ["Fire ferret", "$F"])
    );

    this.accounts.ibrahim = signers[1];
    this.accounts.musa = signers[2];
    this.accounts.darangi = signers[3];
    this.accounts.notAWinnerOrCreator = signers[4];

    /** Mint NFTs and approve them for the contract */
    await this.nftMockContract.mint(this.accounts.ibrahim.address, 1);
    await this.nftMockContract.mint(this.accounts.ibrahim.address, 2);
    await this.nftMockContract.mint(this.accounts.darangi.address, 6);
    await this.nftMockContract.mint(this.accounts.musa.address, 3);
    await this.nftMockContract.mint(this.accounts.musa.address, 7);

    await this.nftMockContract.connect(this.accounts.ibrahim).approve(this.nftAuction.address, 1);
    await this.nftMockContract.connect(this.accounts.ibrahim).approve(this.nftAuction.address, 2);
    await this.nftMockContract.connect(this.accounts.darangi).approve(this.nftAuction.address, 6);
    await this.nftMockContract.connect(this.accounts.musa).approve(this.nftAuction.address, 3);
    await this.nftMockContract.connect(this.accounts.musa).approve(this.nftAuction.address, 7);

    this.auctionId = 1;
    this.auctionWithMultipleNftsId = 4;

    /**
     * Helper functions
     */
    this.getAuction = function (auctionId: number) {
      return this.nftAuction.getAuction(auctionId);
    };

    this.timeTravel = async function (seconds: number) {
      await network.provider.send("evm_increaseTime", [seconds]);
    };

    this.sign = async function (message: string): Promise<Signature> {
      const wallet = ethers.Wallet.createRandom();
      const hash = ethers.utils.solidityKeccak256(["string"], [message]);
      const signature = await wallet.signMessage(ethers.utils.arrayify(hash));

      return { signature, signer: await wallet.getAddress() };
    };
  });

  it("Should throw an error when a user tries to create an auction with an nft they dont own", async function () {
    await expect(
      this.nftAuction.connect(this.accounts.ibrahim).createAuction(this.nftMockContract.address, 6, usdt),
    ).to.be.revertedWith("YOU DO NOT OWN THE NFT");
  });

  it("deposit NFT and create auction", async function () {
    const trx = await this.nftAuction
      .connect(this.accounts.ibrahim)
      .createAuction(this.nftMockContract.address, 1, usdt);

    expect(trx).to.emit(this.nftAuction, "AuctionCreated");

    const auction = await this.getAuction(this.auctionId);

    expect(auction.creator).to.eql(this.accounts.ibrahim.address);
  });

  it("Create multiple auctions", async function () {
    // Ids are auto incremented so the next 2 auctionId is 2 and 3 respectively
    const trx1 = this.nftAuction.connect(this.accounts.ibrahim).createAuction(this.nftMockContract.address, 2, usdt);
    const trx2 = this.nftAuction.connect(this.accounts.darangi).createAuction(this.nftMockContract.address, 6, usdt);

    await Promise.all([trx1, trx2]);

    const auction1 = await this.getAuction(2, this.accounts.ibrahim.address);
    const auction2 = await this.getAuction(3, this.accounts.darangi.address);

    expect(auction1.creator).to.eql(this.accounts.ibrahim.address);
    expect(auction2.creator).to.eql(this.accounts.darangi.address);
  });

  it("deposit mulitple NFTs and create auction", async function () {
    const nftContractAddresses = [this.nftMockContract.address, this.nftMockContract.address];
    const tokenIds = [3, 7];

    const trx = await this.nftAuction
      .connect(this.accounts.musa)
      .createAuctionWithMultipleNfts(nftContractAddresses, tokenIds, usdt);

    expect(trx).to.emit(this.nftAuction, "AuctionCreated");

    const auction = await this.getAuction(this.auctionWithMultipleNftsId, this.accounts.musa.address);

    expect(auction.creator).to.eql(this.accounts.musa.address);
  });

  it("can set minimum bid", async function () {
    const amount = toEther(2);
    await this.nftAuction.connect(this.accounts.ibrahim).setMinimumBid(this.auctionId, amount);
    const auction = await this.getAuction(this.auctionId);
    expect(amount.eq(auction.minimumBid)).to.true;
  });

  it("user can place a bid", async function () {
    try {
      await expect(
        this.nftAuction.connect(this.accounts.darangi)["bid(uint256,address)"](this.auctionId, usdt),
      ).to.be.revertedWith("YOU DONT HAVE ENOUGH TOKENS TO MAKE A BID");

      await expect(
        this.nftAuction.connect(this.accounts.darangi)["bid(uint256,address)"](this.auctionId, bnb, {
          value: toEther(4),
        }),
      ).to.be.revertedWith("BID WITH AN ACCEPTED TOKEN");

      const trx = await this.nftAuction.connect(this.accounts.darangi)["bid(uint256,address)"](this.auctionId, usdt, {
        value: toEther(4),
      });

      expect(trx).to.emit(this.nftAuction, "BidMade");

      const auction = await this.getAuction(this.auctionId);

      expect(auction.highestBidder).to.eql(this.accounts.darangi.address);
    } catch (ex) {
      console.log((ex as Error).message);
    }
  });

  it("Rejects bid when invalid signature is provided for thirdparty recipient", async function () {
    const message = "gimme nft";
    const { signer } = await this.sign(message);
    const invalidSignature =
      "0xac612d040c06f8b33296fdb300f6f4befe4eac820bc9d68c2c5590abdf60e5b12f4d0e49b2ed2203fd563efd2eb35f18b358d1d46f17679d1a9f086ef7e49d091b";
    await expect(
      this.nftAuction
        .connect(this.accounts.musa)
        ["bid(uint256,address,address,bytes,string)"](this.auctionId, usdt, signer, invalidSignature, message, {
          value: toEther(3),
        }),
    ).to.be.revertedWith("INVALID RECIPIENT");
  });

  it("Accept a higher bid and refund previous bidder if they get outbid", async function () {
    const balance = await ethers.provider.getBalance(this.accounts.darangi.address);
    const auction = await this.getAuction(this.auctionId);
    const previousBid = auction.highestBid;

    await expect(
      this.nftAuction.connect(this.accounts.musa)["bid(uint256,address)"](this.auctionId, usdt, {
        value: toEther(3),
      }),
    ).to.be.revertedWith("A HIGHER BID IS NEEDED");
    /**
     * 5eth to outbid the previous bid
     */
    await this.nftAuction.connect(this.accounts.musa)["bid(uint256,address)"](this.auctionId, usdt, {
      value: toEther(5),
    });

    await this.nftAuction.connect(this.accounts.darangi).withdrawFund();

    const newBalance = await ethers.provider.getBalance(this.accounts.darangi.address);
    expect(+balance.add(previousBid).toString()).to.be.greaterThan(+newBalance.toString());
  });

  it("Prevents bid on auction that has ended", async function () {
    /**
     * e2e to verify how auction ends
     * previous bid was 5 tokens, 5times more is 25
     */
    await this.nftAuction.connect(this.accounts.musa)["bid(uint256,address)"](this.auctionId, usdt, {
      value: toEther(25),
    });

    let auction = await this.getAuction(this.auctionId);
    expect(auction._quickFinish).to.true;

    await expect(this.nftAuction.connect(this.accounts.musa).quickFinish(this.auctionId)).to.be.revertedWith(
      "ONLY CREATOR CAN PERFORM THIS ACTION",
    );

    await expect(this.nftAuction.connect(this.accounts.ibrahim).quickFinish(this.auctionId));

    /**
     * Increase time by 30mins i.e this.auctionId,800secs
     */
    await this.timeTravel(8600);

    await expect(
      this.nftAuction.connect(this.accounts.musa)["bid(uint256,address)"](this.auctionId, usdt, {
        value: toEther(40),
      }),
    ).to.be.revertedWith("AUCTION HAS ENDED");

    // ensure auction state has been updated by quickFinish
    auction = await this.getAuction(this.auctionId);
    expect(auction.ended).to.eql(true);
  });

  it("prevent non winner or non creator from settling auction", async function () {
    await expect(
      this.nftAuction.connect(this.accounts.notAWinnerOrCreator).settleAuction(this.auctionId),
    ).to.revertedWith("YOU CANNOT SETTLE THIS AUCTION");
  });

  it("Settle auction and transfer assets", async function () {
    await this.nftAuction.connect(this.accounts.musa)["bid(uint256,address)"](this.auctionWithMultipleNftsId, usdt, {
      value: toEther(25),
    });

    await this.timeTravel(8600);

    const auction = await this.getAuction(this.auctionWithMultipleNftsId);
    const winner = auction.highestBidder || auction.recipient;
    const currentBalance = await ethers.provider.getBalance(auction.creator);

    await this.nftAuction.connect(this.accounts.musa).settleAuction(this.auctionWithMultipleNftsId);

    const newBalance = await ethers.provider.getBalance(auction.creator);
    expect(+newBalance.toString()).to.be.greaterThan(+currentBalance.toString());

    for (const nft of auction.nfts) {
      expect(await this.nftMockContract.ownerOf(nft.tokenId)).to.eq(winner);
    }
  });
});
