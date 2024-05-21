import React, { useState, useEffect , useRef} from "react";
import Web3, { WebSocketProvider } from "web3";
import BigNumber from "bignumber.js";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

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

  flashBot.on('executeSuccess', function(sendAmount, receiveAmount){
    setLogs(prevLog => [...prevLog, `success calling contract`]);
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
      setLogs(prevLog => [...prevLog, `failed calling contract or No profit.`]);

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

  const logRef1 = useRef(null);
    useEffect(() => {
      const logContainer = logRef1.current;
      if (logContainer.scrollHeight > logContainer.clientHeight) {
        logContainer.scrollTop = logContainer.scrollHeight;
      }
  }, [logs]);

  return (
    <Container maxWidth="md" sx={{
      width: {
        lg: '600px',
        md: '400px'
      },
      marginTop:'50px'
    }}
    >
    <Box>
      FlashLoan Bot
    </Box>
    <Box my={2} sx={{
      width: {
        lg: '600px',
        md: '400px'
      },
      marginBottom:'50px'

    }}>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="left"
        spacing={0.5}
      >
       <TextField
          required
          id="outlined-required"
          label="token address"
          size="small"
          defaultValue={tokenAddress} 
          value={tokenAddress} 
          onChange={(e)=>{
            console.log(e.target.value);
            setTokenAddress(e.target.value)
          }}
          sx={{mr:2}}
        />
      <Button variant="contained" onClick={widthraw}>widthraw</Button>
      </Stack>
    </Box>
      <p sx={{textAlign:'left', fontWeight:500 }}>pair 1 ({pairsJaon.case1.borrowTokenName} -> {pairsJaon.case1.swapTokenName}) :</p>
      <Box ref={logRef1} id="logContainer" sx={{overflowY:'scroll', height:'300px', marginTop: '20px', border:'1px solid #eee'}} >
        {logs.map((log, i)=>{
          return (<div key={i} style={{margin:20}}>{log}</div>)
        })
      }
      </Box>
      <p sx={{textAlign:'left'}}>pair 2 ({pairsJaon.case1.borrowTokenName} -> {pairsJaon.case1.swapTokenName}) :</p>
      <Box ref={logRef} id="logContainer1" sx={{overflowY:'scroll', height:'300px', marginTop: '20px', border:'1px solid #eee'}} >  
        {logs.map((log, i)=>{
          return (<div key={i} style={{margin:20}}>{log}</div>)
        })
      }
      </Box>
    </Container>
  );
}
