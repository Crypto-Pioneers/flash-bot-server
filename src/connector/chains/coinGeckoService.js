import Axios from "axios";
import CONSTANTS from "../../constants/index.json";

const COINGECKO_PRICE_API_URL = CONSTANTS.COINGECKO_URL;
const CRYPTO_IDS = ["ethereum"];
const VS_CURRENCIES = "usd";

let prevPrice = null;
let intervalId = null;

export const subscribeToEthereumPriceChanges = (callback) => {
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(async () => {
    try {
      const response = await Axios.get(COINGECKO_PRICE_API_URL);

      const price = response?.data?.ethereum?.usd;
      if (!price) {
        throw new Error("Unable to fetch Ethereum price.");
      }

      if (price !== prevPrice) {
        prevPrice = price;
        callback(price);
      }
    } catch (error) {
      console.error("Error while fetching Ethereum price:", error.toString());
    }
  }, 1000 * 10); // Poll every 5 seconds

  return () => {
    clearInterval(intervalId);
  };
};
