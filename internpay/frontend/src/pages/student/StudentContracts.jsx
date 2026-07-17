import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Calendar, DollarSign, Filter,
  ChevronRight, Clock, CheckCircle2, AlertTriangle, Building2
} from 'lucide-react';
import { mockContracts } from '../../data/mockData';

const StudentContracts = () => {
  const [statusFilter, setStatusFilter] = useState('All');

  const studentContracts = mockContracts.filter(c => c.student === '0x7a...9F21');
  const filteredContracts = statusFilter === 'All'
    ? studentContracts
    : studentContracts.filter(c => c.status === statusFilter);

  const statuses = ['All', 'In Progress', 'Funded', 'Completed', 'Disputed'];

  const getStatusBadge = (status) => {
    const styles = {
      'In Progress': { bg: 'bg-blue-100 text-blue-700', icon: Clock },
      'Funded': { bg: 'bg-emerald-100 text-emerald-700', icon: DollarSign },
      'Completed': { bg: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      'Disputed': { bg: 'bg-red-100 text-red-700', icon: AlertTriangle },
    };
    return styles[status] || { bg: 'bg-slate-100 text-slate-700', icon: FileText };
  };

  const getDaysUntil = (deadline) => {
    const now = new Date();
    const dl = new Date(deadline);
    return Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold text-slate-900">My Contracts</h1>
        <p className="text-slate-500 mt-1">Manage and track all your freelance contracts.</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-500" />
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContracts.map((contract, i) => {
          const completedMilestones = contract.milestones.filter(m => m.status === 'Completed').length;
          const totalMilestones = contract.milestones.length;
          const progress = (completedMilestones / totalMilestones) * 100;
          const daysLeft = getDaysUntil(contract.deadline);
          const statusStyle = getStatusBadge(contract.status);
          const StatusIcon = statusStyle.icon;

          return (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/student/contracts/${contract.id}`}
                className="block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">{contract.id}</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg}`}>
                          <StatusIcon className="w-3 h-3" />
                          {contract.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {contract.title}
                      </h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors mt-1" />
                  </div>

                  {/* Company & Category */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {contract.companyName}
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                      {contract.category}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span className="text-2xl font-extrabold text-slate-900">
                      ${contract.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-500">USDC</span>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                      <span>Milestone Progress</span>
                      <span className="font-medium">{completedMilestones}/{totalMilestones}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className={daysLeft <= 7 && daysLeft > 0 ? 'text-amber-600 font-medium' : daysLeft <= 0 ? 'text-red-600 font-medium' : 'text-slate-500'}>
                        {daysLeft > 0 ? `${daysLeft} days left` : contract.status === 'Completed' ? 'Completed' : 'Overdue'}
                      </span>
                    </div>
                    <span className="text-sm text-blue-600 font-medium group-hover:underline">
                      View Contract →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filteredContracts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No contracts found</h3>
          <p className="text-slate-500 mt-1">No contracts match the selected filter.</p>
        </motion.div>
      )}
    </div>
  );
};

export default StudentContracts;
