import Axios from "axios";
import CONSTANTS from "../../constants/index.json";
import Web3, { WebSocketProvider } from "web3";

const COINGECKO_PRICE_API_URL = CONSTANTS.COINGECKO_URL;

export const subscribeToEthereumPriceChanges = (callback) => {
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
      const price = responsePrices?.data?.ethereum?.usd;
      if (!price) {
        throw new Error("Unable to fetch Ethereum price.");
      }

      if (prevPrice == null) prevPrice = price;
      if (prevBlockNum == null) prevBlockNum = responseBlockNum;

      // console.log("price", price);
      // console.log("block num", responseBlockNum);
      // console.log(
      //   "blocknum equal",
      //   responseBlockNum !== prevBlockNum ? "ok" : "failed"
      // );
      // console.log("price equal", price !== prevPrice ? "ok" : "failed");
      // console.log("prev block", prevBlockNum);
      // console.log("prev price", prevPrice);

      let isTransactionActive = false;
      if (
        price !== prevPrice &&
        prevPrice != null &&
        prevBlockNum != null &&
        responseBlockNum !== prevBlockNum
      ) {
        isTransactionActive = true;
      }
      callback(
        price,
        isTransactionActive,
        "success connecttion.",
        responseBlockNum
      );
    } catch (error) {
      callback(
        prevPrice,
        false,
        "Too many requests.",
        connectCnt,
        prevBlockNum
      );

      console.error("Error while fetching Ethereum price:", error.toString());
    }
  }, 1000 * 10); // Poll every 10 seconds

  return () => {
    clearInterval(intervalId);
  };
};
