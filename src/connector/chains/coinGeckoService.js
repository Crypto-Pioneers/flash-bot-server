import Axios from "axios";
import Web3, { WebSocketProvider } from "web3";

export const subscribeToPriceAndBlockNumChanges = (callback) => {
  let prevPrice = 0;
  let prevBlockNum = null;
  let intervalId = null;
  let connectionStatus = true;

  const web3 = new Web3(
    new WebSocketProvider(
      process.env.REACT_APP_BSC_WSS,
      {},
      {
        maxAttempts: 15,
      }
    )
  );
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(async () => {

    const responseBlockNum = await web3.eth.getBlockNumber();
   
    if (prevBlockNum == null) prevBlockNum = responseBlockNum;
    
    let price = 0;

    try {

      const responsePrices = await Axios.get(process.env.REACT_APP_COINGECKO_URL);

      price = responsePrices?.data?.binancecoin?.usd;
      
      if (!price) {
        throw new Error("Unable to fetch Ethereum price.");
      }

      if (prevPrice == null) prevPrice = price;
      
    } catch (error) {
      connectionStatus = false;
      console.error("Error while fetching Ethereum price:", error.toString());
    }

    let isTransactionActive = false;
    
    if (
       
      prevPrice != null &&
      price !== prevPrice  &&
      prevBlockNum != null &&
      responseBlockNum !== prevBlockNum
    ) {
      isTransactionActive = true;
    }
    
    prevBlockNum = responseBlockNum;
    prevPrice = price;

    callback(
      price,
      isTransactionActive,
      connectionStatus,
      responseBlockNum
    );
  }, 1000 * 3); // Poll every 10 seconds

  return () => {
    clearInterval(intervalId);
  };
};
