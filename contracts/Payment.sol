pragma solidity ^0.4.18;

import { Knowledge } from './Knowledge.sol';

contract Payment {
  Knowledge private token;

  function Payment(address tokenAddress) public {
    token = Knowledge(tokenAddress);
  }

  event Recived(
    address from,
    uint256 amount,
    string ref
  );

  function pay(address to, uint256 amount, string ref ) public returns (bool) {
    Recived(msg.sender, amount, ref);
    // Check DELEGATECALL Homestead
    token.transfer(to, amount);
    return true;
  }
}
