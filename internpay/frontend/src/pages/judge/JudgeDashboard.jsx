import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scale,
  Gavel,
  CheckCircle2,
  Target,
  Star,
  ArrowRight,
  Clock,
  AlertTriangle,
  TrendingUp,
  Eye,
  Award,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { judgeApi, disputeApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate, humanizeEnum } from '../../utils/formatters';
import { getUserDisplayName } from '../../utils/navigation';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const statusStyles = {
  OPEN: 'bg-amber-100 text-amber-700',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  UNDER_REVIEW: 'bg-indigo-100 text-indigo-700',
  PARTIALLY_RESOLVED: 'bg-violet-100 text-violet-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  CLOSED: 'bg-slate-100 text-slate-700',
};

const JudgeDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [assignedDisputes, setAssignedDisputes] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [dashboardData, assignedData] = await Promise.all([
          judgeApi.dashboard(),
          disputeApi.assigned(),
        ]);

        if (cancelled) {
          return;
        }

        setDashboard(dashboardData || {});
        setAssignedDisputes(Array.isArray(assignedData) ? assignedData : []);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load the judge dashboard.');
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

  const stats = useMemo(
    () => [
      { label: 'Assigned Disputes', value: dashboard?.assigned_disputes ?? assignedDisputes.length, icon: Scale, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600' },
      { label: 'Open Disputes', value: dashboard?.open_disputes ?? assignedDisputes.filter((item) => ['OPEN', 'ASSIGNED', 'UNDER_REVIEW'].includes(item.status)).length, icon: AlertTriangle, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-600' },
      { label: 'Completed Disputes', value: dashboard?.completed_disputes ?? assignedDisputes.filter((item) => ['RESOLVED', 'PARTIALLY_RESOLVED', 'CLOSED'].includes(item.status)).length, icon: CheckCircle2, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
      { label: 'Avg. Resolution', value: `${dashboard?.average_resolution_hours ?? 0}h`, icon: Target, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600' },
      { label: 'Approved / Partial / Refund', value: `${dashboard?.total_approved ?? 0} / ${dashboard?.total_partial ?? 0} / ${dashboard?.total_rejected ?? 0}`, icon: Star, color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', text: 'text-rose-600' },
    ],
    [assignedDisputes.length, dashboard],
  );

  const recentDecisions = dashboard?.recent_decisions || [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Judge Dashboard</h1>
        <p className="mt-2 text-slate-500 text-lg">
          Welcome back, {getUserDisplayName(user)}. You have {dashboard?.open_disputes ?? 0} open disputes waiting for review.
        </p>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="grid place-items-center min-h-[40vh] text-slate-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.bg} p-2.5 rounded-xl`}>
                    <stat.icon className={`w-5 h-5 ${stat.text}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-slate-300" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-xl">
                      <Gavel className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Active Disputes</h2>
                  </div>
                  <Link to="/judge/disputes" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {assignedDisputes.length > 0 ? (
                  assignedDisputes.map((dispute) => (
                    <div key={dispute.id} className="border border-slate-200 rounded-xl p-5 hover:border-blue-200 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-slate-900">
                              {dispute.project_title || dispute.contract_title || 'Dispute Case'}
                            </h3>
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyles[dispute.status] || 'bg-slate-100 text-slate-700'}`}>
                              {humanizeEnum(dispute.status)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">
                            {dispute.reason ? humanizeEnum(dispute.reason) : 'No reason provided'}
                            {dispute.filed_by_name ? ` - Filed by ${dispute.filed_by_name}` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900">
                            {formatCurrency(dispute.disputed_amount || 0)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {dispute.ai_score !== null && dispute.ai_score !== undefined ? `AI Score: ${dispute.ai_score}/100` : 'No AI score yet'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          {dispute.created_at && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Filed: {formatDate(dispute.created_at)}
                            </span>
                          )}
                          {dispute.dispute_deadline && (
                            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Deadline: {formatDate(dispute.dispute_deadline)}
                            </span>
                          )}
                        </div>
                        <Link
                          to={`/judge/disputes/${dispute.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Review Dispute
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
                    <p className="font-medium">No active disputes</p>
                    <p className="text-sm">Everything is caught up.</p>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    to="/judge/disputes"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Scale className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-700 text-sm">View Disputes</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </Link>
                  <Link
                    to="/judge/reputation"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        <Award className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="font-medium text-slate-700 text-sm">View Reputation</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </Link>
                  <Link
                    to="/judge/profile"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-violet-50 p-2 rounded-lg">
                        <FileText className="w-4 h-4 text-violet-600" />
                      </div>
                      <span className="font-medium text-slate-700 text-sm">My Profile</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-600 transition-colors" />
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Decisions</h2>
                <div className="space-y-3">
                  {recentDecisions.length > 0 ? (
                    recentDecisions.map((decision) => (
                      <div key={decision.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {decision.contract_title || 'Decision'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {humanizeEnum(decision.decision || 'PENDING')}
                            </span>
                            {decision.reason && (
                              <span className="text-xs text-slate-400 truncate">
                                {humanizeEnum(decision.reason)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          {decision.resolved_at && <p className="text-xs text-slate-400">{formatDate(decision.resolved_at)}</p>}
                          {decision.status && (
                            <p className="text-xs font-semibold text-slate-700">{humanizeEnum(decision.status)}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No decisions yet.</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JudgeDashboard;
