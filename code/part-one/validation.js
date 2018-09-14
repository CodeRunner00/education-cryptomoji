'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');

/**
 * A simple validation function for transactions. Accepts a transaction
 * and returns true or false. It should reject transactions that:
 *   - have negative amounts
 *   - were improperly signed
 *   - have been modified since signing
 */
const isValidTransaction = transaction => {
  // Enter your solution here


  if(transaction.amount < 0) {
    return false;
  }

  const signCombo =  transaction.source + transaction.recipient + transaction.amount


  return signing.verify(transaction.source, signCombo, transaction.signature);

};

/**
 * Validation function for blocks. Accepts a block and returns true or false.
 * It should reject blocks if:
 *   - their hash or any other properties were altered
 *   - they contain any invalid transactions
 */
const isValidBlock = block => {
  // Your code here
  for(var i = 0;i<block.transactions.length; i++) {
    if(!isValidTransaction(block.transactions[i])) {
      return false;
    }
  }

  const hashh = createHash('sha256');
  let transactionString='';
  block.transactions.map(function(transaction) {
    return transactionString += transaction.signature;
  });
  hashh.update(transactionString + block.previousHash + block.nonce);
  let actualHash = hashh.digest('hex');

  if(actualHash === block.hash) {
    return true
  }

  return false;
};

/**
 * One more validation function. Accepts a blockchain, and returns true
 * or false. It should reject any blockchain that:
 *   - is a missing genesis block
 *   - has any block besides genesis with a null hash
 *   - has any block besides genesis with a previousHash that does not match
 *     the previous hash
 *   - contains any invalid blocks
 *   - contains any invalid transactions
 */
const isValidChain = blockchain => {
  // Your code here
  let prevHash;
  let index;
  let block;
  for(let i = 0; i <blockchain.blocks.length; i++ ) {
    index = i;
    block = blockchain.blocks[i]
    if(prevHash) {
      if(block.previousHash !== prevHash) {
        return false;
      }
    }

    if(index === 0) {
      console.log('index 0 block ', block);
      if(block.previousHash !== null) {
        console.log('in index false');
        return false;
      }
    }

    if(!isValidBlock(block)) {
      return false;
    }

    for(var j = 0; j < block.transactions.length; j++) {
      if(!isValidTransaction(block.transactions[j])) {
        return false;
      }
    }
    prevHash = block.hash;

  };

  return true;


};

/**
 * This last one is just for fun. Become a hacker and tamper with the passed in
 * blockchain, mutating it for your own nefarious purposes. This should
 * (in theory) make the blockchain fail later validation checks;
 */
const breakChain = blockchain => {
  // Your code here

};

module.exports = {
  isValidTransaction,
  isValidBlock,
  isValidChain,
  breakChain
};
