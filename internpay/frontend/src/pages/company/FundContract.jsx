import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Lock, DollarSign, Wallet, Globe, CheckCircle2,
  Loader2, Shield, AlertCircle, ExternalLink
} from 'lucide-react';
import { mockContracts } from '../../data/mockData';

const PLATFORM_FEE_RATE = 0.025;

const FundContract = () => {
  const { id } = useParams();
  const contract = mockContracts.find(c => c.id === id);
  const [currentStep, setCurrentStep] = useState(0);
  const [funding, setFunding] = useState(false);

  if (!contract) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Contract not found</h2>
          <Link to="/company/contracts" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Back to Contracts</Link>
        </div>
      </div>
    );
  }

  const contractAmount = contract.totalAmount;
  const platformFee = contractAmount * PLATFORM_FEE_RATE;
  const total = contractAmount + platformFee;

  const steps = [
    { label: 'Approve USDC', description: 'Approve the escrow contract to spend your USDC tokens' },
    { label: 'Lock Funds', description: 'Lock funds into the escrow smart contract' },
    { label: 'Transaction Submitted', description: 'Transaction has been submitted to the blockchain' },
    { label: 'Funds Locked ✓', description: 'Funds are now securely locked in escrow' },
  ];

  const startFunding = () => {
    setFunding(true);
    setCurrentStep(1);

    setTimeout(() => setCurrentStep(2), 2000);
    setTimeout(() => setCurrentStep(3), 4000);
    setTimeout(() => setCurrentStep(4), 5500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to={`/company/contracts/${contract.id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Contract
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900">Fund Contract</h1>
        <p className="text-slate-500 mt-1">{contract.title}</p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Wallet Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" /> Wallet Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium">USDC Balance</p>
              <p className="text-lg font-extrabold text-emerald-600 mt-1">$10,000.00</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium">Wallet Address</p>
              <p className="text-sm font-mono font-semibold text-slate-900 mt-1">0x92...A41B</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Globe className="w-3 h-3" /> Network</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">Ethereum Mainnet</p>
            </div>
          </div>
        </motion.div>

        {/* Payment Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" /> Payment Breakdown
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Contract Amount</span>
              <span className="font-semibold text-slate-900">${contractAmount.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Platform Fee (2.5%)</span>
              <span className="font-semibold text-slate-900">${platformFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="text-slate-900 font-semibold">Total</span>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">${total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Funding Steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" /> Funding Progress
          </h2>
          <div className="space-y-4">
            {steps.map((s, i) => {
              const stepNum = i + 1;
              const isActive = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              const isPending = currentStep < stepNum;

              return (
                <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isCompleted ? 'bg-emerald-50 border-emerald-200' :
                  isActive ? 'bg-blue-50 border-blue-200' :
                  'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : isActive ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <Loader2 className="w-6 h-6 text-blue-600" />
                      </motion.div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs font-bold text-slate-400">
                        {stepNum}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${
                      isCompleted ? 'text-emerald-700' : isActive ? 'text-blue-700' : 'text-slate-500'
                    }`}>{s.label}</p>
                    <p className={`text-xs mt-0.5 ${
                      isCompleted ? 'text-emerald-600' : isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}>{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action */}
          {!funding && (
            <button
              onClick={startFunding}
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Fund Contract — ${total.toFixed(2)} USDC
            </button>
          )}

          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-emerald-800">Funds Successfully Locked!</p>
                <p className="text-xs text-emerald-600 mt-1">Transaction: 0xa1b2c3d4...e5f6g7h8</p>
              </div>
              <Link
                to={`/company/contracts/${contract.id}`}
                className="block w-full py-3 text-center bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                View Contract Details
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FundContract;
