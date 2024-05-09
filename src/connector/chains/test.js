// const pancakeMainnet = require('./pancake-mainnet.json');
// const pancakeTestnet = require('./pancake-testnet.json');
// const pantherMainnet = require('./panther-mainnet.json');
// const bakeryMainnet = require('./bakery-mainnet.json');
// const apeMainnet = require('./ape-mainnet.json');

const BNB_MAINNET = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
const BUSD_MAINNET = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
const TFT_MAINNET = '0x8f0FB159380176D324542b3a7933F0C2Fd0c2bbf';
const BTCB_MAINNET = '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c';

module.exports = {
  // mainnet: {
  //   pancake: pancakeMainnet,
  //   panther: pantherMainnet,
  //   bakery: bakeryMainnet,
  //   // ape: apeMainnet,
  // },
  // testnet: {
  //   pancake: pancakeTestnet,
  // },
  pairs: [
    {
      name: 'BNB to BUSD, pancake>panther',
      amountTokenPay: process.env.BNB_AMOUNT,
      tokenPay: BUSD_MAINNET,
      tokenSwap: BNB_MAINNET,
      // sourceRouter: pancakeMainnet.router,
      // targetRouter: pantherMainnet.router,
      // sourceFactory: pancakeMainnet.factory,
    },
  ]
}