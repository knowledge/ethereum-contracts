pragma solidity ^0.4.18;

import { StandardToken } from 'zeppelin/contracts/token/StandardToken.sol';


/**
 * Payment interface to bind
 */
contract Payment is StandardToken {
  event Pay(address from, address to, uint256 amount, string ref);

  function pay(address to, uint256 amount, string ref) public returns (bool) {
    assert(transfer(to, amount));
    Pay(msg.sender, to, amount, ref);
    return true;
  }
}
