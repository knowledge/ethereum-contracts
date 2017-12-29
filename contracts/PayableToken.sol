pragma solidity ^0.4.18;

import { ERC20Token } from './ERC20Token.sol';


/**
 * Payable token is meant to execute the `transfer` method of the ERC20 Token
 * and log a Pay message with a reference message to bind the payment to an
 * order id or some other identifier
 */
contract PayableToken is ERC20Token {
  event Pay(address from, address to, uint256 amount, string ref);

  function pay(address to, uint256 amount, string ref) public returns (bool) {
    assert(transfer(to, amount));
    Pay(msg.sender, to, amount, ref);
    return true;
  }
}
