import React, { useState } from "react";
const { pairs } = require("../addresses/bsc/index.js");
// const { pairs } = require('./test.js');
// const { performance } = require('perf_hooks');
const Web3 = require("web3");
// const request = require("async-request");

// const WebSocketProvider = require("web3-providers-ws");
// import Web3 from "web3";
const BigNumber = require("bignumber.js");
// const { performance } = require('perf_hooks');
// const request = require("async-request");

// const Flashswap = require("../out/Flashbot.sol/Flashbot.json");
// const BlockSubscriber = require("../utils/block_subscriber.js");

// const { address: admin } = web3.eth.accounts.wallet.add(
//   process.env.PRIVATE_KEY
// );

// const provider = new WebSocketProvider(
//   process.env.BSC_WSS,
//   {},
//   {
//     delay: 500,
//     autoReconnect: true,
//     maxAttempts: 10,
//   }
// );
// console.log("wss", process.env.REAC_APP_BSC_WSS);
// const web3 = new Web3(
//   new Web3.providers.WebsocketProvider("wss://bsc-rpc.publicnode.com", {
//     reconnect: {
//       auto: true,
//       delay: 5000,
//       maxAttempts: 15,
//       onTimeout: false,
//     },
//   })
// );
// const { address: admin } = Web3EthAcc.Wallet.address(process.env.PRIVATE_KEY);
// const { address: admin } = web3.eth.accounts.wallet.add(
//   "91c45b9775584a7e80075b8f755540f48ab5820739e41fc4fcd26a5720714afb"
// );
// const flashswap = new web3.eth.Contract(
//   Flashswap.abi,
//   "0xb55307DD6483D5991F2D9536b68e059f80712e96"
// );

// const flashswap = Web3EthContract(Flashswap.abi, process.env.ADDRESS_BSC);

export default function BSC() {
  const [loop, setLoop] = useState(null);
  const [logs, setLogs] = useState([]);

  /** start test */

  const testResult = () => {
    return Math.random();
  };

  const loopHandler = async () => {
    const result = await testResult();
    setLogs((prev) => {
      const logsClone = [...prev];
      logsClone.push(result);
      return logsClone;
    });
  };

  const startLoop = () => {
    const loop = setInterval(loopHandler, 2000);
    setLoop(loop);
  };

  const stopLoop = () => {
    if (loop !== null) {
      clearInterval(loop);
    } else {
      alert("No loop running");
    }
  };

  /** end test */
  // const getPrices = async () => {
  //   const response = await request(process.env.COINGECKO_URL);
  //   const prices = {};

  //   try {
  //     const json = JSON.parse(response.body);
  //     prices[process.env.BNB_MAINNET.toLowerCase()] = json.binancecoin.usd;
  //     prices[process.env.BUSD_MAINNET.toLowerCase()] = json.busd.usd;
  //     prices[process.env.ARB_MAINNET.toLowerCase()] = json.arbitrum.usd;
  //     prices[process.env.ETH_MAINNET.toLowerCase()] = json.ethereum.usd;
  //     prices[process.env.BEP20_USDT_MAINNET.toLowerCase()] = json.tether.usd;
  //   } catch (e) {
  //     console.error(e);
  //     return {};
  //   }

  //   return prices;
  // };
  const init = async () => {
    // let nonce = await web3.eth.getTransactionCount(admin);
    // let gasPrice = await web3.eth.getGasPrice();
    // setInterval(async () => {
    //   nonce = await web3.eth.getTransactionCount(admin);
    // }, 1000 * 19);
    // setInterval(async () => {
    //   gasPrice = await web3.eth.getGasPrice();
    // }, 1000 * 60 * 3);
    // const owner = await flashswap.methods.owner().call();
    // console.log(
    //   `started: wallet ${admin} - gasPrice ${gasPrice} - contract owner: ${owner}`
    // );
    // let handler = async () => {
    //   const myPrices = await getPrices();
    //   if (Object.keys(myPrices).length > 0) {
    //     for (const [key, value] of Object.entries(myPrices)) {
    //       prices[key.toLowerCase()] = value;
    //     }
    //   }
    // };
    // await handler();
    // setInterval(handler, 1000 * 60 * 5);
    // const onBlock = async (block, web3, provider) => {
    //   const start = "performance.now()";
    //   const calls = [];
    //   pairs.forEach((pair) => {
    //     calls.push(async () => {
    //       const check = await flashswap.methods
    //         .checkProfitable(
    //           pair.tokenPay,
    //           pair.tokenSwap,
    //           new BigNumber(pair.amountTokenPay * 1e18),
    //           pair.sourceRouter,
    //           pair.targetRouter
    //         )
    //         .call();
    //       const profit = check[0];
    //       let s = pair.tokenPay.toLowerCase(0);
    //       const price = prices[s];
    //       if (!price) {
    //         console.log("invalid price", pair.tokenPay);
    //         return;
    //       }
    //       const profitUsd = (profit / 1e18) * price;
    //       const percentage = (100 * (profit / 1e18)) / pair.amountTokenPay;
    //       console.log(
    //         `[${
    //           block.number
    //         }] [${new Date().toLocaleString()}]: [${provider}] [${
    //           pair.name
    //         }] Arbitrage checked! Expected profit: ${(profit / 1e18).toFixed(
    //           3
    //         )} $${profitUsd.toFixed(2)} - ${percentage.toFixed(2)}%`
    //       );
    //       if (profit > 0) {
    //         console.log(
    //           `[${
    //             block.number
    //           }] [${new Date().toLocaleString()}]: [${provider}] [${
    //             pair.name
    //           }] Arbitrage opportunity found! Expected profit: ${(
    //             profit / 1e18
    //           ).toFixed(3)} $${profitUsd.toFixed(2)} - ${percentage.toFixed(
    //             2
    //           )}%`
    //         );
    //         const tx = flashswap.methods.executeArbitrage(
    //           block.number + process.env.BLOCKNUMBER,
    //           pair.tokenPay,
    //           pair.tokenSwap,
    //           new BigNumber(pair.amountTokenPay * 1e18),
    //           pair.sourceRouter,
    //           pair.targetRouter,
    //           pair.sourceFactory
    //         );
    //         let estimateGas;
    //         try {
    //           estimateGas = await tx.estimateGas({ from: admin });
    //         } catch (e) {
    //           console.log(
    //             `[${block.number}] [${new Date().toLocaleString()}]: [${
    //               pair.name
    //             }]`,
    //             "gasCost error",
    //             e.message
    //           );
    //           return;
    //         }
    //         const myGasPrice = new BigNumber(gasPrice)
    //           .plus(gasPrice * 0.2212)
    //           .toString();
    //       }
    //     });
    //   });
    // };
  };

  return (
    <div>
      <div>
        <button onClick={startLoop}>Start</button>
        <button onClick={stopLoop}>Stop</button>
      </div>
      <ul>
        {logs.map((item, i) => {
          return <li key={i}>{item}</li>;
        })}
      </ul>
    </div>
  );
}
