# Inheritance

NFT inherits from ERC721URIStorage and Marketplace inherits from ReentrancyGuard. These decisions were made from a place of strategy and security. URIStorage is used so that 

# Counters

I used OpenZeppelin's Counters to track the total number of photo NFTs created and sold in the marketplace. Using Counters is advisable because these numbers can only be incremented or decremented by 1 at a time. This leaves little room for error, prevents any edge cases in the NFT creation process and fits the desired functionality of the application.