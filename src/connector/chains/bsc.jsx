import React, { useState, useEffect } from "react";
import { subscribeToEthereumPriceChanges } from "./coinGeckoService";

export default function App() {
  const [ethereumPrice, setEthereumPrice] = useState(null);

  const handlePriceChange = (price) => {
    setEthereumPrice(price);
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
      <header className="App-header">
        <h1>Ethereum Price:</h1>
        <span>{ethereumPrice ? `$${ethereumPrice.toFixed(2)}` : "--"}</span>
      </header>
    </div>
  );
}
