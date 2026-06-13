import { useState, useEffect } from 'react';

/**
 * useWallet - Hook for MetaMask wallet connection
 * TODO: Implement MetaMask connection logic in SCH-006
 */
export function useWallet() {
  const [account, setAccount] = useState(null);
  const [connected, setConnected] = useState(false);

  // TODO: Implement MetaMask connection
  const connect = async () => {
    // Implementation coming in SCH-006
  };

  const disconnect = () => {
    setAccount(null);
    setConnected(false);
  };

  return {
    account,
    connected,
    connect,
    disconnect,
  };
}
