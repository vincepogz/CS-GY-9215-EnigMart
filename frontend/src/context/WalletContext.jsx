import { createContext, useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";

const SEPOLIA_CHAIN_ID = "0xaa36a7";
const STORAGE_KEY = "enigmart_wallet_connected";
const ERC20_ABI = ["function balanceOf(address) view returns (uint256)"];

export const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [error, setError] = useState(null);

  const hasProvider = typeof window !== "undefined" && typeof window.ethereum !== "undefined";
  const provider = hasProvider ? new BrowserProvider(window.ethereum) : null;
  const tokenAddress = import.meta.env.VITE_SCT_TOKEN_ADDRESS;

  const isSepolia = chainId === SEPOLIA_CHAIN_ID;
  const wrongNetwork = connected && !isSepolia;

  const clearError = () => setError(null);

  const fetchBalance = async (walletAddress = address) => {
    if (!provider || !walletAddress || !isSepolia) {
      setBalance(null);
      return;
    }

    if (!tokenAddress) {
      setBalance(null);
      setError("SCT token address is not configured.");
      return;
    }

    try {
      setIsLoadingBalance(true);
      setError(null);
      const token = new Contract(tokenAddress, ERC20_ABI, provider);
      const rawBalance = await token.balanceOf(walletAddress);
      const formatted = ethers.formatUnits(rawBalance, 18);
      const numeric = Number(formatted);
      setBalance(Number.isFinite(numeric) ? numeric.toFixed(2) : "0.00");
    } catch (err) {
      console.error(err);
      setBalance(null);
      setError("Unable to load SCT balance.");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      setAddress(accounts[0]);
      setConnected(true);
      localStorage.setItem(STORAGE_KEY, "true");
      await fetchBalance(accounts[0]);
      return;
    }

    disconnect();
  };

  const handleChainChanged = async (chain) => {
    setChainId(chain);
    await fetchBalance(address);
  };

  const connectWallet = async () => {
    clearError();

    if (!hasProvider) {
      setError("MetaMask is not installed.");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      await handleAccountsChanged(accounts);

      const currentChain = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(currentChain);
    } catch (err) {
      if (err?.code === 4001) {
        setError("MetaMask connection rejected.");
      } else {
        console.error(err);
        setError("Unable to connect to MetaMask.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    setChainId(null);
    setConnected(false);
    setIsLoadingBalance(false);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchToSepolia = async () => {
    clearError();

    if (!hasProvider) {
      setError("MetaMask is not installed.");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (err) {
      if (err?.code === 4001) {
        setError("Wallet switch rejected.");
      } else {
        console.error(err);
        setError("Unable to switch to Sepolia.");
      }
    }
  };

  useEffect(() => {
    if (!hasProvider) {
      setError("MetaMask is not installed.");
      return;
    }

    const initialize = async () => {
      const cached = localStorage.getItem(STORAGE_KEY) === "true";
      if (!cached) {
        return;
      }

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        const currentChain = await window.ethereum.request({ method: "eth_chainId" });

        if (Array.isArray(accounts) && accounts.length > 0) {
          setAddress(accounts[0]);
          setConnected(true);
          setChainId(currentChain);
          await fetchBalance(accounts[0]);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (err) {
        console.error(err);
      }
    };

    initialize();

    const onAccountsChanged = (accounts) => {
      handleAccountsChanged(accounts);
    };

    const onChainChanged = (chain) => {
      handleChainChanged(chain);
    };

    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener("chainChanged", onChainChanged);
    };
  }, [hasProvider]);

  useEffect(() => {
    if (!provider || !address || !isSepolia) {
      return;
    }

    const onBlock = async () => {
      await fetchBalance(address);
    };

    provider.on("block", onBlock);

    return () => {
      provider.off("block", onBlock);
    };
  }, [provider, address, isSepolia]);

  const value = useMemo(
    () => ({
      address,
      balance,
      chainId,
      connected,
      isConnecting,
      isLoadingBalance,
      error,
      hasProvider,
      isSepolia,
      wrongNetwork,
      connectWallet,
      disconnect,
      switchToSepolia,
    }),
    [
      address,
      balance,
      chainId,
      connected,
      isConnecting,
      isLoadingBalance,
      error,
      hasProvider,
      isSepolia,
      wrongNetwork,
    ],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
