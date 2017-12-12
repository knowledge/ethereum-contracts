pragma solidity ^0.4.18;

import './Token.sol';

contract Payment {
  Token private token;

  function Payment(address tokenAddress) {
    token = Token(tokenAddress);
  }

  event Recived(
    address from,
    uint256 amount,
    string ref
  );

  function pay(address to, uint256 amount, string ref ) public returns (bool) {
    Recived(msg.sender, amount, ref);
    token.transfer(to, amount);
    return true;
  }
}
