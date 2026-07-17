import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Building2, Calendar, DollarSign, Clock,
  CheckCircle2, AlertTriangle, Send, FileText,
  ExternalLink, ChevronRight, Circle, Zap
} from 'lucide-react';
import { mockContracts } from '../../data/mockData';

const StudentContractDetails = () => {
  const { id } = useParams();
  const contract = mockContracts.find(c => c.id === id);

  if (!contract) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Contract Not Found</h2>
          <p className="text-slate-500 mt-2">The contract you're looking for doesn't exist.</p>
          <Link to="/student/contracts" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Contracts
          </Link>
        </div>
      </div>
    );
  }

  const completedMilestones = contract.milestones.filter(m => m.status === 'Completed').length;
  const totalMilestones = contract.milestones.length;
  const progress = (completedMilestones / totalMilestones) * 100;

  const getDaysUntil = (deadline) => {
    const now = new Date();
    const dl = new Date(deadline);
    return Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
  };

  const getMilestoneStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Submitted': return <Send className="w-5 h-5 text-blue-500" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Disputed': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  const getMilestoneStatusBadge = (status) => {
    const styles = {
      'Completed': 'bg-emerald-100 text-emerald-700',
      'Submitted': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-amber-100 text-amber-700',
      'Pending': 'bg-slate-100 text-slate-600',
      'Disputed': 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-slate-100 text-slate-600';
  };

  const getStatusBadge = (status) => {
    const styles = {
      'In Progress': 'bg-blue-100 text-blue-700',
      'Funded': 'bg-emerald-100 text-emerald-700',
      'Completed': 'bg-green-100 text-green-700',
      'Disputed': 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-slate-100 text-slate-700';
  };

  const canSubmit = (status) => status === 'In Progress' || status === 'Pending';

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link to="/student/contracts" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Contracts
        </Link>
      </motion.div>

      {/* Contract Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-slate-400">{contract.id}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(contract.status)}`}>
                {contract.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">{contract.title}</h1>
            <p className="text-slate-600 max-w-2xl">{contract.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-extrabold text-slate-900">${contract.totalAmount.toLocaleString()}</p>
            <p className="text-sm text-slate-500">USDC Total</p>
          </div>
        </div>

        {/* Contract Info Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">Company</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{contract.companyName}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">Category</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{contract.category}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">Created</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{contract.createdDate}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">Deadline</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{contract.deadline}</p>
          </div>
        </div>

        {/* Overall Progress */}
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

      {/* Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Project Requirements</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>Modern, responsive design following provided PenTool mockups</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>Cross-browser compatibility (Chrome, Firefox, Safari, Edge)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>Mobile-first approach with responsive breakpoints</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>Clean, well-documented code with proper component architecture</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>Performance optimized with Lighthouse score above 90</span>
          </li>
        </ul>
      </motion.div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm"
      >
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Milestones & Deliverables</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {contract.milestones.map((milestone, index) => {
            const daysLeft = getDaysUntil(milestone.deadline);

            return (
              <div key={milestone.id} className="p-6">
                <div className="flex items-start gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    {getMilestoneStatusIcon(milestone.status)}
                    {index < contract.milestones.length - 1 && (
                      <div className="w-0.5 h-full min-h-[40px] bg-slate-200 mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">
                          Milestone {milestone.id}: {milestone.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMilestoneStatusBadge(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-900">${milestone.amount}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due: {milestone.deadline}</span>
                      </div>
                      {milestone.status !== 'Completed' && (
                        <span className={daysLeft <= 3 ? 'text-red-600 font-medium' : daysLeft <= 7 ? 'text-amber-600 font-medium' : ''}>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </span>
                      )}
                    </div>

                    {/* Deliverables */}
                    <div className="mb-3">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Deliverables</p>
                      <div className="flex flex-wrap gap-2">
                        {milestone.deliverables.map((deliverable, di) => (
                          <span key={di} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    {canSubmit(milestone.status) && (
                      <Link
                        to={`/student/contracts/${contract.id}/submit`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                      >
                        <Send className="w-4 h-4" />
                        Submit Work
                      </Link>
                    )}

                    {milestone.status === 'Submitted' && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Awaiting AI Evaluation
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
