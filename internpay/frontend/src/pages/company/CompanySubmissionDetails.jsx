import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  GitBranch,
  PenTool,
  Globe,
  Video,
  FileText,
  ThumbsUp,
  X,
  Shield,
  Star,
  AlertCircle,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { disputeApi, submissionApi } from '../../services/api';
import { formatDate, formatDateTime, humanizeEnum } from '../../utils/formatters';

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
    case 'APPROVED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'APPROVED_WITH_NOTES':
    case 'HUMAN_REVIEW':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'REJECTED':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

const linkIcons = {
  github: GitBranch,
  figma: PenTool,
  demo: Globe,
  documentation: BookOpen,
  video: Video,
};

const linkLabels = {
  github: 'GitHub Repository',
  figma: 'Design File',
  demo: 'Live Demo',
  documentation: 'Documentation',
  video: 'Video Walkthrough',
};

const CompanySubmissionDetails = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeForm, setDisputeForm] = useState({ reason: '', description: '', evidence: '' });
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);
  const [disputeError, setDisputeError] = useState('');
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadSubmission = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [submissionData, reportData] = await Promise.allSettled([
          submissionApi.detail(id),
          submissionApi.report(id),
        ]);

        if (cancelled) {
          return;
        }

        if (submissionData.status === 'fulfilled') {
          setSubmission(submissionData.value || null);
        } else {
          throw submissionData.reason;
        }

        if (reportData.status === 'fulfilled') {
          setReport(reportData.value && Object.keys(reportData.value).length > 0 ? reportData.value : null);
        } else {
          setReport(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load the submission.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadSubmission();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const timeLeft = useMemo(() => {
    const anchor = submission?.submitted_at || submission?.evaluated_at;
    if (!anchor) {
      return null;
    }

    const deadline = new Date(anchor);
    deadline.setHours(deadline.getHours() + 24);
    const diffMs = deadline.getTime() - Date.now();
    if (diffMs <= 0) {
      return 'Expired';
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }, [submission?.evaluated_at, submission?.submitted_at]);

  const handleDisputeSubmit = async () => {
    const reasons = disputeForm.reason.trim();
    const description = disputeForm.description.trim();

    if (!reasons || !description) {
      setDisputeError('Reason and description are required.');
      return;
    }

    setDisputeSubmitting(true);
    setDisputeError('');

    try {
      const evidence = disputeForm.evidence
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((url) => ({ type: 'link', url }));

      await disputeApi.create({
        submission_id: submission.id,
        reason: reasons,
        description,
        evidence,
      });
      setDisputeSuccess(true);
    } catch (submitError) {
      setDisputeError(submitError?.message || 'Unable to file the dispute.');
    } finally {
      setDisputeSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-slate-500">Loading submission...</div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Submission not found</h2>
          <p className="text-slate-500 mt-2">{error || 'The submission could not be loaded.'}</p>
          <Link to="/company/submissions" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Back to Submissions
          </Link>
        </div>
      </div>
    );
  }

  const evaluation = report || submission.ai_report;
  const score = evaluation?.overall_score || submission.ai_score || 0;
  const linkEntries = submission.links || {};
  const hasEvaluation = Boolean(evaluation);
  const scoreClass = hasEvaluation ? getScoreColor(score) : 'text-slate-500';

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/company/submissions" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Submissions
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{submission.contract_title || 'Submission'}</h1>
            <p className="text-slate-500 mt-1">
              {submission.milestone_title || 'Milestone'} · {submission.id}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowDisputeModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-rose-200 text-rose-700 rounded-xl font-semibold text-sm hover:bg-rose-50 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" /> File Dispute
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Submission Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><User className="w-3 h-3" /> Student</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{submission.student_name || 'Student'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> Submitted</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{formatDateTime(submission.submitted_at)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><FileText className="w-3 h-3" /> Status</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{humanizeEnum(submission.status)}</p>
              </div>
            </div>
            {submission.additional_notes && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs font-semibold text-blue-700 mb-1">Student Notes</p>
                <p className="text-sm text-blue-800 whitespace-pre-wrap">{submission.additional_notes}</p>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Proof of Work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(linkEntries).map(([key, url]) => {
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
            {submission.files?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">Uploaded Files</p>
                <div className="space-y-2">
                  {submission.files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm">
                      <span className="truncate">{file.original_name || file.file}</span>
                      <span className="text-xs text-slate-500">{file.file_type || 'FILE'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {evaluation && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" /> AI Evaluation Report
                </h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRecommendationBadge(evaluation.recommendation)}`}>
                  {humanizeEnum(evaluation.recommendation)}
                </span>
              </div>

              <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-sm text-slate-500 font-medium mb-1">Overall Score</p>
                <p className={`text-5xl font-extrabold ${getScoreColor(score)}`}>{score}</p>
                <p className="text-xs text-slate-400 mt-1">out of 100</p>
              </div>

              {['code_score', 'design_score', 'requirement_score', 'functionality_score'].map((key) => (
                <div key={key} className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-700">{humanizeEnum(key.replace('_score', ' score'))}</span>
                    <span className={`text-sm font-extrabold ${getScoreColor(Number(evaluation[key] || 0))}`}>
                      {evaluation[key] || 0}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Number(evaluation[key] || 0)}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full bg-gradient-to-r ${getScoreBarColor(Number(evaluation[key] || 0))} rounded-full`}
                    />
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <h3 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
                    <Star className="w-4 h-4" /> Strengths
                  </h3>
                  <ul className="space-y-1.5">
                    {(evaluation.strengths || []).map((item, index) => (
                      <li key={index} className="text-xs text-emerald-700 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                  <h3 className="text-sm font-semibold text-rose-800 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Weaknesses
                  </h3>
                  <ul className="space-y-1.5">
                    {(evaluation.weaknesses || []).map((item, index) => (
                      <li key={index} className="text-xs text-rose-700 flex items-start gap-1.5">
                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {evaluation.explanation && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">AI Reasoning</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{evaluation.explanation}</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" /> Dispute Window
            </h2>
            <div className="text-center p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs text-amber-600 font-medium mb-1">Time Remaining</p>
              <p className="text-2xl font-extrabold text-amber-700">{timeLeft || 'N/A'}</p>
              <p className="text-xs text-amber-500 mt-1">24-hour window after submission</p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              If a dispute is not filed within the window, the contract can proceed to the next review step in the workflow.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" /> Quick Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">AI Score</span>
                <span className={`font-extrabold ${scoreClass}`}>
                  {hasEvaluation ? `${score}/100` : 'Awaiting review'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Recommendation</span>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${getRecommendationBadge(evaluation?.recommendation)}`}>
                  {hasEvaluation ? humanizeEnum(evaluation?.recommendation) : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-slate-700">{humanizeEnum(submission.status)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Proof Links</span>
                <span className="font-semibold text-slate-700">{Object.keys(linkEntries).length}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showDisputeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              {!disputeSuccess ? (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-500" /> File a Dispute
                    </h3>
                    <button type="button" onClick={() => setShowDisputeModal(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {disputeError && (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{disputeError}</div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reason *</label>
                      <select
                        value={disputeForm.reason}
                        onChange={(event) => setDisputeForm((prev) => ({ ...prev, reason: event.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a reason</option>
                        <option value="SCOPE_MISMATCH">Scope mismatch</option>
                        <option value="INCOMPLETE_WORK">Incomplete work</option>
                        <option value="PAYMENT_ISSUE">Payment issue</option>
                        <option value="UNFAIR_EVALUATION">Unfair evaluation</option>
                        <option value="COMMUNICATION_BREAKDOWN">Communication breakdown</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
                      <textarea
                        rows={4}
                        value={disputeForm.description}
                        onChange={(event) => setDisputeForm((prev) => ({ ...prev, description: event.target.value }))}
                        placeholder="Explain why you are filing this dispute..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Evidence Links (one per line)</label>
                      <textarea
                        rows={3}
                        value={disputeForm.evidence}
                        onChange={(event) => setDisputeForm((prev) => ({ ...prev, evidence: event.target.value }))}
                        placeholder="https://example.com/evidence1&#10;https://example.com/evidence2"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                      />
                    </div>

                    <button
                      onClick={handleDisputeSubmit}
                      disabled={disputeSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-semibold text-sm hover:from-rose-600 hover:to-rose-700 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {disputeSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Dispute'
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Dispute Filed</h3>
                  <p className="text-slate-500 mb-6">The dispute has been submitted and will be reviewed by a judge.</p>
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
