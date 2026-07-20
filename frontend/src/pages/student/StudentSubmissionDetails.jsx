import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, FileText, Link as LinkIcon, AlertCircle, BarChart3, ChevronRight, Loader2 } from 'lucide-react';
import { submissionApi } from '../../services/api';
import { compactHash, formatDateTime, humanizeEnum } from '../../utils/formatters';

const StudentSubmissionDetails = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadSubmission = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await submissionApi.detail(id);
        if (!cancelled) {
          setSubmission(data || null);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading submission...
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Submission Not Found</h2>
          <p className="text-slate-500 mt-2">{error || 'The submission you are looking for is unavailable.'}</p>
          <Link to="/student/submissions" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Submissions
          </Link>
        </div>
      </div>
    );
  }

  const report = submission.ai_report || null;
  const links = submission.links || {};
  const status = String(submission.status || '');

  const getStatusColor = () => {
    switch (status) {
      case 'APPROVED':
      case 'APPROVED_WITH_NOTES':
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'EVALUATING':
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DISPUTED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'HUMAN_REVIEW':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const linkEntries = [
    { label: 'GitHub Repository', url: links.github },
    { label: 'Demo', url: links.demo },
    { label: 'Figma / Design', url: links.figma },
    { label: 'Documentation', url: links.documentation },
    { label: 'Video Walkthrough', url: links.video },
  ].filter((item) => item.url);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/student/submissions" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Submissions
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{submission.contract_title}</h1>
            <p className="text-slate-500 mt-1">Milestone: {submission.milestone_title}</p>
            <p className="text-xs text-slate-400 mt-1">Submission {compactHash(submission.id)}</p>
          </div>
          <div className={`px-4 py-1.5 rounded-full border font-medium text-sm flex items-center ${getStatusColor()}`}>
            {(status === 'APPROVED' || status === 'APPROVED_WITH_NOTES' || status === 'RESOLVED') ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
            {humanizeEnum(status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                Submission Notes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-5">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</p>
                  <p className="font-semibold text-slate-900 mt-1">{submission.company_name}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Student</p>
                  <p className="font-semibold text-slate-900 mt-1">{submission.student_name}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contract Status</p>
                  <p className="font-semibold text-slate-900 mt-1">{humanizeEnum(submission.contract_status)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Milestone Status</p>
                  <p className="font-semibold text-slate-900 mt-1">{humanizeEnum(submission.milestone_status)}</p>
                </div>
              </div>
              <p className="text-slate-600 whitespace-pre-wrap">{submission.additional_notes || 'No notes provided by the student.'}</p>

              <h3 className="text-sm font-semibold text-slate-900 mt-6 mb-3">Proof of Work Links</h3>
              <div className="space-y-3">
                {linkEntries.length > 0 ? (
                  linkEntries.map((item) => (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-slate-700"
                    >
                      <LinkIcon className="w-4 h-4 mr-3 text-indigo-500" />
                      <span className="truncate text-sm">{item.label}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No proof links were attached to this submission.</p>
                )}
              </div>
            </div>

            {submission.files && submission.files.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Uploaded Files</h2>
                <div className="space-y-2">
                  {submission.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{file.original_name}</p>
                        <p className="text-xs text-slate-500">{file.file_type || 'FILE'}</p>
                      </div>
                      <span className="text-xs text-slate-400">{compactHash(file.id)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
                AI Evaluation
              </h2>

              {report ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Overall Score</span>
                    <span className="text-2xl font-extrabold text-indigo-600">{report.overall_score}/100</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${report.overall_score}%` }} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Code</span>
                      <span className="font-semibold text-slate-900">{report.code_score}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Design</span>
                      <span className="font-semibold text-slate-900">{report.design_score}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Requirements</span>
                      <span className="font-semibold text-slate-900">{report.requirement_score}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Functionality</span>
                      <span className="font-semibold text-slate-900">{report.functionality_score}/100</span>
                    </div>
                  </div>

                  <Link
                    to={`/student/submissions/${submission.id}/report`}
                    className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
                  >
                    View Full Report
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">Evaluation in progress</p>
                  <p className="text-sm text-slate-500 mt-1">Our AI is still analyzing this submission.</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="font-semibold mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-indigo-300" />
                What happens next?
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Once the AI evaluation is complete, you can review the report, accept the result, or file a dispute before the review window closes.
              </p>
              <p className="text-xs text-slate-400">Submitted: {formatDateTime(submission.submitted_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmissionDetails;
