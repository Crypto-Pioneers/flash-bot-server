import React, { useState, useEffect , useRef} from "react";
import Web3, { WebSocketProvider } from "web3";
import BigNumber from "bignumber.js";

import { subscribeToPriceAndBlockNumChanges } from "./coinGeckoService";
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
  const [blockNumber, setBlockNumber] = useState(null);
  const [err, setErr] = useState("");
  const [logs, setLogs] = useState([]);
  const [tokenAddress, setTokenAddress] = useState("");

  // connect wallet
  const { address: admin } = web3.eth.accounts.wallet.add(
    CONSTANTS.PRIVATE_KEY
  );
  const handlePriceChange = async (
    price,
    isTransactionActive,
    status,
    responseBlockNum
  ) => {
    // setEthereumPrice(price);
    // setStatus(status);
    // setBlockNumber(responseBlockNum!=null ? responseBlockNum.toString():  "");

    // setLogs(logs => {
    //   logs.push(`price: $${price}, status: ${status}, block number: ${responseBlockNum}`);
    //   console.log('logs', logs);
    //   return logs;
    // });

    setLogs(prevLog => [...prevLog, `price: $${price}, status: ${status}, block number: ${responseBlockNum}`]);

    if (isTransactionActive) {
      setLogs(prevLog => [...prevLog, `call contract.`]);

       // await executeFlashBot(pairsJaon.case1);
       // await executeFlashBot(pairsJaon.case2);
    }
  };

  flashBot.executeSuccess((sendAmount, receiveAmount) => {
    const profit = receiveAmount - sendAmount;
    if (profit > 0) {
      setLogs(prevLog => [...prevLog, `after call contract, profit ${profit}.`]);
    }
  });

  const executeFlashBot = async (pairParam) => {
    try {
      const res = await flashBot.methods
        .execute(
          pairParam.borrowTokenAddress,
          pairParam.swapTokenAddress,
          parseInt(pairParam.amount),
          pairParam.routerAddress,
          "0x",
          { from: admin }
        )
        .call();
      // console.log("contract reach out ", res);
      // console.log('env test', process.env.REACT_TEST_KEY);
    } catch (e) {
      // console.log('error', e);
      // console.error("error code", e.code);
      // console.log('env test', process.env.REACT_TEST_KEY);
      setErr(e.innerError);

      // console.error("contract error", e.toString());
    }
  };



  const startPolling = () => {
    const subscription = subscribeToPriceAndBlockNumChanges(handlePriceChange);
    return subscription;
  };

  const widthraw = () => {
    if (tokenAddress == "") {
      return alert("please input token address");
    }
    try {
      const res = flashBot.method.widthraw(tokenAddress, {from:admin});

    }
    catch(e) {
      console.log('error', e)
      alert('error', e);
    }
  }
  useEffect(() => {

    const subscription = startPolling();

    return () => {
      subscription();
    };
  }, []);


  const logRef = useRef(null);
    useEffect(() => {
      const logContainer = logRef.current;
      if (logContainer.scrollHeight > logContainer.clientHeight) {
        logContainer.scrollTop = logContainer.scrollHeight;
      }
  }, [logs]);

  return (
    <div className="" >
    <div style={{margin:20}}>
      <input placeholder="token address" value={tokenAddress} onChange={(e)=>{
        console.log(e.target.value);
        setTokenAddress(e.target.value)
      }}/>
      <button onClick={widthraw}>widthraw</button>
    </div>
      <p style={{marginLeft:20}}>pair 1:</p>
      <div ref={logRef} id="logContainer" style={{overflowY:'scroll', height:'300px', marginTop: '50px'}} >
        {logs.map((log, i)=>{
          return (<div key={i} style={{margin:20}}>{log}</div>)
        })
      }
      </div>
      <p style={{marginLeft:20}}>pair 2:</p>
      <div ref={logRef} id="logContainer1" style={{overflowY:'scroll', height:'300px', marginTop: '50px'}} >  
        {logs.map((log, i)=>{
          return (<div key={i} style={{margin:20}}>{log}</div>)
        })
      }
      </div>
    </div>
  );
}
