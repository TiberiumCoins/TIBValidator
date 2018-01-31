let lotion = require('lotion')
let coins = require('coins')
let OracleTx = require('./oracle-tx.js')
let ValidatorReward = require('./validator-reward.js')
let config = require('../config.js')

const oneTIB = 1e8

module.exports = function (opts = {}) {
  let app = lotion({
    // default options
    p2pPort: 46658,
    tendermintPort: 46657,
    genesis: require.resolve('../genesis.json'),
    peers: config.peers.map((addr) => `${addr}:46658`),

    // inherit properties from `opts`
    ...opts
  })

  // create cryptocurrency
  app.use(coins({
    handlers: {
      oracleTx: OracleTx({
        oraclePubkey: '',
        foundersAddress: '',
        foundersPercent: 1
      })
    }
  }))

  // enforce fee rules
  app.use(function (state, tx) {
    // no fees for oracle grants
    if (tx.from[0].type === 'oracleTx') return;

    if (tx.to[0].type !== 'fee') {
      throw Error('First output must pay fee');
    }
    if (tx.to[0].amount !== 0.01 * oneTIB) {
      throw Error('Fee must be 0.01 TIB');
    }
  })

  // pay rewards to validators
  app.use(ValidatorReward({
    perValidatorPerBlock: 0.0016 * oneTIB
  }))

  let lotionPort = opts.lotionPort || 3000
  return app.listen(lotionPort)
}
