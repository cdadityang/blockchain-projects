pragma solidity ^0.5.12;

import './PacktToken.sol';
import './SafeMath.sol';

contract PacktTokenSale {
  PacktToken public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokensSold;
  address owner;

  event Sell(address indexed _buyer, uint256 indexed _amount);

  constructor(PacktToken _tokenContract, uint256 _tokenPrice) public {
    owner = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }

  function buyTokens(uint256 _numberOfTokens) public payable {
    // require(msg.value == safeMultiply(_numberOfTokens, tokenPrice));
    require(msg.value == SafeMath.mul(_numberOfTokens, tokenPrice));
    require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);

    tokensSold += _numberOfTokens;
    emit Sell(msg.sender, _numberOfTokens);

    require(tokenContract.transfer(msg.sender, _numberOfTokens));
  }

  function endSale() public {
    require(msg.sender == owner);
    require(tokenContract.transfer(owner, tokenContract.balanceOf(address(this))));

    msg.sender.transfer(address(this).balance);
  }

  // Helper
  // function safeMultiply(uint256 x, uint256 y) internal pure returns (uint z) {
  //   require(y == 0 || (z = x * y) / y == x);
  // }
}