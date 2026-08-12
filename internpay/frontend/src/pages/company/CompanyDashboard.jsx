import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  FileText,
  AlertTriangle,
  DollarSign,
  Plus,
  Eye,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Activity,
  Clock,
  Shield,
} from 'lucide-react';
import { companyApi, contractApi, disputeApi, submissionApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate, humanizeEnum } from '../../utils/formatters';
import { getUserDisplayName } from '../../utils/navigation';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const statusColors = {
  DRAFT: 'bg-slate-50 text-slate-700 border border-slate-200',
  ACTIVE: 'bg-blue-50 text-blue-700 border border-blue-200',
  FUNDED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  SUBMITTED: 'bg-amber-50 text-amber-700 border border-amber-200',
  DISPUTED: 'bg-rose-50 text-rose-700 border border-rose-200',
  COMPLETED: 'bg-violet-50 text-violet-700 border border-violet-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border border-slate-200',
  ARCHIVED: 'bg-slate-100 text-slate-600 border border-slate-200',
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
  REJECTED: 'bg-rose-50 text-rose-700 border border-rose-200',
  FAILED: 'bg-red-50 text-red-700 border border-red-200',
};

const activityIcon = (type) => {
  switch (type) {
    case 'submission':
      return <Clock className="w-4 h-4 text-amber-500" />;
    case 'dispute':
      return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    case 'contract':
      return <Briefcase className="w-4 h-4 text-blue-500" />;
    case 'payment':
      return <DollarSign className="w-4 h-4 text-emerald-500" />;
    case 'resolved':
      return <CheckCircle2 className="w-4 h-4 text-violet-500" />;
    default:
      return <Activity className="w-4 h-4 text-slate-400" />;
  }
};

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [dashboardData, contractData, submissionData, disputeData] = await Promise.all([
          companyApi.dashboard(),
          contractApi.list(),
          submissionApi.list(),
          disputeApi.list(),
        ]);

        if (cancelled) {
          return;
        }

        setDashboard(dashboardData || {});
        setContracts(Array.isArray(contractData) ? contractData : []);
        setSubmissions(Array.isArray(submissionData) ? submissionData : []);
        setDisputes(Array.isArray(disputeData) ? disputeData : []);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load the company dashboard.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeContracts = useMemo(
    () => contracts.filter((contract) => ['ACTIVE', 'FUNDED', 'IN_PROGRESS', 'SUBMITTED', 'PENDING'].includes(contract.status)),
    [contracts],
  );


  const cards = useMemo(
    () => [
      {
        label: 'Total Contract Value',
        value: formatCurrency(dashboard?.total_value || 0),
        icon: Lock,
        color: 'from-blue-500 to-indigo-600',
      },
      {
        label: 'Active Contracts',
        value: dashboard?.active_contracts ?? activeContracts.length,
        icon: FileText,
        color: 'from-emerald-500 to-teal-600',
      },
      {
        label: 'Funded Contracts',
        value: dashboard?.funded_contracts ?? contracts.filter((contract) => contract.status === 'FUNDED').length,
        icon: Shield,
        color: 'from-amber-500 to-orange-600',
      },
      {
        label: 'Completed Contracts',
        value: dashboard?.completed_contracts ?? contracts.filter((contract) => contract.status === 'COMPLETED').length,
        icon: CheckCircle2,
        color: 'from-violet-500 to-purple-600',
      },
      {
        label: 'Disputed Contracts',
        value: dashboard?.disputed_contracts ?? disputes.length,
        icon: AlertTriangle,
        color: 'from-rose-500 to-red-600',
      },
    ],
    [activeContracts.length, contracts, dashboard, disputes.length],
  );

  const recentActivity = useMemo(() => {
    const contractItems = (dashboard?.recent_contracts || contracts.slice(0, 3)).map((contract) => ({
      id: `contract-${contract.id}`,
      type: contract.status === 'FUNDED' ? 'payment' : 'contract',
      text: `${contract.title} is ${humanizeEnum(contract.status).toLowerCase()}`,
      time: contract.created_at || contract.createdAt || contract.created,
      link: `/company/contracts/${contract.id}`,
    }));

    const submissionItems = submissions.slice(0, 3).map((submission) => ({
      id: `submission-${submission.id}`,
      type: 'submission',
      text: `${submission.student_name || 'A student'} submitted ${submission.milestone_title || 'a milestone'} for ${submission.contract_title || 'a contract'}`,
      time: submission.submitted_at || submission.created_at,
      link: `/company/submissions/${submission.id}`,
    }));

    const disputeItems = disputes.slice(0, 3).map((dispute) => ({
      id: `dispute-${dispute.id}`,
      type: dispute.status === 'RESOLVED' ? 'resolved' : 'dispute',
      text: `${dispute.contract_title || 'A contract'} dispute is ${humanizeEnum(dispute.status).toLowerCase()}`,
      time: dispute.created_at,
      link: `/company/disputes/${dispute.id}`,
    }));

    return [...contractItems, ...submissionItems, ...disputeItems]
      .filter((item) => item.time)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  }, [contracts, dashboard?.recent_contracts, disputes, submissions]);

  const totalContracts = dashboard?.total_contracts ?? contracts.length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Company Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {getUserDisplayName(user)}. Here&apos;s what is happening right now.
        </p>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid place-items-center min-h-[40vh] text-slate-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {cards.map((stat, index) => (
              <motion.div
                key={stat.label}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Active Contracts
                </h2>
                <Link to="/company/contracts" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {activeContracts.length > 0 ? (
                activeContracts.map((contract, index) => {
                  const milestones = contract.milestones || [];
                  const completedMilestones = contract.completed_milestones ?? milestones.filter((milestone) => milestone.status === 'APPROVED').length;
                  const totalMilestones = contract.milestone_count ?? milestones.length;
                  const progress = contract.progress_percent ?? (totalMilestones ? Math.round((completedMilestones / totalMilestones) * 100) : 0);

                  return (
                    <motion.div
                      key={contract.id}
                      custom={index + 5}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{contract.title}</h3>
                          <p className="text-sm text-slate-500">
                            {contract.student_name || 'No student assigned'} - {humanizeEnum(contract.status)}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[contract.status] || 'bg-slate-50 text-slate-600'}`}>
                          {humanizeEnum(contract.status)}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-500 font-medium">Milestone Progress</span>
                          <span className="text-xs font-semibold text-slate-700">
                            {completedMilestones}/{totalMilestones}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="font-semibold text-slate-700">{formatCurrency(contract.total_amount || 0)}</span>
                          {contract.deadline && <span>Due: {formatDate(contract.deadline)}</span>}
                        </div>
                        <Link
                          to={`/company/contracts/${contract.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                  No active contracts yet. Start by creating your first contract.
                </div>
              )}
            </div>

            <div className="space-y-6">
              <motion.div
                custom={7}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link
                    to="/company/contracts/create"
                    className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Create Contract
                  </Link>
                  <Link
                    to="/company/contracts"
                    className="flex items-center gap-3 w-full px-4 py-3 bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    <Lock className="w-4 h-4" />
                    Lock Funds (Fund Contracts)
                  </Link>
                  <Link
                    to="/company/contracts"
                    className="flex items-center gap-3 w-full px-4 py-3 bg-rose-50 text-rose-700 rounded-xl font-semibold text-sm hover:bg-rose-100 transition-colors border border-rose-200"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Stop Fund Releasing (Pause)
                  </Link>
                  <Link
                    to="/company/submissions"
                    className="flex items-center gap-3 w-full px-4 py-3 bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    <Eye className="w-4 h-4" />
                    View Submissions
                  </Link>
                  <Link
                    to="/company/disputes"
                    className="flex items-center gap-3 w-full px-4 py-3 bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    View Disputes
                  </Link>
                </div>
              </motion.div>

              <motion.div
                custom={8}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((item) => (
                      <Link key={item.id} to={item.link} className="flex gap-3 group">
                        <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                          {activityIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2">{item.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatDate(item.time)}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No activity yet.</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Contracts</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalContracts}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Submissions Awaiting Review</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {submissions.filter((submission) => ['SUBMITTED', 'EVALUATING', 'HUMAN_REVIEW'].includes(submission.status)).length}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Open Disputes</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {disputes.filter((dispute) => ['OPEN', 'ASSIGNED', 'UNDER_REVIEW'].includes(dispute.status)).length}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyDashboard;
