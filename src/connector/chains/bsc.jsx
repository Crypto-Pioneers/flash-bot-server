import React, { useState, useEffect } from "react";
import Web3, { WebSocketProvider } from "web3";
import BigNumber from "bignumber.js";

import { subscribeToEthereumPriceChanges } from "./coinGeckoService";
import FlashBot from "../out/Flashloanbot.sol/Flashloanbot.json";
import CONSTANTS from "../../constants/index.json";
import pairsJaon from "../utils/json/pairs.json";
import "./chain.css";

const pair = pairsJaon.case1;
const web3 = new Web3(
  new WebSocketProvider(
    CONSTANTS.BSC_WSS,
    {},
    {
      maxAttempts: 15,
    }
  )
);
const { address: admin } = web3.eth.accounts.wallet.add(CONSTANTS.PRIVATE_KEY);
const flashBot = new web3.eth.Contract(FlashBot.abi, CONSTANTS.ADDRESS_BSC);

export default function App() {
  const [ethereumPrice, setEthereumPrice] = useState(null);
  const [status, setStatus] = useState("");
  const [connectCnt, setConnectCnt] = useState(0);
  const [profit, setProfit] = useState(0);
  const [blockNum, setBlockNum] = useState("");

  // connect wallet
  const { address: admin } = web3.eth.accounts.wallet.add(
    CONSTANTS.PRIVATE_KEY
  );

  const handlePriceChange = async (
    price,
    isTransactionActive,
    status,
    connectCnt,
    responseBlockNum
  ) => {
    setConnectCnt(connectCnt);
    setEthereumPrice(price);
    setStatus(status);
    setBlockNum(responseBlockNum);

    // if (isTransactionActive) {
    await executeFlashBot();
    // }
  };

  // flashBot.executeSuccess((sendAmount, receiveAmount) => {
  //   const profit = receiveAmount - sendAmount;
  //   if (profit > 0) {
  //     console.log("profit", profit);
  //     setProfit(profit);
  //   }
  // });

  const executeFlashBot = async () => {
    try {
      const res = await flashBot.methods
        .execute(
          pair.borrowTokenAddress,
          pair.swapTokenAddress,
          parseInt(pair.amount) * 1e18,
          // new BigNumber("1000000000000000000"),
          pair.routerAddress,
          "0x",
          { from: admin }
        )
        .call();
      console.log("contract reach out ", res);
    } catch (e) {
      console.error("error code", e.code);

      console.error("contract error", e.toString());
    }
  };

  const startPolling = () => {
    const subscription = subscribeToEthereumPriceChanges(handlePriceChange);
    return subscription;
  };

  useEffect(() => {
    const subscription = startPolling();

    return () => {
      subscription();
    };
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <table>
          <tr>
            <td className="float-left"> Ethereum Price:</td>
            <td>{ethereumPrice ? `$${ethereumPrice.toFixed(2)}` : "--"}</td>
          </tr>
          <tr>
            <td className="float-left"> connect status:</td>
            <td>{status}</td>
          </tr>
          <tr>
            <td className="float-left"> Block number:</td>
            <td>{blockNum}</td>
          </tr>
          <tr>
            <td className="float-left"> connection cycle:</td>
            <td>5s</td>
          </tr>
        </table>
      </div>
    </div>
  );
}
