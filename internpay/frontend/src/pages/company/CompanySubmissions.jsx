import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  ArrowRight,
  User,
  Calendar,
  Clock,
  Brain,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import { submissionApi } from '../../services/api';
import { formatDate, humanizeEnum } from '../../utils/formatters';

const statusColors = {
  SUBMITTED: 'bg-amber-50 text-amber-700 border-amber-200',
  EVALUATING: 'bg-blue-50 text-blue-700 border-blue-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  APPROVED_WITH_NOTES: 'bg-violet-50 text-violet-700 border-violet-200',
  HUMAN_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  DISPUTED: 'bg-rose-50 text-rose-700 border-rose-200',
  RESOLVED: 'bg-slate-100 text-slate-700 border-slate-200',
};

const getScoreColor = (score) => {
  if (score >= 85) return 'text-emerald-600 bg-emerald-50';
  if (score >= 70) return 'text-amber-600 bg-amber-50';
  return 'text-rose-600 bg-rose-50';
};

const getScoreBarColor = (score) => {
  if (score >= 85) return 'from-emerald-400 to-emerald-600';
  if (score >= 70) return 'from-amber-400 to-amber-600';
  return 'from-rose-400 to-rose-600';
};

const CompanySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadSubmissions = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await submissionApi.list();
        if (!cancelled) {
          setSubmissions(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load submissions.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadSubmissions();

    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => {
    const pending = submissions.filter((submission) => ['SUBMITTED', 'EVALUATING', 'HUMAN_REVIEW'].includes(submission.status)).length;
    const disputed = submissions.filter((submission) => ['DISPUTED'].includes(submission.status)).length;
    return {
      total: submissions.length,
      pending,
      disputed,
    };
  }, [submissions]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Submissions</h1>
        <p className="text-slate-500 mt-1">{summary.total} submissions to review</p>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm text-slate-500">Total Submissions</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{summary.total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{summary.pending}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm text-slate-500">Disputed</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{summary.disputed}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid place-items-center min-h-[40vh] text-slate-500">
          Loading submissions...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {submissions.map((submission, index) => {
            const score = Number(submission.ai_score || 0);
            const scoreStyle = getScoreColor(score);

            return (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{submission.contract_title || 'Contract'}</h3>
                    <p className="text-sm text-slate-500 truncate">{submission.milestone_title || 'Milestone'}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border flex-shrink-0 ${statusColors[submission.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {humanizeEnum(submission.status)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {submission.student_name || 'Student'}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(submission.submitted_at)}</span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1"><Brain className="w-3 h-3" /> AI Score</span>
                    <span className={`text-sm font-extrabold px-2 py-0.5 rounded-lg ${scoreStyle}`}>{score || '--'}/100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={`h-full bg-gradient-to-r ${getScoreBarColor(score)} rounded-full`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    {submission.evaluated_at ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{submission.evaluated_at ? 'Evaluated' : 'Awaiting evaluation'}</span>
                  </div>
                  <Link
                    to={`/company/submissions/${submission.id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    View Submission <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoading && submissions.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No submissions found</h3>
          <p className="text-slate-500 mt-1">Submissions will appear here once students start submitting work.</p>
        </motion.div>
      )}
    </div>
  );
};

export default CompanySubmissions;
