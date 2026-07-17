import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock, FileText, Clock, AlertTriangle, DollarSign,
  Plus, Eye, ArrowRight, TrendingUp, CheckCircle2,
  Activity, Briefcase
} from 'lucide-react';
import { mockContracts, mockSubmissions, mockDisputes, mockCompanyStats } from '../../data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
};

const CompanyDashboard = () => {
  const stats = [
    { label: 'Total Locked Funds', value: `$${mockCompanyStats.totalLockedFunds.toLocaleString()}`, icon: Lock, color: 'from-blue-500 to-indigo-600' },
    { label: 'Active Contracts', value: mockCompanyStats.activeContracts, icon: FileText, color: 'from-emerald-500 to-teal-600' },
    { label: 'Pending Submissions', value: mockCompanyStats.pendingSubmissions, icon: Clock, color: 'from-amber-500 to-orange-600' },
    { label: 'Active Disputes', value: mockCompanyStats.activeDisputes, icon: AlertTriangle, color: 'from-rose-500 to-red-600' },
    { label: 'Released Payments', value: `$${mockCompanyStats.releasedPayments.toLocaleString()}`, icon: DollarSign, color: 'from-violet-500 to-purple-600' },
  ];

  const recentActivity = [
    { id: 1, text: 'Alex Chen submitted Frontend Implementation for InternPay Landing Page', time: '2 hours ago', type: 'submission', link: '/company/submissions/SUB-001' },
    { id: 2, text: 'Dispute filed for Portfolio Website Redesign', time: '1 day ago', type: 'dispute', link: '/company/disputes/DSP-001' },
    { id: 3, text: 'E-Commerce Dashboard contract funded with 3,200 USDC', time: '2 days ago', type: 'funded', link: '/company/contracts/CTR-002' },
    { id: 4, text: 'UI/UX Design milestone approved and payment released ($300)', time: '3 days ago', type: 'payment', link: '/company/contracts/CTR-001' },
    { id: 5, text: 'Mobile App Prototype completed — all milestones released', time: '5 days ago', type: 'completed', link: '/company/contracts/CTR-003' },
  ];

  const activeContracts = mockContracts.filter(c => c.status === 'In Progress' || c.status === 'Funded');

  const getActivityIcon = (type) => {
    switch (type) {
      case 'submission': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'dispute': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'funded': return <Lock className="w-4 h-4 text-blue-500" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-violet-500" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Company Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, TechVentures Inc.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
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
        {/* Active Contracts */}
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

          {activeContracts.map((contract, i) => {
            const completedMilestones = contract.milestones.filter(m => m.status === 'Completed').length;
            const progress = (completedMilestones / contract.milestones.length) * 100;

            return (
              <motion.div
                key={contract.id}
                custom={i + 5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{contract.title}</h3>
                    <p className="text-sm text-slate-500">{contract.studentName} · {contract.category}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    contract.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {contract.status}
                  </span>
                </div>

                {/* Milestone Progress */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500 font-medium">Milestone Progress</span>
                    <span className="text-xs font-semibold text-slate-700">{completedMilestones}/{contract.milestones.length}</span>
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
                    <span className="font-semibold text-slate-700">${contract.totalAmount.toLocaleString()}</span>
                    <span>Due: {new Date(contract.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
          })}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
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

          {/* Recent Activity */}
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
              {recentActivity.map((item) => (
                <Link key={item.id} to={item.link} className="flex gap-3 group">
                  <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2">{item.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
