import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Clock,
  FileText,
  CheckCircle2,
  Brain,
  ArrowUpRight,
  Calendar,
  Search,
  Send,
  CreditCard,
  Star,
  ChevronRight,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { studentApi, contractApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate, humanizeEnum, daysUntil } from '../../utils/formatters';
import { getUserDisplayName } from '../../utils/navigation';


const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const getScoreColor = (score) => {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'FUNDED':
      return 'bg-emerald-100 text-emerald-700';
    case 'PENDING':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'REJECTED':
      return 'bg-rose-100 text-rose-700 border border-rose-200';
    case 'FAILED':
      return 'bg-red-100 text-red-700 border border-red-200';
    case 'ACTIVE':
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-700';
    case 'SUBMITTED':
      return 'bg-amber-100 text-amber-700';
    case 'COMPLETED':
      return 'bg-violet-100 text-violet-700';
    case 'DISPUTED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const getPaymentStatusBadge = (status) => {
  switch (status) {
    case 'Released':
      return 'bg-emerald-100 text-emerald-700';
    case 'Disputed':
      return 'bg-red-100 text-red-700';
    case 'Pending':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [actionLoading, setActionLoading] = useState({});

  const loadDashboard = async (showSpinner = true) => {
    if (showSpinner) setIsLoading(true);
    setError('');

    try {
      const [dashboardData, contractData, paymentData] = await Promise.all([
        studentApi.dashboard(),
        studentApi.contracts(),
        studentApi.payments(),
      ]);

      setDashboard(dashboardData || {});
      setContracts(Array.isArray(contractData) ? contractData : []);
      setPayments(Array.isArray(paymentData) ? paymentData : []);
    } catch (loadError) {
      setError(loadError?.message || 'Unable to load the student dashboard.');
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard(true);
  }, []);

  const handleAcceptContract = async (contractId) => {
    setActionLoading((prev) => ({ ...prev, [contractId]: 'accept' }));
    setError('');
    setSuccessMessage('');
    try {
      await contractApi.accept(contractId);
      setSuccessMessage('Contract accepted successfully!');
      await loadDashboard(false);
    } catch (err) {
      setError(err?.message || 'Failed to accept contract.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [contractId]: null }));
    }
  };

  const handleRejectContract = async (contractId) => {
    setActionLoading((prev) => ({ ...prev, [contractId]: 'reject' }));
    setError('');
    setSuccessMessage('');
    try {
      await contractApi.reject(contractId);
      setSuccessMessage('Contract rejected successfully.');
      await loadDashboard(false);
    } catch (err) {
      setError(err?.message || 'Failed to reject contract.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [contractId]: null }));
    }
  };


  const pendingContracts = useMemo(
    () => contracts.filter((contract) => contract.status === 'PENDING'),
    [contracts],
  );

  const activeContracts = useMemo(
    () => contracts.filter((contract) => ['ACTIVE', 'FUNDED', 'IN_PROGRESS', 'SUBMITTED'].includes(contract.status)),
    [contracts],
  );


  const recentSubmissions = dashboard?.recent_submissions || [];

  const stats = useMemo(() => {
    const recentScores = recentSubmissions
      .map((submission) => Number(submission.ai_score))
      .filter((score) => Number.isFinite(score));
    const averageScore = recentScores.length
      ? Math.round(recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length)
      : 0;

    return [
      { label: 'Total Contracts', value: dashboard?.total_contracts ?? contracts.length, icon: FileText, color: 'from-slate-500 to-slate-700', bg: 'bg-slate-50', text: 'text-slate-700' },
      { label: 'Active Contracts', value: dashboard?.active_contracts ?? activeContracts.length, icon: Search, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-700' },
      { label: 'Submitted Work', value: dashboard?.submitted_work ?? recentSubmissions.length, icon: Send, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
      { label: 'Pending Payments', value: formatCurrency(dashboard?.pending_payments || 0), icon: CreditCard, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-700' },
      { label: 'Average AI Score', value: `${averageScore || '--'}/100`, icon: Brain, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', text: 'text-pink-700' },
    ];
  }, [activeContracts.length, contracts.length, dashboard, recentSubmissions]);

  const paymentTimeline = useMemo(() => {
    return payments
      .map((payment) => ({
        ...payment,
        displayStatus: payment.status === 'FUNDED' || payment.status === 'Pending' ? 'Pending' : humanizeEnum(payment.status),
      }))
      .slice(0, 5);
  }, [payments]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {getUserDisplayName(user)}. Here&apos;s your live freelance overview.
        </p>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="grid place-items-center min-h-[40vh] text-slate-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.text}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {pendingContracts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 animate-pulse" />
                Contracts Received
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingContracts.map((contract) => (
                  <div key={contract.id} className="p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-slate-900">{contract.title}</h3>
                          <p className="text-sm text-slate-500">{contract.company_name || 'Company'}</p>
                        </div>
                        <span className="font-extrabold text-slate-900 text-lg">{formatCurrency(contract.total_amount || 0)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4 mt-3">
                        <div>
                          <span className="font-medium text-slate-400">Created:</span> {formatDate(contract.created_at)}
                        </div>
                        <div>
                          <span className="font-medium text-slate-400">Deadline:</span> {formatDate(contract.deadline)}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-slate-400">Status:</span>{' '}
                          <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${getStatusBadge(contract.status)}`}>
                            {humanizeEnum(contract.status)}
                          </span>
                        </div>
                        {contract.chain_reference && (
                          <div className="col-span-2 truncate">
                            <span className="font-medium text-slate-400">Ref:</span> {contract.chain_reference}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleAcceptContract(contract.id)}
                        disabled={actionLoading[contract.id]}
                        className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                      >
                        {actionLoading[contract.id] === 'accept' ? (
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Accept'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectContract(contract.id)}
                        disabled={actionLoading[contract.id]}
                        className="flex-1 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                      >
                        {actionLoading[contract.id] === 'reject' ? (
                          <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Reject'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Active Contracts</h2>
                <Link to="/student/contracts" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="p-6 space-y-4">
                {activeContracts.length > 0 ? (
                  activeContracts.map((contract) => {
                    const progress = Number(contract.progress_percent || 0);
                    const daysLeft = daysUntil(contract.deadline);
                    return (
                      <Link
                        key={contract.id}
                        to={`/student/contracts/${contract.id}`}
                        className="block p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                              {contract.title}
                            </h3>
                            <p className="text-sm text-slate-500">{contract.company_name || 'Company'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">{formatCurrency(contract.total_amount || 0)}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(contract.status)}`}>
                              {humanizeEnum(contract.status)}
                            </span>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span>Progress: {contract.completed_milestones || 0}/{contract.milestone_count || 0} milestones</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className={daysLeft !== null && daysLeft <= 7 ? 'text-amber-600 font-medium' : 'text-slate-500'}>
                            {daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days remaining` : 'Overdue') : 'No deadline set'}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No active contracts yet.
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    to="/student/contracts"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                  >
                    <Search className="w-5 h-5" />
                    <span className="font-semibold">Browse Contracts</span>
                  </Link>
                  <Link
                    to="/student/submissions"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    <Send className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">View Submissions</span>
                  </Link>
                  <Link
                    to="/student/payments"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold">Track Payments</span>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent AI Evaluations</h2>
                <div className="space-y-3">
                  {recentSubmissions.length > 0 ? (
                    recentSubmissions.map((submission) => (
                      <Link
                        key={submission.id}
                        to={`/student/submissions/${submission.id}/report`}
                        className="block p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{submission.milestone_title || 'Submission'}</p>
                            <p className="text-xs text-slate-500 truncate">{submission.contract_title || 'Contract'}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <Star className={`w-4 h-4 ${getScoreColor(submission.ai_score || 0)}`} />
                            <span className={`text-lg font-extrabold ${getScoreColor(submission.ai_score || 0)}`}>
                              {submission.ai_score ?? '--'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No submissions yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Payment Timeline</h2>
              <Link to="/student/payments" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {paymentTimeline.length > 0 ? (
                  paymentTimeline.map((payment, index) => (
                    <div key={`${payment.contract_id}-${index}`} className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-3 h-3 rounded-full ${payment.status === 'Released' ? 'bg-emerald-500' : payment.status === 'Disputed' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        {index < paymentTimeline.length - 1 && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200" />
                        )}
                      </div>
                      <div className="flex-1 flex items-center justify-between p-3 rounded-xl bg-slate-50">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{payment.contract_title}</p>
                          <p className="text-xs text-slate-500">
                            Pending: {formatCurrency(payment.pending_amount || 0)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadge(payment.status)}`}>
                            {humanizeEnum(payment.status)}
                          </span>
                          <span className="font-bold text-slate-900">{formatCurrency(payment.released_amount || 0)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No payment history yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
