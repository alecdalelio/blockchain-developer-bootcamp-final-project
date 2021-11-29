// contracts/Market.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

/// @title Contract for Photo NFT marketplace
/// @author Alec D'Alelio inspired by Nader Dabit
/// @notice Allows users to create or purchase photo NFTs and view NFTs owned/purchased

contract Marketplace is ReentrancyGuard {
  using Counters for Counters.Counter;

  /// @notice Counters to track the total number of items created and sold.
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;

  /// @notice initializes payable address variable to represent the Marketplace owner
  address payable owner;

  /// @notice initializes listingPrice to 1 MATIC to create revenue stream for Marketplace owner
  uint256 listingPrice = 1 ether;

  /// @notice initializes contract owner to the deployer and ensures it is payable
  constructor() {
    owner = payable(msg.sender);
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized.");
    _;
  }
  
  /// @notice onlyOwner modifier used to ensure that withdrawal is limited to the contract owner
  function withdraw(uint _amount) onlyOwner public {
      owner.transfer(_amount);
  }

  struct PhotoNFT {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  /// @notice mapping IDs to NFTs
  mapping(uint256 => PhotoNFT) private photoNFTs;

  /// @notice emitted when a new photo NFT is created
  /// @param itemId item identifier within the marketplace
  /// @param nftContract pointer to NFT.sol contract
  /// @param tokenId unique ERC721 NFT
  /// @param seller address which minted/sold the NFT
  /// @param owner NFT owner
  /// @param price the price of the NFT in the marketplace
  /// @param sold whether or not the NFT has sold
  event PhotoNFTCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  /// Returns the listing price required to create an NFT on the marketplace
  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  /// @notice create a Photo NFT and places it for sale on the marketplace
  /// @param nftContract pointer to NFT.sol contract
  /// @param tokenId unique ERC721 NFT
  /// @param price the price of the NFT in the marketplace
  function createPhotoNFT(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    photoNFTs[itemId] =  PhotoNFT(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit PhotoNFTCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

  /// @notice Creates NFT sale and transfers ownership from creator to buyer
  /// @param nftContract pointer to NFT.sol contract
  /// @param itemId item identifier within the marketplace
  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint price = photoNFTs[itemId].price;
    uint tokenId = photoNFTs[itemId].tokenId;
    require(msg.value == price, "Try again! You must submit the exact price of the photo NFT that you wish to purchase!");

    photoNFTs[itemId].seller.transfer(msg.value);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    photoNFTs[itemId].owner = payable(msg.sender);
    photoNFTs[itemId].sold = true;
    _itemsSold.increment();
    payable(owner).transfer(listingPrice);
  }

  /// @notice Return all unsold market items
  function fetchUnsoldPhotoNFTs() public view returns (PhotoNFT[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    PhotoNFT[] memory items = new PhotoNFT[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (photoNFTs[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        PhotoNFT storage currentItem = photoNFTs[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
 
  /// @notice Returns all NFTs owned by user
  function fetchMyPhotoNFTs() public view returns (PhotoNFT[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (photoNFTs[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    PhotoNFT[] memory items = new PhotoNFT[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (photoNFTs[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        PhotoNFT storage currentItem = photoNFTs[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /// @notice Returns all NFTs created by user
  function fetchPhotoNFTsCreated() public view returns (PhotoNFT[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (photoNFTs[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    PhotoNFT[] memory items = new PhotoNFT[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (photoNFTs[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        PhotoNFT storage currentItem = photoNFTs[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
}