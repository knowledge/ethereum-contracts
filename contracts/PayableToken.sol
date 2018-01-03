pragma solidity ^0.4.18;

import { ERC20Token } from './ERC20Token.sol';


/**
 * Payable token is meant to execute the `transfer` method of the ERC20 Token
 * and log a Pay message with a reference message to bind the payment to an
 * order id or some other identifier
 */
contract PayableToken is ERC20Token {
  struct PaymentRequest {
    uint256 value;
    uint8 fee;
    address seller;
  }

  mapping (address => mapping(string => PaymentRequest)) private pendingPayments;

  event Pay(address from, address to, uint256 amount, string ref);

  function requestPayment(uint256 value, uint8 fee, string ref, address to) public {
    pendingPayments[msg.sender][ref] = PaymentRequest(value, fee, to);
  }

  function paymentInfo(address store, string ref) public view returns (uint256 value, uint8 fee, address seller) {
    PaymentRequest memory paymentRequest = pendingPayments[store][ref];
    value = paymentRequest.value;
    fee = paymentRequest.fee;
    seller = paymentRequest.seller;
  }

  function pay(address store, string ref) public returns (bool) {
    PaymentRequest memory paymentRequest = pendingPayments[store][ref];

    assert(paymentRequest.seller != 0x0);
    assert(transfer(store, paymentRequest.fee));
    assert(transfer(paymentRequest.seller, paymentRequest.value));

    Pay(msg.sender, paymentRequest.seller, paymentRequest.value, ref);

    return true;
  }
}
