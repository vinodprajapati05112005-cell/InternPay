import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  Lock,
  RefreshCw,
  Shield,
  Wallet,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath } from '../../utils/navigation';
import {
  clearStoredWalletSession,
  formatWeiToEth,
  getExpectedChainId,
  getExpectedChainLabel,
  getChainLabel,
  getStoredWalletSession,
  isWrongNetwork,
  setStoredWalletSession,
  shortenWalletAddress,
} from '../../utils/wallet';

const walletOptions = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect with the most common browser wallet extension.',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: Wallet,
    popular: true,
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Works with Coinbase Wallet or any injected EVM provider.',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Globe,
    popular: false,
  },
  {
    id: 'browser',
    name: 'Any EVM Wallet',
    description: 'Rabby, Brave, and other injected wallets are supported.',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: Zap,
    popular: false,
  },
];

const buildWalletSession = async (walletId) => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  const provider = window.ethereum;
  const [accounts, chainId] = await Promise.all([
    provider.request({ method: 'eth_accounts' }),
    provider.request({ method: 'eth_chainId' }),
  ]);

  const address = accounts?.[0];
  if (!address) {
    return null;
  }

  const balanceWei = await provider.request({
    method: 'eth_getBalance',
    params: [address, 'latest'],
  });

  const walletName = walletOptions.find((wallet) => wallet.id === walletId)?.name || 'Wallet';
  return {
    walletId,
    walletName,
    address,
    shortAddress: shortenWalletAddress(address),
    chainId,
    chainName: getChainLabel(chainId),
    balanceWei,
    balance: formatWeiToEth(balanceWei),
    connectedAt: new Date().toISOString(),
  };
};

const ConnectWallet = () => {
  const { isAuthenticated, user } = useAuth();
  const [walletSession, setWalletSession] = useState(() => getStoredWalletSession());
  const [connectingWalletId, setConnectingWalletId] = useState(null);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const hasProvider = typeof window !== 'undefined' && Boolean(window.ethereum);
  const connected = Boolean(walletSession?.address);
  const wrongNetwork = connected && isWrongNetwork(walletSession?.chainId);
  const expectedChainLabel = getExpectedChainLabel();
  const expectedChainId = getExpectedChainId();
  const nextPath = isAuthenticated ? getDashboardPath(user?.role) : '/select-role';
  const nextLabel = isAuthenticated ? 'Continue to Dashboard' : 'Continue to Role Selection';
  const activeWallet = useMemo(() => {
    if (!walletSession?.walletId) {
      return null;
    }

    return walletOptions.find((wallet) => wallet.id === walletSession.walletId) || null;
  }, [walletSession?.walletId]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum?.on) {
      return undefined;
    }

    const refreshFromProvider = async () => {
      try {
        const stored = getStoredWalletSession();
        const nextSession = await buildWalletSession(stored?.walletId || 'metamask');
        if (nextSession) {
          setStoredWalletSession(nextSession);
          setWalletSession(nextSession);
          setError('');
          return;
        }

        if (stored?.address) {
          clearStoredWalletSession();
          setWalletSession(null);
        }
      } catch {
        // Keep the last known wallet state if the provider refresh fails.
      }
    };

    const handleAccountsChanged = async (accounts) => {
      if (!accounts?.length) {
        clearStoredWalletSession();
        setWalletSession(null);
        return;
      }

      await refreshFromProvider();
    };

    const handleChainChanged = async () => {
      await refreshFromProvider();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
  };
  }, []);

  const switchToExpectedNetwork = async () => {
    if (!hasProvider) {
      setError('No wallet provider was detected in this browser.');
      return;
    }

    setSwitchingNetwork(true);
    setError('');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: expectedChainId }],
      });
    } catch (switchError) {
      if (switchError?.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: expectedChainId,
              chainName: expectedChainLabel,
              rpcUrls: [import.meta.env.VITE_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc'],
              blockExplorerUrls: [import.meta.env.VITE_EXPLORER_URL || 'https://sepolia.arbiscan.io'],
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
              },
            },
          ],
        });
      } else {
        throw switchError;
      }
    } finally {
      setSwitchingNetwork(false);
    }

    const nextSession = await buildWalletSession(walletSession?.walletId || 'metamask');
    if (nextSession) {
      setStoredWalletSession(nextSession);
      setWalletSession(nextSession);
    }
  };

  useEffect(() => {
    if (!hasProvider) {
      return;
    }

    if (!walletSession?.address) {
      return;
    }

    const stored = getStoredWalletSession();
    if (!stored?.address) {
      return;
    }

    const refresh = async () => {
      try {
        const nextSession = await buildWalletSession(stored.walletId || 'metamask');
        if (nextSession) {
          setStoredWalletSession(nextSession);
          setWalletSession(nextSession);
        }
      } catch {
        // Avoid breaking the page if a provider rejects the refresh request.
      }
    };

    void refresh();
  }, [hasProvider, walletSession?.address]);

  const connectWallet = async (wallet) => {
    setConnectingWalletId(wallet.id);
    setError('');

    try {
      if (!hasProvider) {
        throw new Error('No injected wallet was detected. Install MetaMask or use an EVM browser wallet first.');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const nextSession = await buildWalletSession(wallet.id);

      if (!nextSession) {
        throw new Error('The wallet did not return an account.');
      }

      setStoredWalletSession(nextSession);
      setWalletSession(nextSession);
      setCopied(false);
    } catch (connectError) {
      setError(connectError?.message || 'Unable to connect wallet right now.');
    } finally {
      setConnectingWalletId(null);
    }
  };

  const handleCopy = async () => {
    if (!walletSession?.address) {
      return;
    }

    try {
      await navigator.clipboard.writeText(walletSession.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Unable to copy the wallet address.');
    }
  };

  const handleDisconnect = () => {
    clearStoredWalletSession();
    setWalletSession(null);
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-50 rounded-full opacity-20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900">
              Intern<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pay</span>
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Connect Your Wallet</h1>
          <p className="text-slate-500">Use an injected EVM wallet to sign in and save your on-chain address.</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!hasProvider && !connected && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No wallet provider was detected in this browser. Install MetaMask or another EVM wallet extension to continue.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <AnimatePresence mode="wait">
            {connected ? (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Wallet Connected</h2>
                  <p className="text-slate-500 text-sm">
                    {activeWallet?.name || walletSession?.walletName || 'Wallet'} is connected and ready.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                  {wrongNetwork && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      Please switch MetaMask to {expectedChainLabel} before continuing.
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">Address</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {walletSession?.shortAddress || shortenWalletAddress(walletSession?.address)}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        title="Copy address"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">Network</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-slate-900">
                        {walletSession?.chainName || getChainLabel(walletSession?.chainId)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">Balance</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {walletSession?.balance || formatWeiToEth(walletSession?.balanceWei)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">Provider</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {activeWallet?.name || walletSession?.walletName || 'Injected wallet'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to={nextPath}
                    aria-disabled={wrongNetwork}
                    tabIndex={wrongNetwork ? -1 : 0}
                    className={`w-full py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 ${
                      wrongNetwork
                        ? 'bg-slate-300 text-slate-500 pointer-events-none'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/30'
                    }`}
                  >
                    {nextLabel}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  {wrongNetwork && (
                    <button
                      type="button"
                      onClick={() => void switchToExpectedNetwork()}
                      disabled={switchingNetwork}
                      className="w-full py-3 border border-amber-200 rounded-xl font-semibold text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {switchingNetwork ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Switching Network...
                        </>
                      ) : (
                        'Switch to Arbitrum Sepolia'
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="w-full py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Disconnect Wallet
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="wallets"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    InternPay never stores private keys. Your wallet signs the connection directly in your browser.
                  </p>
                </div>

                <div className="space-y-3">
                  {walletOptions.map((wallet, index) => {
                    const Icon = wallet.icon;
                    const isConnecting = connectingWalletId === wallet.id;

                    return (
                      <motion.button
                        key={wallet.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        onClick={() => void connectWallet(wallet)}
                        disabled={connectingWalletId !== null}
                        className={`w-full p-4 rounded-xl border ${
                          isConnecting ? `${wallet.borderColor} ${wallet.bgColor}` : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        } transition-all flex items-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed group`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl ${wallet.bgColor} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className={`w-6 h-6 text-slate-700`} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{wallet.name}</span>
                            {wallet.popular && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">{wallet.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {isConnecting ? (
                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                          ) : (
                            <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
                  <p className="text-sm text-slate-600 font-medium">
                    {hasProvider
                      ? 'Approve the connection request in your wallet to continue.'
                      : 'Install a browser wallet first, then return here to connect.'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Once connected, your wallet address can be saved to your account during registration.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-slate-500 text-sm">
            Don&apos;t have a wallet?{' '}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
            >
              Get MetaMask
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </p>
          <p className="text-slate-400 text-sm">
            or{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              sign in with email
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ConnectWallet;
