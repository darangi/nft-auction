// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract SignatureVerifier {
    using ECDSA for bytes32;

    function isValidSignature(
        address signer,
        string memory message,
        bytes memory signature
    ) internal pure returns (bool) {
        return keccak256(abi.encodePacked(message)).toEthSignedMessageHash().recover(signature) == signer;
    }
}
