const { expect } = require("chai");
const { ethers } = require("hardhat");
// const Marketplace = artifacts.require("./Marketplace.sol");
// const NFT = artifacts.require("./NFT.sol");

describe("Marketplace", function () {
  it("should add first account as owner", async () => {
    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy();
    await market.deployed();
    expect(market.signer.address).equals(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );
  });

  it("should come with set listingPrice", async function () {
    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy();
    await market.deployed();
    const price = await market.getListingPrice();
    const listingPrice = ethers.utils.formatEther(price);
    expect(listingPrice).does.not.equal("");
    expect(listingPrice).equals("0.01");
  });

  it("does not allow users to create listings with a price of 0", async function () {
    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("0", "ether");

    /* create two photo NFTs */
    await nft.createToken(
      "https://ipfs.io/ipfs/QmQKWCoR8sz9r1mERBrZ67wUqSJXpDdgV3ETJeDhAZ7uaR/22879.png"
    );

    try {
      await market.createPhotoNFT(nftContractAddress, 1, auctionPrice, {
        value: listingPrice,
      });
    } catch (err) {
      expect(err).to.exist;
      expect(err.toString()).to.contain("Price must be at least 1 wei");
    }
  });

  it("throws error if listing price is incorrect", async function () {
    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice -= 500000000;
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create two photo NFTs */
    await nft.createToken(
      "https://ipfs.io/ipfs/QmQKWCoR8sz9r1mERBrZ67wUqSJXpDdgV3ETJeDhAZ7uaR/22879.png"
    );

    try {
      await market.createPhotoNFT(nftContractAddress, 1, auctionPrice, {
        value: listingPrice,
      });
    } catch (err) {
      expect(err).to.exist;
      expect(err.toString()).to.contain("Price must be equal to listing price");
    }
  });

  it("should create and execute market sales", async function () {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create two photo NFTs */
    await nft.createToken(
      "https://ipfs.io/ipfs/QmQKWCoR8sz9r1mERBrZ67wUqSJXpDdgV3ETJeDhAZ7uaR/22879.png"
    );
    await nft.createToken(
      "https://ipfs.io/ipfs/QmQKWCoR8sz9r1mERBrZ67wUqSJXpDdgV3ETJeDhAZ7uaR/22879.png"
    );

    /* put both NFTs for sale */
    await market.createPhotoNFT(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.createPhotoNFT(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    /* execute sale of NFT to another user */
    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice });

    /* query for and return the unsold items */
    items = await market.fetchUnsoldPhotoNFTs();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);
  });

  it("throws error if item price is incorrect", async function () {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create two photo NFTs */
    await nft.createToken(
      "https://ipfs.io/ipfs/QmQKWCoR8sz9r1mERBrZ67wUqSJXpDdgV3ETJeDhAZ7uaR/22879.png"
    );
    await nft.createToken(
      "https://ipfs.io/ipfs/QmQKWCoR8sz9r1mERBrZ67wUqSJXpDdgV3ETJeDhAZ7uaR/22879.png"
    );

    /* put both NFTs for sale */
    await market.createPhotoNFT(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.createPhotoNFT(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    /* execute sale of NFT to another user */
    try {
      await market
        .connect(buyerAddress)
        .createMarketSale(nftContractAddress, 1, {
          value: 10,
        });
    } catch (err) {
      expect(err).to.exist;
      expect(err.toString()).to.contain(
        "Try again! You must submit the exact price of the photo NFT that you wish to purchase!"
      );
    }
  });
});
