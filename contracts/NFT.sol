// contracts/NFT.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

/// @title Contract for Photo NFT 
/// @author Alec D'Alelio inspired by Nader Dabit
/// @notice Allows users to create or purchase photo NFTs

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// @notice initializes contractAddress to connect NFTs to correct marketplace
    address contractAddress;

    /// @notice set contractAddress to marketplaceAddress on deployment
    constructor(address marketplaceAddress) ERC721("Photo NFTs", "PHOTO") {
        contractAddress = marketplaceAddress;
    }

    /// @notice Mint Photo NFT
    /// @param tokenURI pointer to token metadata / IPFS
    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}