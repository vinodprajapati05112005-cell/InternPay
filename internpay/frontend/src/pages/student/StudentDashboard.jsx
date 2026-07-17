import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign, Clock, FileText, CheckCircle2, Brain,
  ArrowUpRight, Calendar, TrendingUp, Search, Send,
  CreditCard, Star, AlertCircle, ChevronRight
} from 'lucide-react';
import { mockContracts, mockSubmissions, mockPayments, mockStudentStats } from '../../data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
};

const StudentDashboard = () => {
  const studentContracts = mockContracts.filter(c => c.student === '0x7a...9F21');
  const activeContracts = studentContracts.filter(c => c.status === 'In Progress' || c.status === 'Funded');
  const recentSubmissions = mockSubmissions.filter(s => s.student === '0x7a...9F21').slice(0, 3);
  const recentPayments = mockPayments.slice(0, 5);

  const stats = [
    { label: 'Total Earnings', value: `$${mockStudentStats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { label: 'Pending Payments', value: `$${mockStudentStats.pendingPayments.toLocaleString()}`, icon: Clock, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-700' },
    { label: 'Active Contracts', value: mockStudentStats.activeContracts, icon: FileText, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Completed Contracts', value: mockStudentStats.completedContracts, icon: CheckCircle2, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-700' },
    { label: 'Average AI Score', value: `${mockStudentStats.averageAiScore}/100`, icon: Brain, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', text: 'text-pink-700' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'In Progress': 'bg-blue-100 text-blue-700',
      'Funded': 'bg-emerald-100 text-emerald-700',
      'Completed': 'bg-green-100 text-green-700',
      'Disputed': 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-slate-100 text-slate-700';
  };

  const getDaysUntil = (deadline) => {
    const now = new Date();
    const dl = new Date(deadline);
    const diff = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getPaymentStatusBadge = (status) => {
    const styles = {
      'Released': 'bg-emerald-100 text-emerald-700',
      'Dispute Window': 'bg-orange-100 text-orange-700',
      'Disputed': 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, Alex! Here's your freelance overview.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Contracts */}
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
            {activeContracts.map((contract) => {
              const completedMilestones = contract.milestones.filter(m => m.status === 'Completed').length;
              const totalMilestones = contract.milestones.length;
              const progress = (completedMilestones / totalMilestones) * 100;
              const daysLeft = getDaysUntil(contract.deadline);

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
                      <p className="text-sm text-slate-500">{contract.companyName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${contract.totalAmount.toLocaleString()}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(contract.status)}`}>
                        {contract.status}
                      </span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Progress: {completedMilestones}/{totalMilestones} milestones</span>
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
                    <span className={daysLeft <= 7 ? 'text-amber-600 font-medium' : 'text-slate-500'}>
                      {daysLeft > 0 ? `${daysLeft} days remaining` : 'Overdue'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
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

          {/* AI Score Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent AI Evaluations</h2>
            <div className="space-y-3">
              {recentSubmissions.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/student/submissions/${sub.id}/report`}
                  className="block p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{sub.milestoneTitle}</p>
                      <p className="text-xs text-slate-500 truncate">{sub.projectTitle}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Star className={`w-4 h-4 ${getScoreColor(sub.aiScore)}`} />
                      <span className={`text-lg font-extrabold ${getScoreColor(sub.aiScore)}`}>
                        {sub.aiScore}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Timeline */}
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
            {recentPayments.map((payment, i) => (
              <div key={payment.id} className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${payment.status === 'Released' ? 'bg-emerald-500' : payment.status === 'Disputed' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  {i < recentPayments.length - 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200" />
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{payment.milestone}</p>
                    <p className="text-xs text-slate-500">{payment.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                    <span className="font-bold text-slate-900">${payment.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
