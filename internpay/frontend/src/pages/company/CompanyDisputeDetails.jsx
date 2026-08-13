import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertTriangle,
  Brain,
  Calendar,
  DollarSign,
  ExternalLink,
  User,
  Shield,
  Clock,
  FileText,
  MessageSquare,
  CheckCircle2,
  Gavel,
  AlertCircle,
  Wallet,
  Lock,
  Loader2,
} from 'lucide-react';
import { disputeApi, submissionApi } from '../../services/api';
import { formatCurrency, formatDate, formatDateTime, humanizeEnum } from '../../utils/formatters';
import { depositDisputeBondOnChain, getEscrowExplorerTxUrl, hasEscrowContractConfig } from '../../utils/blockchain';

const statusColors = {
  OPEN: 'bg-amber-50 text-amber-700 border-amber-200',
  ASSIGNED: 'bg-blue-50 text-blue-700 border-blue-200',
  UNDER_REVIEW: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  PARTIALLY_RESOLVED: 'bg-violet-50 text-violet-700 border-violet-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
};

const priorityColor = {
  high: 'bg-rose-50 text-rose-700 border-rose-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-blue-50 text-blue-700 border-blue-200',
};

const CompanyDisputeDetails = () => {
  const { id } = useParams();
  const [dispute, setDispute] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [bondAmount, setBondAmount] = useState('');
  const [bondError, setBondError] = useState('');
  const [bondSuccess, setBondSuccess] = useState('');
  const [bondTxHash, setBondTxHash] = useState('');
  const [isDepositingBond, setIsDepositingBond] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadDispute = async () => {
      setIsLoading(true);
      setError('');

      try {
        const disputeData = await disputeApi.detail(id);
        if (cancelled) {
          return;
        }

        setDispute(disputeData || null);

        if (disputeData?.submission) {
          const submissionData = await submissionApi.detail(disputeData.submission);
          if (!cancelled) {
            setSubmission(submissionData || null);
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load the dispute.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadDispute();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const timeline = useMemo(() => {
    if (!dispute) {
      return [];
    }

    return [
      { label: 'Work Submitted', date: submission?.submitted_at || dispute.created_at, icon: FileText, completed: true },
      { label: 'AI Evaluation Complete', date: submission?.evaluated_at || dispute.created_at, icon: Brain, completed: Boolean(submission?.ai_report || submission?.ai_score) },
      { label: 'Dispute Filed', date: dispute.created_at, icon: AlertTriangle, completed: true },
      { label: 'Assigned Judge', date: dispute.created_at, icon: Gavel, completed: Boolean(dispute.assigned_judge_name) },
      { label: 'Resolution', date: dispute.resolved_at || dispute.dispute_deadline, icon: CheckCircle2, completed: Boolean(dispute.decision) },
    ];
  }, [dispute, submission]);

  const escrowId = submission?.contract_metadata?.escrow_id || submission?.contract_metadata?.escrowId || '';
  const milestoneOrder = Number(submission?.milestone_order || 0);
  const hasMilestoneOrder = Number.isFinite(milestoneOrder) && milestoneOrder > 0;
  const hasOnChainEscrow = Boolean(escrowId && hasMilestoneOrder && hasEscrowContractConfig());
  const disputeStatus = String(dispute?.status || '').toUpperCase();
  const canDepositBond = Boolean(dispute && !dispute.resolved_at && ['OPEN', 'ASSIGNED', 'UNDER_REVIEW'].includes(disputeStatus));

  const handleDepositBond = async () => {
    if (!canDepositBond) {
      return;
    }

    const amount = String(bondAmount || '').trim();
    if (!amount || Number(amount) <= 0) {
      setBondError('Enter a dispute bond amount greater than zero.');
      return;
    }

    if (!escrowId) {
      setBondError('This dispute does not have an escrow id yet.');
      return;
    }

    if (!hasMilestoneOrder) {
      setBondError('Unable to resolve the milestone order for this dispute.');
      return;
    }

    if (!hasOnChainEscrow) {
      setBondError('Set VITE_ESCROW_CONTRACT_ADDRESS to deposit the dispute bond on-chain.');
      return;
    }

    setIsDepositingBond(true);
    setBondError('');
    setBondSuccess('');

    try {
      const result = await depositDisputeBondOnChain({
        escrowId,
        milestoneId: milestoneOrder,
        amountEth: amount,
      });

      setBondTxHash(result.txHash);
      setBondSuccess(`Company bond locked on-chain for ${amount} ETH.`);
    } catch (depositError) {
      setBondError(depositError?.message || 'Unable to lock the dispute bond.');
    } finally {
      setIsDepositingBond(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-slate-500">Loading dispute...</div>
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Dispute not found</h2>
          <p className="text-slate-500 mt-2">{error || 'The dispute could not be loaded.'}</p>
          <Link to="/company/disputes" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Back to Disputes
          </Link>
        </div>
      </div>
    );
  }

  const evidenceList = Array.isArray(dispute.evidence) ? dispute.evidence : [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/company/disputes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Disputes
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-extrabold text-slate-900">{dispute.project_title || dispute.contract_title || 'Dispute Case'}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[dispute.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {humanizeEnum(dispute.status)}
              </span>
              {dispute.priority && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${priorityColor[String(dispute.priority).toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {humanizeEnum(dispute.priority)} Priority
                </span>
              )}
            </div>
            <p className="text-slate-500 mt-1">
              {dispute.id} · Filed on {formatDate(dispute.created_at)}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Dispute Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">Contract</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{dispute.contract_title || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><DollarSign className="w-3 h-3" /> Amount</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{formatCurrency(dispute.disputed_amount || 0)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Brain className="w-3 h-3" /> AI Score</p>
                <p className="text-sm font-extrabold mt-1 text-slate-900">{dispute.ai_score !== null && dispute.ai_score !== undefined ? `${dispute.ai_score}/100` : 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> Deadline</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{dispute.dispute_deadline ? formatDate(dispute.dispute_deadline) : 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 mb-1">Filed By</p>
                <p className="font-semibold text-slate-900">{dispute.filed_by_name || 'Unknown'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 mb-1">Assigned Judge</p>
                <p className="font-semibold text-slate-900">{dispute.assigned_judge_name || 'Unassigned'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 mb-1">Student</p>
                <p className="font-semibold text-slate-900">{dispute.student_name || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 mb-1">Company</p>
                <p className="font-semibold text-slate-900">{dispute.company_name || 'N/A'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Company Claim
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                <p className="text-xs font-semibold text-rose-700 mb-1">Reason: {humanizeEnum(dispute.reason)}</p>
                <p className="text-sm text-rose-800 leading-relaxed whitespace-pre-wrap">{dispute.description}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Evidence</p>
                <div className="space-y-2">
                  {evidenceList.length > 0 ? evidenceList.map((item, index) => {
                    const url = typeof item === 'string' ? item : item?.url || item?.path || '';
                    const label = typeof item === 'string' ? item : item?.description || item?.name || item?.url || `Evidence ${index + 1}`;

                    return (
                      <a
                        key={index}
                        href={url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{label}</span>
                      </a>
                    );
                  }) : (
                    <p className="text-sm text-slate-500">No evidence attached.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {submission && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" /> Submission
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Milestone</p>
                  <p className="text-sm font-semibold text-slate-900">{submission.milestone_title || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Status</p>
                  <p className="text-sm font-semibold text-slate-900">{humanizeEnum(submission.status)}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {Object.entries(submission.links || {}).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> {key}
                  </a>
                ))}
              </div>
              {submission.additional_notes && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Additional Notes</p>
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">{submission.additional_notes}</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Timeline
            </h2>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={item.label} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.completed ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-1 ${item.completed ? 'bg-blue-200' : 'bg-slate-200'}`} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-semibold ${item.completed ? 'text-slate-900' : 'text-slate-400'}`}>{item.label}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(item.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {canDepositBond && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.275 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-50 p-2 rounded-xl">
                  <Wallet className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Dispute Bond</h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Add a company bond while the dispute is open. If you win, the bond is returned to your wallet. If you lose, the bond is paid to the judge.
              </p>

              {bondError && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {bondError}
                </div>
              )}

              {bondSuccess && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  <div>{bondSuccess}</div>
                  {bondTxHash && getEscrowExplorerTxUrl(bondTxHash) && (
                    <a
                      href={getEscrowExplorerTxUrl(bondTxHash)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                      View bond transaction
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Bond Amount (ETH)</label>
              <input
                type="number"
                step="0.000001"
                inputMode="decimal"
                value={bondAmount}
                onChange={(event) => setBondAmount(event.target.value)}
                placeholder="0.01"
                className="w-full px-4 py-2.5 mb-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />

              <button
                type="button"
                onClick={() => void handleDepositBond()}
                disabled={isDepositingBond}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm hover:from-amber-600 hover:to-orange-600 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDepositingBond ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Lock Company Bond
              </button>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" /> Resolution
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Decision</span>
                <span className="font-semibold text-slate-900">{dispute.decision ? humanizeEnum(dispute.decision) : 'Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Resolution Amount</span>
                <span className="font-semibold text-slate-900">{formatCurrency(dispute.resolution_amount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Judge Reward</span>
                <span className="font-semibold text-slate-900">{formatCurrency(dispute.judge_reward || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Resolved At</span>
                <span className="font-semibold text-slate-900">{dispute.resolved_at ? formatDateTime(dispute.resolved_at) : 'Pending'}</span>
              </div>
              {dispute.decision_reason && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-slate-500 mb-1">Judge Notes</p>
                  <p className="text-slate-700 whitespace-pre-wrap">{dispute.decision_reason}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDisputeDetails;
