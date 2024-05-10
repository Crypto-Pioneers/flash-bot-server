import React, { useState} from "react";

export default function BscTest() {
  const [loop, setLoop] = useState(null);
  const [logs, setLogs] = useState([]);


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
    setLoop(loop)
  }
  
  const stopLoop = () => {
    if (loop !== null) {
      clearInterval(loop);
    } else {
      alert("No loop running");
    }
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