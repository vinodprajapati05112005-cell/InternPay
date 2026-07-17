import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Target,
  CheckCircle2,
  ThumbsUp,
  AlertTriangle,
  Award,
  TrendingUp,
  Scale,
  Calendar,
  DollarSign,
  Shield,
} from 'lucide-react';
import { mockJudgeStats } from '../../data/mockData';

const CircularProgress = ({ value, max, size = 200, stroke = 14 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#repGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="repGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-5xl font-extrabold text-slate-900">{value}</p>
        <p className="text-sm text-slate-400 mt-1">/ {max}</p>
      </div>
    </div>
  );
};

const JudgeReputation = () => {
  const positiveDecisions = 44;
  const contestedDecisions = 3;

  const overviewStats = [
    { label: 'Accuracy Rate', value: `${mockJudgeStats.accuracyRate}%`, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completed Disputes', value: mockJudgeStats.completedDisputes, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Positive Decisions', value: positiveDecisions, icon: ThumbsUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Contested Decisions', value: contestedDecisions, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  // Monthly performance data for bar chart
  const monthlyData = [
    { month: 'Feb', disputes: 6, score: 820 },
    { month: 'Mar', disputes: 8, score: 831 },
    { month: 'Apr', disputes: 10, score: 835 },
    { month: 'May', disputes: 12, score: 840 },
    { month: 'Jun', disputes: 7, score: 843 },
    { month: 'Jul', disputes: 4, score: 847 },
  ];

  const maxDisputes = Math.max(...monthlyData.map((m) => m.disputes));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link
          to="/judge/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Reputation & Performance
        </h1>
        <p className="mt-2 text-slate-500 text-lg">
          Your reputation score, accuracy metrics, and decision history.
        </p>
      </motion.div>

      {/* Top Section: Score + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Large Reputation Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Reputation Score
            </h2>
          </div>
          <CircularProgress
            value={mockJudgeStats.reputationScore}
            max={mockJudgeStats.maxReputation}
          />
          <div className="mt-6 flex items-center gap-2 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+12 points this month</span>
          </div>
          <div className="mt-4 w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Rank</span>
              <span className="font-semibold text-slate-900">Top 5%</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-slate-500">Status</span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <Shield className="w-3.5 h-3.5" />
                Elite Judge
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-3 grid grid-cols-2 gap-4"
        >
          {overviewStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
            >
              <div className={`${stat.bg} p-2.5 rounded-xl inline-flex mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Performance Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Monthly Disputes Resolved
          </h3>
          <div className="flex items-end gap-4 h-48">
            {monthlyData.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-slate-900">
                  {m.disputes}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.disputes / maxDisputes) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg min-h-[8px]"
                />
                <span className="text-xs text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reputation Progress Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Reputation Progress
          </h3>
          <div className="space-y-4">
            {monthlyData.map((m, i) => (
              <div key={m.month}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-500">{m.month} 2026</span>
                  <span className="font-semibold text-slate-900">{m.score}/1000</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(m.score / 1000) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                    className="h-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decision Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Decision Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-emerald-700">28</p>
            <p className="text-sm text-emerald-600 mt-1">Approved Payments</p>
            <p className="text-xs text-emerald-500 mt-1">59.6% of decisions</p>
          </div>
          <div className="bg-red-50 rounded-xl p-5 border border-red-100 text-center">
            <Scale className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-red-700">8</p>
            <p className="text-sm text-red-600 mt-1">Rejected & Refunded</p>
            <p className="text-xs text-red-500 mt-1">17.0% of decisions</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 text-center">
            <DollarSign className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-amber-700">11</p>
            <p className="text-sm text-amber-600 mt-1">Partial Payments</p>
            <p className="text-xs text-amber-500 mt-1">23.4% of decisions</p>
          </div>
        </div>
      </motion.div>

      {/* Decision History Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">
            Decision History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Decision
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockJudgeStats.decisionHistory.map((dec) => {
                const decisionStyle =
                  dec.decision === 'Approve Payment'
                    ? 'bg-emerald-50 text-emerald-700'
                    : dec.decision === 'Reject and Refund'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700';

                return (
                  <tr key={dec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">
                        {dec.project}
                      </p>
                      <p className="text-xs text-slate-400">{dec.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${decisionStyle}`}
                      >
                        {dec.decision}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {dec.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-slate-900">
                        ${dec.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {dec.contested ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                          <AlertTriangle className="w-3 h-3" />
                          Contested
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          Accepted
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default JudgeReputation;
