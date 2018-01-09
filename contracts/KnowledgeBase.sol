pragma solidity ^0.4.18;

import { Knowledge } from './KnowledgeToken.sol';


/**
 * Knowledge Base Contract, used to create the initial tokens
 * Upgradable Standard ECR20 Token
 */
contract KnowledgeBase is Knowledge {
  function KnowledgeBase() public {
    balances[msg.sender] = INITIAL_SUPPLY;
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }
}
