let { addressHash } = require('coins/src/common.js')

module.exports = function ({ perValidatorPerBlock }) {
  return {
    // this is a block handler, run it each time a block is made
    type: 'block',
      middleware (state, chainInfo) {
      for (let pubkey in chainInfo.validators) {
        // remove first byte because that just tells us the type
        let pubkeyBuf = Buffer.from(pubkey, 'hex').slice(1)
        let address = addressHash(pubkeyBuf)

        // add to this validator's address
        if (!state.accounts[address]) {
          state.accounts[address] = {
            balance: 0,
            sequence: 0
          }
        }
<<<<<<< HEAD
        state.accounts[address].balance += perValidatorPerBlock * chainInfo.validators[puybkey] % 0.25
=======
	  var value = perValidatorPerBlock * chainInfo.validators[pubkey]
	  var maxValue = 0.00016 * 1e8;
	  state.accounts[address].balance += value > maxValue ? maxValue : value;
>>>>>>> ebceda2927fe1d13eaf5ad506108ca0b1565d125
        console.log("New block made! Validator " + address + " balance: " + (state.accounts[address].balance / 1e8));
      }
    }
  }
}
