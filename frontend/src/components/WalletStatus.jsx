import { useWallet } from "../hooks/useWallet.js";

function truncateAddress(address) {
  if (!address) {
    return "";
  }

  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function WalletStatus() {
  const {
    address,
    balance,
    connected,
    isConnecting,
    isLoadingBalance,
    error,
    hasProvider,
    isSepolia,
    wrongNetwork,
    connectWallet,
    switchToSepolia,
  } = useWallet();

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-violet-500">EnigMart Wallet</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">Connect your wallet</h1>
          <p className="mt-3 max-w-xl text-slate-600">
            Use MetaMask to identify yourself and show your SCT balance. The wallet state persists across refreshes and updates automatically after transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!connected ? (
            <button
              onClick={connectWallet}
              disabled={!hasProvider || isConnecting}
              className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Connected address</p>
              <p className="mt-2 font-mono text-lg text-slate-900">{truncateAddress(address)}</p>
            </div>
          )}
        </div>
      </div>

      {!hasProvider && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          MetaMask is not installed. Please install MetaMask and reload the page.
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {connected && wrongNetwork && (
        <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <p className="font-semibold">Wrong network.</p>
          <p className="mt-2">Please switch MetaMask to Sepolia to view your SCT balance.</p>
          <button
            type="button"
            onClick={switchToSepolia}
            className="mt-4 inline-flex items-center rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Switch to Sepolia
          </button>
        </div>
      )}

      {connected && isSepolia && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Wallet</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">{truncateAddress(address)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">SCT balance</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">{isLoadingBalance ? "Loading..." : balance ?? "0.00"} SCT</p>
          </div>
        </div>
      )}
    </div>
  );
}
