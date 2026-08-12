import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  User,
  Lock,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
  Zap,
  Eye,
  UserPlus,
  X,
  Loader2,
  Send,
} from 'lucide-react';
import { contractApi } from '../../services/api';
import { formatCurrency, formatDate, humanizeEnum } from '../../utils/formatters';

const statusColors = {
  ACTIVE: 'bg-blue-50 text-blue-700 border-blue-200',
  FUNDED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  SUBMITTED: 'bg-amber-50 text-amber-700 border-amber-200',
  COMPLETED: 'bg-violet-50 text-violet-700 border-violet-200',
  DISPUTED: 'bg-rose-50 text-rose-700 border-rose-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
  DRAFT: 'bg-slate-50 text-slate-600 border-slate-200',
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
  REJECTED: 'bg-rose-50 text-rose-700 border border-rose-200',
  FAILED: 'bg-red-50 text-red-700 border border-red-200',
};

const milestoneTimeline = ['Created', 'Funded', 'Work Submitted', 'AI Evaluation', 'Dispute Window', 'Released'];

const CompanyContractDetails = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [studentInput, setStudentInput] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');
  const [isPausing, setIsPausing] = useState(false);
  const [pauseError, setPauseError] = useState('');

  const handleTogglePause = async () => {
    setIsPausing(true);
    setPauseError('');
    try {
      if (contract.is_paused) {
        await contractApi.unpause(id);
      } else {
        await contractApi.pause(id);
      }
      await reloadContract();
    } catch (err) {
      setPauseError(err?.message || `Failed to ${contract.is_paused ? 'resume' : 'pause'} contract.`);
    } finally {
      setIsPausing(false);
    }
  };

  const reloadContract = async () => {
    try {
      const data = await contractApi.detail(id);
      setContract(data || null);
    } catch {}
  };

  const handleAssignStudent = async (e) => {
    e.preventDefault();
    if (!studentInput.trim()) {
      setAssignError('Please enter a student email, profile ID, or wallet address.');
      return;
    }
    setIsAssigning(true);
    setAssignError('');
    try {
      await contractApi.assignStudent(id, { student_id: studentInput.trim() });
      setAssignSuccess('Student assigned successfully! Contract proposal converted to Pending and sent.');
      setShowAssignModal(false);
      setStudentInput('');
      await reloadContract();
    } catch (err) {
      setAssignError(err?.message || 'Failed to assign student to contract.');
    } finally {
      setIsAssigning(false);
    }
  };

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

  const milestones = contract?.milestones || [];
  const completedMilestones = contract?.completed_milestones ?? milestones.filter((milestone) => milestone.status === 'APPROVED').length;
  const milestoneCount = contract?.milestone_count ?? milestones.length;
  const progress = contract?.progress_percent ?? (milestoneCount ? Math.round((completedMilestones / milestoneCount) * 100) : 0);

  const lifecycleSteps = useMemo(() => {
    const isStarted = ['FUNDED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'DISPUTED'].includes(contract?.status);
    const isSubmitted = ['SUBMITTED', 'COMPLETED', 'DISPUTED'].includes(contract?.status);
    const isEvaluated = ['COMPLETED', 'DISPUTED'].includes(contract?.status);
    const isResolved = contract?.status === 'COMPLETED';

    return milestoneTimeline.map((stage, index) => ({
      label: stage,
      completed: index === 0 || (index === 1 && isStarted) || (index === 2 && isSubmitted) || (index === 3 && isEvaluated) || (index === 4 && isEvaluated) || (index === 5 && isResolved),
    }));
  }, [contract?.status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-slate-500">Loading contract...</div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Contract not found</h2>
          <p className="text-slate-500 mt-2">{error || 'The contract could not be loaded.'}</p>
          <Link to="/company/contracts" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Back to Contracts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-inter">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/company/contracts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Contracts
        </Link>

        {assignSuccess && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 flex items-center justify-between">
            <span>{assignSuccess}</span>
            <button onClick={() => setAssignSuccess('')} className="text-emerald-500 hover:text-emerald-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {pauseError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-center justify-between">
            <span>{pauseError}</span>
            <button onClick={() => setPauseError('')} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-extrabold text-slate-900">{contract.title}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[contract.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {humanizeEnum(contract.status)}
              </span>
              {contract.is_paused && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" /> PAUSED
                </span>
              )}
            </div>
            <p className="text-slate-500 mt-1">{contract.id}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {(contract.status === 'DRAFT' || !contract.student) && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-semibold text-sm transition-all shadow-lg"
              >
                <UserPlus className="w-4 h-4" /> Assign Student & Send Proposal
              </button>
            )}
            {contract.status === 'ACTIVE' && (
              <Link
                to={`/company/contracts/${contract.id}/fund`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                <Lock className="w-4 h-4" /> Fund Contract
              </Link>
            )}
            {['FUNDED', 'IN_PROGRESS', 'SUBMITTED'].includes(contract.status) && (
              <button
                onClick={handleTogglePause}
                disabled={isPausing}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all disabled:opacity-60 ${
                  contract.is_paused 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                {isPausing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : contract.is_paused ? (
                  <Zap className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                {contract.is_paused ? 'Resume Contract' : 'Pause Contract'}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Contract Overview</h2>
          <p className="text-sm text-slate-600 mb-5 whitespace-pre-wrap">{contract.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><User className="w-3 h-3" /> Student</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{contract.student_name || 'Not assigned'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><DollarSign className="w-3 h-3" /> Total Amount</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{formatCurrency(contract.total_amount || 0)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Lock className="w-3 h-3" /> Funded</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{formatCurrency(contract.funded_amount || 0)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> Deadline</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{formatDate(contract.deadline)}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500 font-medium">Overall Progress</span>
              <span className="text-xs font-semibold text-slate-700">
                {completedMilestones}/{milestoneCount} milestones
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" /> Escrow Lifecycle
          </h2>
          <div className="space-y-3">
            {lifecycleSteps.map((stage, index) => (
              <div key={stage.label} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${stage.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {index + 1}
                </div>
                <span className={`text-sm font-medium ${stage.completed ? 'text-slate-900' : 'text-slate-500'}`}>{stage.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Project Requirements</h2>
        <div className="flex flex-wrap gap-2">
          {(contract.requirements || []).length > 0 ? (
            contract.requirements.map((item, index) => (
              <span key={index} className="text-xs bg-slate-50 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200">
                {typeof item === 'string' ? item : JSON.stringify(item)}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">No requirements listed for this contract.</p>
          )}
        </div>
        {contract.notes && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs font-semibold text-blue-700 mb-1">Notes</p>
            <p className="text-sm text-blue-800 whitespace-pre-wrap">{contract.notes}</p>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Milestones</h2>
        <div className="space-y-4">
          {milestones.length > 0 ? milestones.map((milestone, index) => {
            const isApproved = milestone.status === 'APPROVED';
            const isDisputed = milestone.status === 'REJECTED';
            const isSubmitted = milestone.status === 'SUBMITTED' || milestone.status === 'UNDER_REVIEW';
            const timelineStep = isApproved ? 5 : isSubmitted ? 3 : 1;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    {isApproved ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : isDisputed ? <AlertTriangle className="w-5 h-5 text-rose-500" /> : isSubmitted ? <Clock className="w-5 h-5 text-amber-500" /> : <Zap className="w-5 h-5 text-blue-500" />}
                    <div>
                      <h3 className="font-semibold text-slate-900">{milestone.title}</h3>
                      <p className="text-sm text-slate-500">
                        Due: {formatDate(milestone.deadline)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">{formatCurrency(milestone.amount || 0)}</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[milestone.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {humanizeEnum(milestone.status)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
                  {lifecycleSteps.map((step, stepIndex) => (
                    <React.Fragment key={step.label}>
                      <div className={`flex-shrink-0 px-2 py-1 rounded-md text-[10px] font-semibold ${stepIndex <= timelineStep ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>
                        {step.label}
                      </div>
                      {stepIndex < lifecycleSteps.length - 1 && (
                        <div className={`flex-shrink-0 w-4 h-0.5 ${stepIndex < timelineStep ? 'bg-blue-400' : 'bg-slate-200'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <p className="text-sm text-slate-600 whitespace-pre-wrap">{milestone.description}</p>

                <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Order #{milestone.order}
                  </div>
                  {milestone.submitted_at && <div className="text-xs text-slate-500">Submitted: {formatDate(milestone.submitted_at)}</div>}
                  {milestone.approved_at && <div className="text-xs text-slate-500">Approved: {formatDate(milestone.approved_at)}</div>}
                  {milestone.rejected_at && <div className="text-xs text-slate-500">Rejected: {formatDate(milestone.rejected_at)}</div>}
                </div>
              </motion.div>
            );
          }) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              No milestones have been added to this contract yet.
            </div>
          )}
        </div>
      </motion.div>

      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 font-inter"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                Assign Student to Contract
              </h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-500">
              Enter the student's email address, profile ID, or wallet address. This will convert the draft contract into a Pending proposal and send it to the student.
            </p>

            {assignError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {assignError}
              </div>
            )}

            <form onSubmit={handleAssignStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student Email / Profile ID / Wallet
                </label>
                <input
                  type="text"
                  value={studentInput}
                  onChange={(e) => setStudentInput(e.target.value)}
                  placeholder="e.g. student@example.com or 0x..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {isAssigning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Assign & Send Proposal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CompanyContractDetails;
