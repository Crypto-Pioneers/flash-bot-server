import React, { useState, useEffect , useRef} from "react";
import Web3, { WebSocketProvider } from "web3";
import BigNumber from "bignumber.js";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import moment from 'moment'

import { subscribeToPriceAndBlockNumChanges } from "./coinGeckoService";
import FlashBot from "../out/Flashloanbot.sol/Flashloanbot.json";
import pairsJaon from "../utils/json/pairs.json";
import "./chain.css";

const pair = pairsJaon.case1;
const web3 = new Web3(
  new WebSocketProvider(
    process.env.REACT_APP_BSC_WSS,
    {},
    {
      maxAttempts: 15,
    }
  )
);
const { address: admin } = web3.eth.accounts.wallet.add(process.env.REACT_APP_PRIVATE_KEY);
const flashBot = new web3.eth.Contract(FlashBot.abi, process.env.REACT_APP_ADDRESS_BSC);

export default function App() {
  const [ethereumPrice, setEthereumPrice] = useState(null);
  const [status, setStatus] = useState("");
  const [connectCnt, setConnectCnt] = useState(0);
  const [blockNumber, setBlockNumber] = useState(null);
  const [err, setErr] = useState("");
  const [logs, setLogs] = useState([]);
  const [tokenAddress, setTokenAddress] = useState("");
  const [isPolling, setIsPolling] = useState(false);


  const getTime = () => {
    return moment().format('YY/MM/DD HH:mm:ss'); 
  }
 
  const handlePriceChange = async (
    price,
    isTransactionActive,
    status,
    responseBlockNum
  ) => {
    const time = getTime();

    setLogs(prevLog => [...prevLog, `${time}, <span class="price-color">price:</span> $${price}, <span class="connected-color">connected:</span> ${status}, <span class="blocknum-color">block number:</span> ${responseBlockNum}`]);

    if (isTransactionActive) {
      setLogs(prevLog => [...prevLog, `${time}, call contract...`]);
     await executeFlashBot(pairsJaon.case1);
     await executeFlashBot(pairsJaon.case2);
    }
  };

  flashBot.on('executeSuccess', function(sendAmount, receiveAmount){
    const time = getTime();
    setLogs(prevLog => [...prevLog, `${time}, success calling contract`]);
    const profit = receiveAmount - sendAmount;
    if (profit > 0) {
      setLogs(prevLog => [...prevLog, `${time}, after call contract, profit ${profit}.`]);
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
    } catch (e) {
      console.log('error', e.innerError);
      // console.error("error code", e.code);
      const time = getTime();
      setErr(e.innerError);
      setLogs(prevLog => [...prevLog, `timss:${time}, ${e.innerError}`]);

      // console.error("contract error", e.toString());
    }
  };



  const startPolling = () => {
    const subscription = subscribeToPriceAndBlockNumChanges(handlePriceChange);
    return subscription;
  };

  const withdraw = () => {
    if (tokenAddress == "") {
      return alert("please input token address");
    }
    try {
      const res = flashBot.method.withdraw(tokenAddress, {from:admin});

    }
    catch(e) {
      console.log('error', e)
      alert("can't withdraw");
    }
  }

  const startService = () => {
    setIsPolling(true);
  };

  const stopService = () => {
    setIsPolling(false);
  };


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

  useEffect(() => {
    if (isPolling) {
      const subscription = startPolling();
      return () => {
        subscription();
      };
    }
  }, [isPolling]);

  return (
    <Container maxWidth="md" sx={{
      width: {
        lg: '800px',
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
          value={tokenAddress} 
          onChange={(e)=>{
            console.log(e.target.value);
            setTokenAddress(e.target.value)
          }}
          sx={{mr:2}}
        />
      <Button variant="contained" onClick={withdraw}>withdraw</Button>
      </Stack>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="left"
        spacing={0.5}
        sx={{marginTop: '50px'}}
      >
      <Button variant="contained" disabled={isPolling} onClick={startService}>Start</Button>
      <Button variant="contained" disabled={!isPolling} color="error" onClick={stopService}>Stop</Button>
      </Stack>
    </Box>
      <p sx={{textAlign:'left', fontWeight:500 }}>pair 1 ({pairsJaon.case1.borrowTokenName} -> {pairsJaon.case1.swapTokenName}) :</p>
      <Box ref={logRef1} id="logContainer" sx={{overflowY:'scroll', height:'300px', marginTop: '20px', border:'1px solid #eee'}} >
        {logs.map((log, i)=>{
          return (<div key={i} style={{margin:20}} dangerouslySetInnerHTML={{__html: log }}></div>)
        })
      }
      </Box>
      <p sx={{textAlign:'left'}}>pair 2 ({pairsJaon.case1.borrowTokenName} -> {pairsJaon.case1.swapTokenName}) :</p>
      <Box ref={logRef} id="logContainer1" sx={{overflowY:'scroll', height:'300px', marginTop: '20px', marginBottom: '50px', border:'1px solid #eee'}} >  
        {logs.map((log, i)=>{
          return (<div key={i} style={{margin:20}} dangerouslySetInnerHTML={{__html: log }}></div>)
        })
      }
      </Box>
    </Container>
  );
}
