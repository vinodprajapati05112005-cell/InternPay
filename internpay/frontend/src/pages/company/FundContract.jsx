import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  Lock,
  Shield,
  Wallet,
} from 'lucide-react';
import { contractApi } from '../../services/api';
import { formatCurrency, formatDate, humanizeEnum } from '../../utils/formatters';

const PLATFORM_FEE_RATE = 0.025;

const fundingSteps = [
  {
    label: 'Review contract',
    description: 'Confirm the live contract details before funding.',
  },
  {
    label: 'Record hash',
    description: 'Add the confirmed transaction hash from Arbitrum Sepolia.',
  },
  {
    label: 'Submit funding',
    description: 'Record the on-chain confirmation in Django after validation.',
  },
  {
    label: 'Funding complete',
    description: 'The contract status updates immediately after confirmation.',
  },
];

const stepStateClasses = {
  complete: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  active: 'bg-blue-50 border-blue-200 text-blue-700',
  pending: 'bg-slate-50 border-slate-200 text-slate-500',
};

const FundContract = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [reference, setReference] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadContract = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await contractApi.detail(id);
        if (!cancelled) {
          setContract(data || null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load the contract.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadContract();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const contractStatus = String(contract?.status || '').toUpperCase();
  const isAlreadyFunded = ['FUNDED', 'COMPLETED', 'CANCELLED', 'ARCHIVED'].includes(contractStatus);
  const contractAmount = Number(contract?.total_amount || 0);
  const platformFee = contractAmount * PLATFORM_FEE_RATE;
  const total = contractAmount + platformFee;
  const milestones = contract?.milestones || [];
  const completedMilestones = contract?.completed_milestones ?? milestones.filter((milestone) => milestone.status === 'APPROVED').length;
  const milestoneCount = contract?.milestone_count ?? milestones.length;
  const hasReference = Boolean(transactionHash.trim() || reference.trim());

  const stepStates = useMemo(() => {
    const fundingComplete = isAlreadyFunded || Boolean(successMessage);
    return [
      'complete',
      hasReference ? 'complete' : 'active',
      isSubmitting ? 'active' : fundingComplete ? 'complete' : hasReference ? 'active' : 'pending',
      fundingComplete ? 'complete' : 'pending',
    ];
  }, [hasReference, isAlreadyFunded, isSubmitting, successMessage]);

  const handleFund = async () => {
    if (!contract || isAlreadyFunded) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const updated = await contractApi.fund(contract.id, {
        transaction_hash: transactionHash.trim(),
        reference: reference.trim(),
      });

      setContract(updated || null);
      setSuccessMessage('Contract funded successfully.');
    } catch (saveError) {
      setError(saveError?.message || 'Unable to fund the contract.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading contract...
        </div>
      </div>
    );
  }

  if (error && !contract) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Contract not found</h2>
          <p className="text-slate-500 mt-2">{error}</p>
          <Link to="/company/contracts" className="text-blue-600 hover:underline text-sm mt-4 inline-block">
            Back to Contracts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link
          to={`/company/contracts/${contract.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Contract
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Fund Contract</h1>
            <p className="text-slate-500 mt-1">{contract.title}</p>
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">
            <Shield className="w-4 h-4" />
            {humanizeEnum(contract.status)}
          </span>
        </div>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Contract Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Company
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{contract.company_name || 'Company'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Wallet className="w-3 h-3" />
                  Student
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{contract.student_name || 'Not assigned'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Deadline
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{formatDate(contract.deadline)}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Milestones
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {completedMilestones}/{milestoneCount} approved
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{contract.description}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              Payment Breakdown
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Contract amount</span>
                <span className="font-semibold text-slate-900">{formatCurrency(contractAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Platform fee</span>
                <span className="font-semibold text-slate-900">{formatCurrency(platformFee)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                <span className="text-slate-900 font-semibold">Total</span>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Funding Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {fundingSteps.map((step, index) => {
              const state = stepStates[index] || 'pending';
              return (
                <div key={step.label} className={`p-4 rounded-xl border ${stepStateClasses[state]}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="font-semibold text-sm">{step.label}</p>
                  </div>
                  <p className="text-xs leading-5 opacity-80">{step.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Confirm Funding
            </h2>

            {isAlreadyFunded ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-700">
                This contract is already {humanizeEnum(contract.status)}.
                {contract.chain_reference ? (
                  <p className="mt-2 font-mono text-xs text-emerald-600 break-all">
                    Reference: {contract.chain_reference}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="space-y-4">
                {/* --- Blockchain Integration Placeholder --- */}
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl mb-6">
                  <h3 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Lock Funds via Blockchain
                  </h3>
                  <p className="text-xs text-indigo-700 mb-4">
                    Securely lock the ETH in the InternPayEscrow smart contract. Once completed, the transaction hash will be filled automatically.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      // TODO for blockchain team: Integrate ethers.js/wagmi here
                      // Example:
                      // const tx = await escrowContract.lockFunds(contract.id, { value: totalWei });
                      // await tx.wait();
                      // setTransactionHash(tx.hash);
                      alert('Blockchain logic placeholder. Please integrate ethers.js to call lockFunds() here.');
                      setTransactionHash('0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''));
                    }}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Lock {formatCurrency(total)} ETH via Web3
                  </button>
                </div>
                {/* -------------------------------------- */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Transaction hash (required)</label>
                  <input
                    type="text"
                    value={transactionHash}
                    onChange={(event) => setTransactionHash(event.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reference</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder="Optional note or payment reference"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleFund}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Confirm Funding
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-indigo-600" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to={`/company/contracts/${contract.id}`}
                className="block w-full py-3 text-center bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                View Contract Details
              </Link>
              <Link
                to="/company/contracts"
                className="block w-full py-3 text-center bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Back to Contracts
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FundContract;
