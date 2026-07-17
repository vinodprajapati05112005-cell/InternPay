import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Shield,
  Globe,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Lock,
  RefreshCw,
} from 'lucide-react';

const wallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect with the most popular browser wallet',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: '🦊',
    popular: true,
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Scan with your mobile wallet app',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: '🔗',
    popular: false,
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Connect with Coinbase Wallet extension',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    icon: '💰',
    popular: false,
  },
];

const ConnectWallet = () => {
  const [connecting, setConnecting] = useState(null);
  const [connected, setConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [copied, setCopied] = useState(false);

  const mockAddress = '0x7a23...9F21';
  const fullMockAddress = '0x7a23B4cD89eF01234567890AbCdEf12345679F21';

  const handleConnect = (wallet) => {
    setConnecting(wallet.id);
    setSelectedWallet(wallet);
    setTimeout(() => {
      setConnecting(null);
      setConnected(true);
    }, 2000);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setSelectedWallet(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-50 rounded-full opacity-20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo / Branding */}
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
          <p className="text-slate-500">Link your Web3 wallet to access the escrow platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <AnimatePresence mode="wait">
            {connected ? (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Success Header */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Wallet Connected!</h2>
                  <p className="text-slate-500 text-sm">
                    Successfully connected via {selectedWallet?.name}
                  </p>
                </div>

                {/* Wallet Details */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                  {/* Address */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">Address</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {mockAddress}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        title="Copy address"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Network */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">Network</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-slate-900">Ethereum Mainnet</span>
                    </div>
                  </div>
                  {/* Balance */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">Balance</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">2.847 ETH</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    to="/select-role"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    Continue to Role Selection
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleDisconnect}
                    className="w-full py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Disconnect & Try Another
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
                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    InternPay never stores your private keys. All transactions are signed directly in your wallet.
                  </p>
                </div>

                {/* Wallet Options */}
                <div className="space-y-3">
                  {wallets.map((wallet, index) => (
                    <motion.button
                      key={wallet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleConnect(wallet)}
                      disabled={connecting !== null}
                      className={`w-full p-4 rounded-xl border ${
                        connecting === wallet.id
                          ? `${wallet.borderColor} ${wallet.bgColor}`
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      } transition-all flex items-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed group`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl ${wallet.bgColor} flex items-center justify-center text-2xl flex-shrink-0`}
                      >
                        {wallet.icon}
                      </div>
                      {/* Text */}
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
                      {/* Arrow / Loading */}
                      <div className="flex-shrink-0">
                        {connecting === wallet.id ? (
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        ) : (
                          <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Connecting State Info */}
                <AnimatePresence>
                  {connecting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center"
                    >
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-slate-600 font-medium">
                        Waiting for {wallets.find((w) => w.id === connecting)?.name} approval...
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Please confirm the connection in your wallet
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
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
