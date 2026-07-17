import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, AlertTriangle, Brain, Calendar, DollarSign,
  ExternalLink, User, Shield, Clock, FileText, MessageSquare,
  CheckCircle2, Gavel
} from 'lucide-react';
import { mockDisputes, mockSubmissions } from '../../data/mockData';

const statusColors = {
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending': 'bg-blue-50 text-blue-700 border-blue-200',
};

const priorityColors = {
  'High': 'bg-rose-50 text-rose-700 border-rose-200',
  'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
  'Low': 'bg-blue-50 text-blue-700 border-blue-200',
};

const getScoreColor = (score) => {
  if (score >= 85) return 'text-emerald-600';
  if (score >= 70) return 'text-amber-600';
  return 'text-rose-600';
};

const getScoreBarColor = (score) => {
  if (score >= 85) return 'from-emerald-400 to-emerald-600';
  if (score >= 70) return 'from-amber-400 to-amber-600';
  return 'from-rose-400 to-rose-600';
};

const CompanyDisputeDetails = () => {
  const { id } = useParams();
  const dispute = mockDisputes.find(d => d.id === id);
  const submission = dispute ? mockSubmissions.find(s => s.id === dispute.submissionId) : null;

  if (!dispute) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Dispute not found</h2>
          <Link to="/company/disputes" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Back to Disputes</Link>
        </div>
      </div>
    );
  }

  const timeline = [
    { label: 'Work Submitted', date: submission?.submittedDate || dispute.filedDate, icon: FileText, completed: true },
    { label: 'AI Evaluation Complete', date: submission?.submittedDate || dispute.filedDate, icon: Brain, completed: true },
    { label: 'Dispute Filed', date: dispute.filedDate, icon: AlertTriangle, completed: true },
    { label: 'Student Response Submitted', date: dispute.filedDate, icon: MessageSquare, completed: !!dispute.studentResponse },
    { label: 'Judge Assigned', date: dispute.filedDate, icon: Gavel, completed: !!dispute.judgeName },
    { label: 'Resolution', date: dispute.deadline, icon: CheckCircle2, completed: !!dispute.decision },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/company/disputes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Disputes
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-extrabold text-slate-900">{dispute.projectTitle}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[dispute.status]}`}>
                {dispute.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[dispute.priority]}`}>
                {dispute.priority} Priority
              </span>
            </div>
            <p className="text-slate-500 mt-1">{dispute.id} · Filed on {new Date(dispute.filedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dispute Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Dispute Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">Category</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{dispute.category}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><DollarSign className="w-3 h-3" /> Amount</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">${dispute.amount.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Brain className="w-3 h-3" /> AI Score</p>
                <p className={`text-sm font-extrabold mt-1 ${getScoreColor(dispute.aiScore)}`}>{dispute.aiScore}/100</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> Deadline</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{new Date(dispute.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            {/* AI Score Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-500 font-medium">AI Score</span>
                <span className={`text-sm font-extrabold ${getScoreColor(dispute.aiScore)}`}>{dispute.aiScore}/100</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dispute.aiScore}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full bg-gradient-to-r ${getScoreBarColor(dispute.aiScore)} rounded-full`}
                />
              </div>
            </div>

            {/* Student Submission Links */}
            {submission && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Student Submission Links</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(submission.links).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> {key}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Company's Dispute */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Dispute Details
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                <p className="text-xs font-semibold text-rose-700 mb-1">Reason: {dispute.reason}</p>
                <p className="text-sm text-rose-800 leading-relaxed">{dispute.explanation}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Evidence</p>
                <div className="space-y-2">
                  {dispute.evidence.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{url}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Student Response */}
          {dispute.studentResponse && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" /> Student Response
              </h2>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                <p className="text-sm text-blue-800 leading-relaxed">{dispute.studentResponse}</p>
              </div>
              {dispute.studentEvidence && dispute.studentEvidence.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2">Student Evidence</p>
                  <div className="space-y-2">
                    {dispute.studentEvidence.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Timeline
            </h2>
            <div className="space-y-4">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.completed ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-1 ${
                        item.completed ? 'bg-blue-200' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-semibold ${item.completed ? 'text-slate-900' : 'text-slate-400'}`}>{item.label}</p>
                    <p className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Judge Info */}
          {dispute.judgeName && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-indigo-600" /> Assigned Judge
              </h2>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="font-semibold text-slate-900">{dispute.judgeName}</p>
                <p className="text-xs text-slate-400 font-mono mt-1">{dispute.judge}</p>
              </div>
              {dispute.decision === null && (
                <p className="text-xs text-amber-600 font-medium mt-3 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Decision pending
                </p>
              )}
            </motion.div>
          )}

          {/* Quick Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" /> Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Filed By</span>
                <span className="font-semibold text-slate-900">{dispute.filedByName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contract</span>
                <Link to={`/company/contracts/${dispute.contractId}`} className="font-semibold text-blue-600 hover:text-blue-700">{dispute.contractId}</Link>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submission</span>
                <Link to={`/company/submissions/${dispute.submissionId}`} className="font-semibold text-blue-600 hover:text-blue-700">{dispute.submissionId}</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDisputeDetails;
