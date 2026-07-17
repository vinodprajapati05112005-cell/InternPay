import React from 'react';
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
} from 'lucide-react';
import { mockDisputes, mockJudgeStats } from '../../data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const JudgeDashboard = () => {
  const stats = [
    {
      label: 'Assigned Disputes',
      value: mockJudgeStats.assignedDisputes,
      icon: Scale,
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      label: 'Active Disputes',
      value: mockJudgeStats.activeDisputes,
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
    {
      label: 'Completed Disputes',
      value: mockJudgeStats.completedDisputes,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      label: 'Accuracy Rate',
      value: `${mockJudgeStats.accuracyRate}%`,
      icon: Target,
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
    },
    {
      label: 'Reputation Score',
      value: `${mockJudgeStats.reputationScore}/${mockJudgeStats.maxReputation}`,
      icon: Star,
      color: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
    },
  ];

  const activeDisputes = mockDisputes.filter((d) => d.status === 'Under Review');

  const priorityStyles = {
    High: 'bg-red-100 text-red-700 border border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    Low: 'bg-green-100 text-green-700 border border-green-200',
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Judge Dashboard
        </h1>
        <p className="mt-2 text-slate-500 text-lg">
          Welcome back, Judge Martinez. You have{' '}
          <span className="font-semibold text-blue-600">
            {mockJudgeStats.activeDisputes} active dispute
          </span>{' '}
          requiring your attention.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
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
        {/* Active Disputes */}
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
                <h2 className="text-lg font-semibold text-slate-900">
                  Active Disputes
                </h2>
              </div>
              <Link
                to="/judge/disputes"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {activeDisputes.length > 0 ? (
              activeDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="border border-slate-200 rounded-xl p-5 hover:border-blue-200 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">
                          {dispute.projectTitle}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${priorityStyles[dispute.priority]}`}
                        >
                          {dispute.priority}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {dispute.id} · {dispute.category} · Filed by{' '}
                        {dispute.filedByName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        ${dispute.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">
                        AI Score: {dispute.aiScore}/100
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Deadline: {dispute.deadline}
                      </span>
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {dispute.status}
                      </span>
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
                <p className="text-sm">All disputes have been resolved.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/judge/disputes"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Scale className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-slate-700 text-sm">
                    View Disputes
                  </span>
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
                  <span className="font-medium text-slate-700 text-sm">
                    View Reputation
                  </span>
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
                  <span className="font-medium text-slate-700 text-sm">
                    My Profile
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-600 transition-colors" />
              </Link>
            </div>
          </motion.div>

          {/* Recent Decisions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Recent Decisions
            </h2>
            <div className="space-y-3">
              {mockJudgeStats.decisionHistory.slice(0, 4).map((dec) => {
                const decisionColor =
                  dec.decision === 'Approve Payment'
                    ? 'text-emerald-600 bg-emerald-50'
                    : dec.decision === 'Reject and Refund'
                      ? 'text-red-600 bg-red-50'
                      : 'text-amber-600 bg-amber-50';

                return (
                  <div
                    key={dec.id}
                    className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {dec.project}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${decisionColor}`}
                        >
                          {dec.decision}
                        </span>
                        {dec.contested && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                            Contested
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-sm font-semibold text-slate-900">
                        ${dec.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">{dec.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link
              to="/judge/reputation"
              className="mt-4 block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All Decisions →
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JudgeDashboard;
