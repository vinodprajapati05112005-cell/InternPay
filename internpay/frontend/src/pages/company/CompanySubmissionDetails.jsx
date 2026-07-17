import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, User, Calendar, Clock, Brain, CheckCircle2,
  AlertTriangle, ExternalLink, GitBranch, PenTool, Globe, Video,
  FileText, ThumbsUp, ThumbsDown, X, Shield, Star, AlertCircle,
  BookOpen
} from 'lucide-react';
import { mockSubmissions } from '../../data/mockData';

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

const getRecommendationBadge = (rec) => {
  switch (rec) {
    case 'APPROVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'HUMAN_REVIEW': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'REJECT': return 'bg-rose-50 text-rose-700 border-rose-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

const linkIcons = {
  github: GitBranch,
  figma: PenTool,
  liveDemo: Globe,
  documentation: BookOpen,
  video: Video,
};

const linkLabels = {
  github: 'GitHub Repository',
  figma: 'PenTool Design',
  liveDemo: 'Live Demo',
  documentation: 'Documentation',
  video: 'Video Walkthrough',
};

const CompanySubmissionDetails = () => {
  const { id } = useParams();
  const submission = mockSubmissions.find(s => s.id === id);
  const [showApproveSuccess, setShowApproveSuccess] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeForm, setDisputeForm] = useState({ reason: '', explanation: '', evidence: '' });
  const [disputeErrors, setDisputeErrors] = useState({});
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!submission) return;
    const calcTime = () => {
      const now = new Date();
      const end = new Date(submission.disputeDeadline);
      const diff = end - now;
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, [submission]);

  if (!submission) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Submission not found</h2>
          <Link to="/company/submissions" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Back to Submissions</Link>
        </div>
      </div>
    );
  }

  const handleDisputeSubmit = () => {
    const errs = {};
    if (!disputeForm.reason.trim()) errs.reason = 'Reason is required';
    if (!disputeForm.explanation.trim()) errs.explanation = 'Explanation is required';
    setDisputeErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setDisputeSubmitted(true);
  };

  const { evaluation } = submission;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/company/submissions" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Submissions
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{submission.projectTitle}</h1>
            <p className="text-slate-500 mt-1">{submission.milestoneTitle} · {submission.id}</p>
          </div>
          {submission.status === 'Dispute Window' && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveSuccess(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                <ThumbsUp className="w-4 h-4" /> Approve & Release
              </button>
              <button
                onClick={() => setShowDisputeModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-rose-200 text-rose-700 rounded-xl font-semibold text-sm hover:bg-rose-50 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" /> File Dispute
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submission Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Submission Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><User className="w-3 h-3" /> Student</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{submission.studentName}</p>
                <p className="text-xs text-slate-400 font-mono">{submission.student}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> Submitted</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{new Date(submission.submittedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><FileText className="w-3 h-3" /> Contract</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{submission.contractId}</p>
              </div>
            </div>
            {submission.notes && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs font-semibold text-blue-700 mb-1">Student Notes</p>
                <p className="text-sm text-blue-800">{submission.notes}</p>
              </div>
            )}
          </motion.div>

          {/* Proof Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Proof of Work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(submission.links).map(([key, url]) => {
                const Icon = linkIcons[key] || ExternalLink;
                const label = linkLabels[key] || key;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">{label}</p>
                      <p className="text-xs text-slate-400 truncate">{url}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400 flex-shrink-0" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* AI Evaluation Report */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" /> AI Evaluation Report
              </h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRecommendationBadge(evaluation.recommendation)}`}>
                {evaluation.recommendation === 'APPROVE' ? '✓ ' : evaluation.recommendation === 'HUMAN_REVIEW' ? '⚠ ' : '✗ '}
                {evaluation.recommendation.replace('_', ' ')}
              </span>
            </div>

            {/* Overall Score */}
            <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <p className="text-sm text-slate-500 font-medium mb-1">Overall Score</p>
              <p className={`text-5xl font-extrabold ${getScoreColor(evaluation.overallScore)}`}>
                {evaluation.overallScore}
              </p>
              <p className="text-xs text-slate-400 mt-1">out of 100</p>
            </div>

            {/* Dimension Bars */}
            <div className="space-y-4 mb-6">
              {evaluation.dimensions.map((dim, i) => (
                <div key={dim.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-700">{dim.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Weight: {dim.weight}%</span>
                      <span className={`text-sm font-extrabold ${getScoreColor(dim.score)}`}>{dim.score}</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.score}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                      className={`h-full bg-gradient-to-r ${getScoreBarColor(dim.score)} rounded-full`}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{dim.explanation}</p>
                </div>
              ))}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <h3 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
                  <Star className="w-4 h-4" /> Strengths
                </h3>
                <ul className="space-y-1.5">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-emerald-700 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                <h3 className="text-sm font-semibold text-rose-800 mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Weaknesses
                </h3>
                <ul className="space-y-1.5">
                  {evaluation.weaknesses.map((w, i) => (
                    <li key={i} className="text-xs text-rose-700 flex items-start gap-1.5">
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {typeof w === 'string' ? w : w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reasoning */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">AI Reasoning</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{evaluation.reasoning}</p>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Dispute Countdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> Dispute Window
            </h2>
            <div className="text-center p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs text-amber-600 font-medium mb-1">Time Remaining</p>
              <p className="text-2xl font-extrabold text-amber-700">{timeLeft}</p>
              <p className="text-xs text-amber-500 mt-1">24-hour window</p>
            </div>
            <p className="text-xs text-slate-500 mt-3">After the dispute window closes, funds will be automatically released to the student if no dispute is filed.</p>
          </motion.div>

          {/* Quick Score Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" /> Quick Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">AI Score</span>
                <span className={`font-extrabold ${getScoreColor(evaluation.overallScore)}`}>{evaluation.overallScore}/100</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Recommendation</span>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${getRecommendationBadge(evaluation.recommendation)}`}>
                  {evaluation.recommendation.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-slate-700">{submission.status}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Proof Links</span>
                <span className="font-semibold text-slate-700">{Object.keys(submission.links).length}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Approve Success Modal */}
      <AnimatePresence>
        {showApproveSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Payment Released!</h3>
              <p className="text-slate-500 mb-6">The milestone payment has been approved and funds have been released to the student.</p>
              <Link to="/company/submissions" className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all">
                Back to Submissions
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dispute Form Modal */}
      <AnimatePresence>
        {showDisputeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              {!disputeSubmitted ? (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-500" /> File a Dispute
                    </h3>
                    <button onClick={() => setShowDisputeModal(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reason *</label>
                      <select
                        value={disputeForm.reason}
                        onChange={e => setDisputeForm({ ...disputeForm, reason: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a reason</option>
                        <option value="Incomplete Delivery">Incomplete Delivery</option>
                        <option value="Quality Below Standard">Quality Below Standard</option>
                        <option value="Mismatched Requirements">Mismatched Requirements</option>
                        <option value="Plagiarism Suspected">Plagiarism Suspected</option>
                        <option value="Other">Other</option>
                      </select>
                      {disputeErrors.reason && <p className="text-red-500 text-xs mt-1">{disputeErrors.reason}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Explanation *</label>
                      <textarea
                        rows={4}
                        value={disputeForm.explanation}
                        onChange={e => setDisputeForm({ ...disputeForm, explanation: e.target.value })}
                        placeholder="Explain why you are filing this dispute..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      {disputeErrors.explanation && <p className="text-red-500 text-xs mt-1">{disputeErrors.explanation}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Evidence Links (one per line)</label>
                      <textarea
                        rows={3}
                        value={disputeForm.evidence}
                        onChange={e => setDisputeForm({ ...disputeForm, evidence: e.target.value })}
                        placeholder="https://example.com/evidence1&#10;https://example.com/evidence2"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                      />
                    </div>

                    <button
                      onClick={handleDisputeSubmit}
                      className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-semibold text-sm hover:from-rose-600 hover:to-rose-700 shadow-lg transition-all"
                    >
                      Submit Dispute
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Dispute Filed!</h3>
                  <p className="text-slate-500 mb-6">Your dispute has been submitted and will be reviewed by an independent judge.</p>
                  <Link to="/company/disputes" className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all">
                    View Disputes
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanySubmissionDetails;
