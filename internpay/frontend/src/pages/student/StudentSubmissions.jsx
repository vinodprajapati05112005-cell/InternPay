import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Eye,
  Brain,
  Loader2,
} from 'lucide-react';
import { submissionApi } from '../../services/api';
import { compactHash, formatDateTime, humanizeEnum } from '../../utils/formatters';

const statusStyles = {
  APPROVED: 'bg-emerald-100 text-emerald-700',
  APPROVED_WITH_NOTES: 'bg-emerald-100 text-emerald-700',
  EVALUATING: 'bg-blue-100 text-blue-700',
  HUMAN_REVIEW: 'bg-orange-100 text-orange-700',
  REJECTED: 'bg-red-100 text-red-700',
  DISPUTED: 'bg-rose-100 text-rose-700',
  RESOLVED: 'bg-violet-100 text-violet-700',
  SUBMITTED: 'bg-sky-100 text-sky-700',
  DRAFT: 'bg-slate-100 text-slate-700',
};

const scoreClasses = (score) => {
  if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-100', ring: 'ring-emerald-500/20' };
  if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-100', ring: 'ring-amber-500/20' };
  return { text: 'text-red-600', bg: 'bg-red-100', ring: 'ring-red-500/20' };
};

const StudentSubmissions = () => {
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

  const stats = useMemo(() => {
    const scores = submissions.map((item) => Number(item.ai_score)).filter((value) => Number.isFinite(value));
    const averageScore = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 0;
    return {
      total: submissions.length,
      evaluated: submissions.filter((item) => item.ai_score !== null && item.ai_score !== undefined).length,
      averageScore,
      approved: submissions.filter((item) => ['APPROVED', 'APPROVED_WITH_NOTES', 'RESOLVED'].includes(String(item.status))).length,
    };
  }, [submissions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading submissions...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">My Submissions</h1>
        <p className="text-slate-500 mt-1">Track your submitted work and AI evaluation results.</p>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Submissions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Brain className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{stats.averageScore}</p>
              <p className="text-sm text-slate-500">Average AI Score</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{stats.approved}</p>
              <p className="text-sm text-slate-500">Approved</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {submissions.map((submission, index) => {
          const aiScore = Number(submission.ai_score);
          const hasScore = Number.isFinite(aiScore);
          const scoreStyle = scoreClasses(hasScore ? aiScore : 0);
          const statusStyle = statusStyles[String(submission.status).toUpperCase()] || 'bg-slate-100 text-slate-700';
          const links = submission.links || {};
          const linkCount = Object.keys(links).length;

          return (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl ${scoreStyle.bg} flex flex-col items-center justify-center ring-2 ${scoreStyle.ring} shrink-0`}>
                    <Brain className={`w-4 h-4 ${scoreStyle.text} mb-0.5`} />
                    <span className={`text-2xl font-extrabold ${scoreStyle.text}`}>{hasScore ? aiScore : '--'}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-400">{compactHash(submission.id)}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle}`}>
                        <FileText className="w-3 h-3" />
                        {humanizeEnum(submission.status)}
                      </span>
                      {submission.ai_recommendation && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          Recommendation: {humanizeEnum(submission.ai_recommendation)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{submission.contract_title}</h3>
                    <p className="text-sm text-slate-500">{submission.milestone_title}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        Submitted: {formatDateTime(submission.submitted_at)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        Evaluated: {formatDateTime(submission.evaluated_at)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-slate-400" />
                        {linkCount} proof link{linkCount === 1 ? '' : 's'}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Link
                      to={`/student/submissions/${submission.id}/report`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                    >
                      <Eye className="w-4 h-4" />
                      View Report
                    </Link>
                    <Link
                      to={`/student/submissions/${submission.id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-all"
                    >
                      Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {submissions.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No submissions yet</h3>
          <p className="text-slate-500 mt-1">Submit your first piece of work to see it here.</p>
        </motion.div>
      )}
    </div>
  );
};

export default StudentSubmissions;
