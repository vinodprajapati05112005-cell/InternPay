import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Scale,
  FileText,
  GitBranch,
  PenTool,
  Globe,
  BookOpen,
  Video,
  Bot,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  User,
  Building2,
  Calendar,
  ExternalLink,
  Shield,
  MessageSquare,
  Link2,
  ChevronRight,
  X,
  Gavel,
  Star,
  TrendingUp,
  TrendingDown,
  Target,
} from 'lucide-react';
import { mockDisputes, mockSubmissions, mockContracts } from '../../data/mockData';

const JudgeDisputeDetails = () => {
  const { id } = useParams();
  const [decisionType, setDecisionType] = useState(null);
  const [partialAmount, setPartialAmount] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Find dispute data
  const dispute = mockDisputes.find((d) => d.id === id);
  const submission = dispute
    ? mockSubmissions.find((s) => s.id === dispute.submissionId)
    : null;
  const contract = dispute
    ? mockContracts.find((c) => c.id === dispute.contractId)
    : null;

  const handleSubmitDecision = () => {
    const newErrors = {};
    if (!decisionType) newErrors.decision = 'Please select a decision';
    if (!reasoning.trim()) newErrors.reasoning = 'Decision reasoning is required';
    if (decisionType === 'partial' && (!partialAmount || parseFloat(partialAmount) <= 0 || parseFloat(partialAmount) >= (dispute?.amount || 0))) {
      newErrors.partialAmount = `Enter an amount between $1 and $${(dispute?.amount || 0) - 1}`;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setShowModal(true);
    }
  };

  // Generic fallback for unknown IDs
  if (!dispute) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
        <Link
          to="/judge/disputes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Disputes
        </Link>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <Scale className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Dispute {id}
          </h2>
          <p className="text-slate-500 mb-6">
            Detailed dispute information is not available for this case.
          </p>
          <Link
            to="/judge/disputes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Disputes
          </Link>
        </div>
      </div>
    );
  }

  const priorityStyles = {
    High: 'bg-red-100 text-red-700 border border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    Low: 'bg-green-100 text-green-700 border border-green-200',
  };

  const timelineEvents = [
    { label: 'Contract Created', date: contract?.createdDate || '2026-06-01', status: 'completed' },
    { label: 'Work Submitted', date: submission?.submittedDate || '2026-06-28', status: 'completed' },
    { label: 'AI Evaluation', date: submission?.submittedDate || '2026-06-28', status: 'completed' },
    { label: 'Dispute Filed', date: dispute.filedDate, status: 'completed' },
    { label: 'Under Review', date: 'Current', status: 'active' },
  ];

  const submissionLinks = submission?.links
    ? [
        { label: 'GitHub Repository', url: submission.links.github, icon: GitBranch },
        { label: 'PenTool Design', url: submission.links.figma, icon: PenTool },
        { label: 'Live Demo', url: submission.links.liveDemo, icon: Globe },
        { label: 'Documentation', url: submission.links.documentation, icon: BookOpen },
        { label: 'Video Walkthrough', url: submission.links.video, icon: Video },
      ].filter((l) => l.url)
    : [];

  const aiEval = submission?.evaluation;

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
          to="/judge/disputes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Disputes
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                {dispute.projectTitle}
              </h1>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${priorityStyles[dispute.priority]}`}
              >
                {dispute.priority} Priority
              </span>
            </div>
            <p className="text-slate-500">
              Case {dispute.id} · {dispute.category} · Filed{' '}
              {dispute.filedDate}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
              <Scale className="w-4 h-4" />
              {dispute.status}
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              ${dispute.amount.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content — 2 cols */}
        <div className="xl:col-span-2 space-y-6">
          {/* SECTION 1: Project Information */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Project Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Contract Title
                    </label>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {contract?.title || dispute.projectTitle}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Category
                    </label>
                    <p className="text-sm text-slate-700 mt-1">
                      {dispute.category}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Disputed Amount
                    </label>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      ${dispute.amount.toLocaleString()} USDC
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Student
                      </label>
                      <p className="text-sm text-slate-700 mt-1">
                        {submission?.studentName || 'N/A'} ({submission?.student || 'N/A'})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Company
                      </label>
                      <p className="text-sm text-slate-700 mt-1">
                        {submission?.companyName || dispute.filedByName} ({contract?.company || 'N/A'})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Contract Dates
                      </label>
                      <p className="text-sm text-slate-700 mt-1">
                        {contract?.createdDate || 'N/A'} → {contract?.deadline || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SECTION 2: Contract Requirements */}
          {contract?.milestones && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-xl">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Contract Requirements
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {contract.milestones.map((ms) => (
                  <div
                    key={ms.id}
                    className="border border-slate-100 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm">
                        Milestone {ms.id}: {ms.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">
                          ${ms.amount}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            ms.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : ms.status === 'Disputed'
                                ? 'bg-red-100 text-red-700'
                                : ms.status === 'Submitted'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ms.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ms.deliverables.map((d, i) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SECTION 3: Student Submission */}
          {submission && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="bg-violet-50 p-2 rounded-xl">
                  <Link2 className="w-5 h-5 text-violet-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Student Submission
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {submissionLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                    >
                      <link.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700 truncate">
                          {link.label}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{link.url}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                    </a>
                  ))}
                </div>
                {submission.notes && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Additional Notes
                    </p>
                    <p className="text-sm text-slate-700">{submission.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* SECTION 4: AI Evaluation Report */}
          {aiEval && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-50 p-2 rounded-xl">
                    <Bot className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    AI Evaluation Report
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-2xl font-extrabold ${
                      aiEval.overallScore >= 80
                        ? 'text-emerald-600'
                        : aiEval.overallScore >= 60
                          ? 'text-amber-600'
                          : 'text-red-600'
                    }`}
                  >
                    {aiEval.overallScore}
                  </span>
                  <span className="text-sm text-slate-400">/100</span>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Score Dimensions */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Score Dimensions
                  </h3>
                  <div className="space-y-3">
                    {aiEval.dimensions.map((dim) => (
                      <div key={dim.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-700">
                            {dim.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">
                              Weight: {dim.weight}%
                            </span>
                            <span
                              className={`text-sm font-bold ${
                                dim.score >= 80
                                  ? 'text-emerald-600'
                                  : dim.score >= 60
                                    ? 'text-amber-600'
                                    : 'text-red-600'
                              }`}
                            >
                              {dim.score}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${
                              dim.score >= 80
                                ? 'bg-emerald-500'
                                : dim.score >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${dim.score}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                          {dim.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-sm font-semibold text-emerald-800">
                        Strengths
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {aiEval.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-emerald-700 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <h4 className="text-sm font-semibold text-red-800">
                        Weaknesses
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {aiEval.weaknesses.map((w, i) => (
                        <li
                          key={i}
                          className="text-sm text-red-700 flex items-start gap-2"
                        >
                          <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Reasoning */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">
                    AI Reasoning
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {aiEval.reasoning}
                  </p>
                </div>

                {/* Recommendation */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-medium text-blue-500 uppercase tracking-wider">
                      AI Recommendation
                    </p>
                    <p className="text-sm font-bold text-blue-800">
                      {aiEval.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECTION 5: Company Claim */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Company Claim
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Dispute Reason
                </label>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {dispute.reason}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Explanation
                </label>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                  {dispute.explanation}
                </p>
              </div>
              {dispute.evidence && dispute.evidence.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Evidence Links
                  </label>
                  <div className="mt-2 space-y-2">
                    {dispute.evidence.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* SECTION 6: Student Response */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="bg-emerald-50 p-2 rounded-xl">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Student Response
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Response
                </label>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                  {dispute.studentResponse}
                </p>
              </div>
              {dispute.studentEvidence && dispute.studentEvidence.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Student Evidence
                  </label>
                  <div className="mt-2 space-y-2">
                    {dispute.studentEvidence.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column — Timeline + Decision */}
        <div className="space-y-6">
          {/* SECTION 7: Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-slate-100 p-2 rounded-xl">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Timeline</h2>
            </div>
            <div className="space-y-0">
              {timelineEvents.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        event.status === 'active'
                          ? 'bg-blue-500 ring-4 ring-blue-100'
                          : 'bg-emerald-500'
                      }`}
                    />
                    {i < timelineEvents.length - 1 && (
                      <div className="w-0.5 h-12 bg-slate-200" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium text-slate-900">
                      {event.label}
                    </p>
                    <p className="text-xs text-slate-400">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* DECISION SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Gavel className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Make Decision
              </h2>
            </div>

            {/* Decision Buttons */}
            <div className="space-y-3 mb-5">
              <button
                onClick={() => { setDecisionType('approve'); setErrors({}); }}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                  decisionType === 'approve'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 ${
                    decisionType === 'approve' ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      decisionType === 'approve' ? 'text-emerald-800' : 'text-slate-700'
                    }`}
                  >
                    Approve Payment
                  </p>
                  <p className="text-xs text-slate-400">
                    Release ${dispute.amount} to student
                  </p>
                </div>
              </button>

              <button
                onClick={() => { setDecisionType('reject'); setErrors({}); }}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                  decisionType === 'reject'
                    ? 'border-red-500 bg-red-50'
                    : 'border-slate-200 hover:border-red-300'
                }`}
              >
                <XCircle
                  className={`w-5 h-5 ${
                    decisionType === 'reject' ? 'text-red-600' : 'text-slate-400'
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      decisionType === 'reject' ? 'text-red-800' : 'text-slate-700'
                    }`}
                  >
                    Reject and Refund
                  </p>
                  <p className="text-xs text-slate-400">
                    Refund ${dispute.amount} to company
                  </p>
                </div>
              </button>

              <button
                onClick={() => { setDecisionType('partial'); setErrors({}); }}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                  decisionType === 'partial'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                <DollarSign
                  className={`w-5 h-5 ${
                    decisionType === 'partial' ? 'text-amber-600' : 'text-slate-400'
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      decisionType === 'partial' ? 'text-amber-800' : 'text-slate-700'
                    }`}
                  >
                    Partial Payment
                  </p>
                  <p className="text-xs text-slate-400">
                    Split amount between parties
                  </p>
                </div>
              </button>
            </div>

            {errors.decision && (
              <p className="text-xs text-red-600 mb-3">{errors.decision}</p>
            )}

            {/* Partial Amount */}
            <AnimatePresence>
              {decisionType === 'partial' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Partial Amount (to student)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      value={partialAmount}
                      onChange={(e) => setPartialAmount(e.target.value)}
                      placeholder={`1 – ${dispute.amount - 1}`}
                      min="1"
                      max={dispute.amount - 1}
                      className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  {errors.partialAmount && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.partialAmount}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reasoning */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Decision Reasoning <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows={4}
                placeholder="Explain your reasoning for this decision..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {errors.reasoning && (
                <p className="text-xs text-red-600 mt-1">{errors.reasoning}</p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitDecision}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Submit Decision
            </button>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Decision Recorded
              </h3>
              <p className="text-slate-500 mb-2">
                Your decision has been recorded on the blockchain.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2 border border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Decision</span>
                  <span className="font-semibold text-slate-900">
                    {decisionType === 'approve'
                      ? 'Approve Payment'
                      : decisionType === 'reject'
                        ? 'Reject and Refund'
                        : `Partial Payment — $${partialAmount}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Case</span>
                  <span className="font-semibold text-slate-900">{dispute.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tx Hash</span>
                  <span className="font-mono text-xs text-blue-600">
                    0x8f3a...b7c2
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/judge/disputes"
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-sm text-center"
                >
                  Back to Disputes
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JudgeDisputeDetails;
