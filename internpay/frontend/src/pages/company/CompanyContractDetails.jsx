import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, DollarSign, Calendar, User, Lock, FileText,
  CheckCircle2, Clock, AlertTriangle, ExternalLink, ArrowRight,
  Shield, Zap, Eye
} from 'lucide-react';
import { mockContracts, mockSubmissions } from '../../data/mockData';

const statusColors = {
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'Funded': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Completed': 'bg-violet-50 text-violet-700 border-violet-200',
  'Disputed': 'bg-rose-50 text-rose-700 border-rose-200',
  'Pending': 'bg-slate-50 text-slate-600 border-slate-200',
  'Submitted': 'bg-amber-50 text-amber-700 border-amber-200',
};

const milestoneTimeline = ['Created', 'Funded', 'Work Submitted', 'AI Evaluation', 'Dispute Window', 'Released'];

const CompanyContractDetails = () => {
  const { id } = useParams();
  const contract = mockContracts.find(c => c.id === id);

  if (!contract) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Contract not found</h2>
          <Link to="/company/contracts" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Back to Contracts</Link>
        </div>
      </div>
    );
  }

  const getTimelineStep = (milestoneStatus) => {
    switch (milestoneStatus) {
      case 'Completed': return 5;
      case 'Submitted': return 2;
      case 'Disputed': return 4;
      case 'In Progress': return 1;
      case 'Pending': return 0;
      default: return 0;
    }
  };

  const getMilestoneIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Submitted': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Disputed': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'In Progress': return <Zap className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const completedMilestones = contract.milestones.filter(m => m.status === 'Completed').length;
  const progress = (completedMilestones / contract.milestones.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/company/contracts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Contracts
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-900">{contract.title}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[contract.status]}`}>
                {contract.status}
              </span>
            </div>
            <p className="text-slate-500 mt-1">{contract.id}</p>
          </div>
          <div className="flex gap-3">
            {(contract.status === 'Funded' || contract.status === 'In Progress') && (
              <Link
                to={`/company/contracts/${contract.id}/fund`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                <Lock className="w-4 h-4" /> Fund Contract
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Contract Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Contract Overview</h2>
          <p className="text-sm text-slate-600 mb-5">{contract.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><User className="w-3 h-3" /> Student</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{contract.studentName}</p>
              <p className="text-xs text-slate-400 font-mono">{contract.student}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><DollarSign className="w-3 h-3" /> Total Amount</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">${contract.totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">${contract.lockedAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> Created</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{new Date(contract.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500 font-medium">Overall Progress</span>
              <span className="text-xs font-semibold text-slate-700">{completedMilestones}/{contract.milestones.length} milestones</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Milestone Timeline Legend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" /> Escrow Lifecycle
          </h2>
          <div className="space-y-3">
            {milestoneTimeline.map((stage, i) => (
              <div key={stage} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm font-medium ${i <= 1 ? 'text-slate-900' : 'text-slate-500'}`}>{stage}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Milestones */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Milestones</h2>
        <div className="space-y-4">
          {contract.milestones.map((milestone, i) => {
            const submission = mockSubmissions.find(s => s.contractId === contract.id && s.milestoneId === milestone.id);
            const timelineStep = getTimelineStep(milestone.status);

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    {getMilestoneIcon(milestone.status)}
                    <div>
                      <h3 className="font-semibold text-slate-900">{milestone.title}</h3>
                      <p className="text-sm text-slate-500">Due: {new Date(milestone.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">${milestone.amount.toLocaleString()}</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[milestone.status]}`}>
                      {milestone.status}
                    </span>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
                  {milestoneTimeline.map((stage, si) => (
                    <React.Fragment key={stage}>
                      <div className={`flex-shrink-0 px-2 py-1 rounded-md text-[10px] font-semibold ${
                        si <= timelineStep ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {stage}
                      </div>
                      {si < milestoneTimeline.length - 1 && (
                        <div className={`flex-shrink-0 w-4 h-0.5 ${si < timelineStep ? 'bg-blue-400' : 'bg-slate-200'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Deliverables */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">Deliverables</p>
                  <div className="flex flex-wrap gap-1.5">
                    {milestone.deliverables.map((d, di) => (
                      <span key={di} className="text-xs bg-slate-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">{d}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-100">
                  {submission && (
                    <Link
                      to={`/company/submissions/${submission.id}`}
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Submission
                    </Link>
                  )}
                  {submission?.evaluation && (
                    <Link
                      to={`/company/submissions/${submission.id}`}
                      className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> AI Report
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyContractDetails;
