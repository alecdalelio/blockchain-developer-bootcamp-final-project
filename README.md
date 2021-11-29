# Consensys Bootcamp Final Project

My final project is a barebones implementation of an NFT marketplace for photography NFTs deployed on the Polygon Mumbai Testnet. I used Next JS for the frontend and Hardhat for the contracts and tests.

The project contains two smart contracts: Marketplace and NFT. The NFT contract inherits from OpenZeppelin's ERC721URIStorage. Marketplace inherits from OpenZeppelin's ReentrancyGuard in order to protect against reentrancy attacks.

The frontend provides four basic views: an index/home where all NFTs are displayed, a form to create an NFT, a view for all NFTs purchased by a single user and a view for all NFTs created by that user.

The frontend is deployed on Netlify and can be accessed here: [redacted]

My public Ethereum account is dalel.eth.

To run the project you'll need Hardhat installed. Run npm install or yarn install within the project directory to install hardhat and any other dependencies that may be missing on your machine. To run the frontend locally simply run "npm run dev", and to run the tests run "npx hardhat test"
