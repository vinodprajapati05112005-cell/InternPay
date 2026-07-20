import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileText,
  Circle,
  Zap,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { contractApi } from '../../services/api';
import { daysUntil, formatCurrency, formatDate, humanizeEnum } from '../../utils/formatters';

const statusColors = {
  ACTIVE: 'bg-blue-100 text-blue-700',
  FUNDED: 'bg-emerald-100 text-emerald-700',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-green-100 text-green-700',
  DISPUTED: 'bg-red-100 text-red-700',
  SUBMITTED: 'bg-amber-100 text-amber-700',
};

const StudentContractDetails = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
  const totalMilestones = contract?.milestone_count ?? milestones.length;
  const progress = contract?.progress_percent ?? (totalMilestones ? Math.round((completedMilestones / totalMilestones) * 100) : 0);

  const canSubmit = (status) => ['PENDING', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status) || ['ACTIVE', 'FUNDED', 'IN_PROGRESS', 'SUBMITTED'].includes(status);

  const getMilestoneIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return <Send className="w-5 h-5 text-blue-500" />;
      case 'REJECTED':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'PENDING':
        return <Circle className="w-5 h-5 text-slate-300" />;
      default:
        return <Zap className="w-5 h-5 text-amber-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-slate-500">Loading contract...</div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Contract Not Found</h2>
          <p className="text-slate-500 mt-2">{error || "The contract you're looking for doesn't exist."}</p>
          <Link to="/student/contracts" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Contracts
          </Link>
        </div>
      </div>
    );
  }

  const activeMilestones = milestones.filter((milestone) => canSubmit(milestone.status));

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/student/contracts" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Contracts
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-slate-400">{contract.id}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[contract.status] || 'bg-slate-100 text-slate-700'}`}>
                {humanizeEnum(contract.status)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">{contract.title}</h1>
            <p className="text-slate-600 max-w-2xl whitespace-pre-wrap">{contract.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-extrabold text-slate-900">{formatCurrency(contract.total_amount || 0)}</p>
            <p className="text-sm text-slate-500">Total Contract Value</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">Company</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{contract.company_name || 'Company'}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">Deadline</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{formatDate(contract.deadline)}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">Created</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{formatDate(contract.created_at)}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">Funded</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{formatCurrency(contract.funded_amount || 0)}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600 font-medium">Overall Progress</span>
            <span className="font-semibold text-slate-900">{completedMilestones}/{totalMilestones} milestones</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Milestones & Deliverables</h2>
          <Link
            to={`/student/contracts/${contract.id}/submit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            <Send className="w-4 h-4" />
            Submit Work
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {milestones.map((milestone, index) => {
            const daysLeft = daysUntil(milestone.deadline);
            return (
              <div key={milestone.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    {getMilestoneIcon(milestone.status)}
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full min-h-[40px] bg-slate-200 mt-2" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">
                          Milestone {milestone.order}: {milestone.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[milestone.status] || 'bg-slate-100 text-slate-700'}`}>
                          {humanizeEnum(milestone.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-900">{formatCurrency(milestone.amount || 0)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due: {formatDate(milestone.deadline)}</span>
                      </div>
                      {milestone.status !== 'APPROVED' && daysLeft !== null && (
                        <span className={daysLeft <= 3 ? 'text-red-600 font-medium' : daysLeft <= 7 ? 'text-amber-600 font-medium' : ''}>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{milestone.description}</p>

                    {canSubmit(milestone.status) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          to={`/student/contracts/${contract.id}/submit`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                        >
                          <Send className="w-4 h-4" />
                          Submit Work
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentContractDetails;
