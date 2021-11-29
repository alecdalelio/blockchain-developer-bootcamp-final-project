# Reentrancy Guard

Marketplace inherits from OpenZeppelin's ReentrancyGuard in order to protect against reentrancy attacks.

# OnlyOwner Withdrawal

OnlyOwner modifier is used in the Marketplace contract to ensure that only the contract owner can withdraw funds from the contract. The Marketplace contract accrues 1 MATIC per NFT minted on the platform. While this may seem like a small amount, it is certainly worth protecting for any platform with ambitions to scale!
