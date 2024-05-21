import Axios from "axios";
import CONSTANTS from "../../constants/index.json";
import Web3, { WebSocketProvider } from "web3";

const COINGECKO_PRICE_API_URL = CONSTANTS.COINGECKO_URL;

export const subscribeToPriceAndBlockNumChanges = (callback) => {
  let prevPrice = null;
  let prevBlockNum = null;
  let intervalId = null;
  let connectCnt = 0;

  const web3 = new Web3(
    new WebSocketProvider(
      CONSTANTS.BSC_WSS,
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
    try {
      // console.log("start");
      connectCnt++;
      // console.log("connectCnt", connectCnt);
      const responsePrices = await Axios.get(COINGECKO_PRICE_API_URL);
      const responseBlockNum = await web3.eth.getBlockNumber();
      console.log('responsePrices', responsePrices?.data);
      const price = responsePrices?.data?.binancecoin?.usd;
      if (!price) {
        throw new Error("Unable to fetch Ethereum price.");
      }

      if (prevPrice == null) prevPrice = price;
      if (prevBlockNum == null) prevBlockNum = responseBlockNum;

      let isTransactionActive = false;
      if (
        price !== prevPrice &&
        prevPrice != null &&
        prevBlockNum != null &&
        responseBlockNum !== prevBlockNum
      ) {
        isTransactionActive = true;
      }

      prevPrice = price;
      prevBlockNum = responseBlockNum;
      // console.log('blocknumber', responseBlockNum);
      
      callback(
        price,
        isTransactionActive,
        "success",
        responseBlockNum
      );
    } catch (error) {
      // console.log('blocknumber', prevBlockNum);
      callback(
        prevPrice,
        false,
        "Too many requests.",
        prevBlockNum
      );

      // console.error("Error while fetching Ethereum price:", error.toString());
    }
  }, 1000 * 3); // Poll every 10 seconds

  return () => {
    clearInterval(intervalId);
  };
};
