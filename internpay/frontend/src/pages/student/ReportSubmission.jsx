import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  ShieldAlert,
  FileText,
  Check,
  X,
  AlertTriangle,
  Clock,
  ThumbsUp,
  Code,
  Layout,
  Settings,
  FileCheck,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { disputeApi, submissionApi } from '../../services/api';
import { compactHash, formatDateTime, humanizeEnum } from '../../utils/formatters';

const DISPUTE_REASONS = [
  { value: 'UNFAIR_EVALUATION', label: 'Unfair Evaluation' },
  { value: 'SCOPE_MISMATCH', label: 'Scope Mismatch' },
  { value: 'INCOMPLETE_WORK', label: 'Incomplete Work' },
  { value: 'COMMUNICATION_BREAKDOWN', label: 'Communication Breakdown' },
  { value: 'PAYMENT_ISSUE', label: 'Payment Issue' },
  { value: 'OTHER', label: 'Other' },
];

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const ReportSubmission = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeSuccess, setDisputeSuccess] = useState('');
  const [isDisputing, setIsDisputing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [disputeForm, setDisputeForm] = useState({
    reason: 'UNFAIR_EVALUATION',
    description: '',
    evidence: '',
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [submissionData, reportData] = await Promise.all([
          submissionApi.detail(id),
          submissionApi.report(id).catch(() => null),
        ]);

        if (!cancelled) {
          setSubmission(submissionData || null);
          setReport(reportData && Object.keys(reportData).length > 0 ? reportData : null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load the report.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const disputeDeadline = useMemo(() => {
    if (!submission) {
      return null;
    }

    const base = submission.evaluated_at || submission.submitted_at;
    if (!base) {
      return null;
    }

    const baseDate = new Date(base);
    if (Number.isNaN(baseDate.getTime())) {
      return null;
    }

    return new Date(baseDate.getTime() + 24 * 60 * 60 * 1000);
  }, [submission]);

  useEffect(() => {
    if (!disputeDeadline) {
      setTimeLeft(0);
      return undefined;
    }

    const update = () => {
      const diff = disputeDeadline.getTime() - Date.now();
      setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [disputeDeadline]);

  const dimensions = useMemo(() => {
    if (!report) {
      return [];
    }

    return [
      { name: 'Code Quality', score: report.code_score, weight: 30, icon: Code, desc: 'Cleanliness, structure, and best practices' },
      { name: 'Design Quality', score: report.design_score, weight: 25, icon: Layout, desc: 'UI and visual consistency' },
      { name: 'Functionality', score: report.functionality_score, weight: 25, icon: Settings, desc: 'Bug-free execution and performance' },
      { name: 'Requirement Match', score: report.requirement_score, weight: 20, icon: FileCheck, desc: 'Alignment with the contract brief' },
    ];
  }, [report]);

  const handleDisputeSubmit = async (event) => {
    event.preventDefault();
    if (!submission) {
      return;
    }

    setIsDisputing(true);
    setError('');

    try {
      const evidence = disputeForm.evidence
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((url) => ({ type: 'link', url }));

      await disputeApi.create({
        submission_id: submission.id,
        reason: disputeForm.reason,
        description: disputeForm.description.trim(),
        evidence,
      });

      setDisputeSuccess('Dispute submitted successfully. A judge will review your case.');
      setShowDisputeModal(false);
    } catch (submitError) {
      setError(submitError?.message || 'Unable to submit the dispute.');
    } finally {
      setIsDisputing(false);
    }
  };

  const canFileDispute = Boolean(report) && timeLeft > 0;
  const status = String(submission?.status || '');
  const recommendation = report?.recommendation ? humanizeEnum(report.recommendation) : 'Pending';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading report...
        </div>
      </div>
    );
  }

  if (error && !submission) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Report Not Available</h2>
          <p className="text-slate-500 mt-2">{error}</p>
          <Link to="/student/submissions" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Submissions
          </Link>
        </div>
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter pb-20">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to={`/student/submissions/${id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Submission
        </Link>

        {disputeSuccess && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {disputeSuccess}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">AI Evaluation Report</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-1.5" />
                  {submission.contract_title}
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  {submission.milestone_title}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Submitted: {formatDateTime(submission.submitted_at)}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl border border-emerald-200 font-semibold">
                <Check className="w-5 h-5" />
                RECOMMENDATION: {recommendation.toUpperCase()}
              </div>
              <div className="text-right text-xs text-slate-500">Status: {humanizeEnum(status)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-2xl p-8 shadow-xl text-white h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20" />

              <h2 className="text-lg font-medium text-slate-300 mb-6 z-10">Overall AI Score</h2>

              <div className="relative w-48 h-48 flex items-center justify-center z-10 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - ((report?.overall_score || 0) / 100))}
                    className="text-indigo-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold text-white tracking-tighter">{report?.overall_score ?? '--'}</span>
                  <span className="text-slate-400 font-medium">/100</span>
                </div>
              </div>

              <p className="text-indigo-200 font-medium z-10">{recommendation}</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Evaluation Dimensions</h2>
            {report ? (
              <div className="space-y-6">
                {dimensions.map((dim) => (
                  <div key={dim.name} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                          <dim.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">{dim.name}</span>
                          <span className="text-xs text-slate-500 ml-2">Weight: {dim.weight}%</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700">{dim.score}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${dim.score >= 90 ? 'bg-emerald-500' : dim.score >= 80 ? 'bg-indigo-500' : 'bg-orange-500'}`}
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">{dim.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                The AI report is not ready yet. This submission is still being evaluated.
              </div>
            )}
          </div>
        </div>

        {report && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <ThumbsUp className="w-5 h-5 mr-2 text-emerald-500" />
                Strengths
              </h3>
              <ul className="space-y-3">
                {(report.strengths || []).map((item, index) => (
                  <li key={index} className="flex items-start text-sm text-slate-700">
                    <Check className="w-4 h-4 mr-2 text-emerald-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {(report.weaknesses || []).map((item, index) => (
                  <li key={index} className="flex items-start text-sm text-slate-700">
                    <X className="w-4 h-4 mr-2 text-orange-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">AI Reasoning Summary</h3>
          <p className="text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
            {report?.explanation || 'The AI report is not ready yet.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Submission Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Company</span>
                <span className="font-semibold text-slate-900">{submission.company_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Student</span>
                <span className="font-semibold text-slate-900">{submission.student_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Milestone</span>
                <span className="font-semibold text-slate-900">{submission.milestone_title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Submission ID</span>
                <span className="font-mono text-xs text-slate-900">{compactHash(submission.id)}</span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {submission.links && Object.entries(submission.links).map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                  <LinkIcon className="w-4 h-4" />
                  {humanizeEnum(key)}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-indigo-900">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold">Dispute Window</p>
                <p className="text-sm text-indigo-700 font-mono font-medium">{formatTime(timeLeft)} remaining</p>
                <p className="text-xs text-indigo-700 mt-1">
                  {disputeDeadline ? `Closes ${formatDateTime(disputeDeadline)}` : 'Unavailable'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowDisputeModal(true)}
                disabled={!canFileDispute}
                className="flex-1 md:flex-none px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                File Dispute
              </button>
              <Link
                to={`/student/submissions/${id}`}
                className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md text-center"
              >
                Review Submission
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showDisputeModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <ShieldAlert className="w-6 h-6 mr-2 text-red-500" />
                File a Dispute
              </h3>
              <button onClick={() => setShowDisputeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleDisputeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Reason for dispute</label>
                <select
                  value={disputeForm.reason}
                  onChange={(event) => setDisputeForm((prev) => ({ ...prev, reason: event.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                >
                  {DISPUTE_REASONS.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Dispute description</label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  placeholder="Explain why you disagree with the AI evaluation..."
                  value={disputeForm.description}
                  onChange={(event) => setDisputeForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Evidence links</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  placeholder="One URL per line"
                  value={disputeForm.evidence}
                  onChange={(event) => setDisputeForm((prev) => ({ ...prev, evidence: event.target.value }))}
                />
              </div>

              <p className="text-xs text-slate-500">Disputes will be reviewed by a human judge. This process may take up to 48 hours.</p>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDisputing}
                  className="px-5 py-2.5 bg-red-600 text-white font-medium hover:bg-red-700 rounded-xl transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isDisputing ? 'Submitting...' : 'Submit Dispute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSubmission;
