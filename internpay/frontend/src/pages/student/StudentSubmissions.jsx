import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Calendar, Star, Clock, AlertTriangle,
  CheckCircle2, ChevronRight, Eye, Brain, Shield
} from 'lucide-react';
import { mockSubmissions } from '../../data/mockData';

const StudentSubmissions = () => {
  const studentSubmissions = mockSubmissions.filter(s => s.student === '0x7a...9F21');

  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-100', ring: 'ring-emerald-500/20' };
    if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-100', ring: 'ring-amber-500/20' };
    return { text: 'text-red-600', bg: 'bg-red-100', ring: 'ring-red-500/20' };
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Dispute Window': { bg: 'bg-orange-100 text-orange-700', icon: Clock },
      'Released': { bg: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
      'Disputed': { bg: 'bg-red-100 text-red-700', icon: AlertTriangle },
      'Pending': { bg: 'bg-blue-100 text-blue-700', icon: Clock },
    };
    return styles[status] || { bg: 'bg-slate-100 text-slate-700', icon: FileText };
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold text-slate-900">My Submissions</h1>
        <p className="text-slate-500 mt-1">Track your submitted work and AI evaluation results.</p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{studentSubmissions.length}</p>
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
              <p className="text-2xl font-extrabold text-slate-900">
                {Math.round(studentSubmissions.reduce((acc, s) => acc + s.aiScore, 0) / studentSubmissions.length)}
              </p>
              <p className="text-sm text-slate-500">Average AI Score</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {studentSubmissions.filter(s => s.status === 'Released').length}
              </p>
              <p className="text-sm text-slate-500">Approved</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Submissions List */}
      <div className="space-y-4">
        {studentSubmissions.map((submission, i) => {
          const scoreStyle = getScoreColor(submission.aiScore);
          const statusStyle = getStatusBadge(submission.status);
          const StatusIcon = statusStyle.icon;

          return (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* AI Score */}
                  <div className={`w-20 h-20 rounded-2xl ${scoreStyle.bg} flex flex-col items-center justify-center ring-2 ${scoreStyle.ring} shrink-0`}>
                    <Star className={`w-4 h-4 ${scoreStyle.text} mb-0.5`} />
                    <span className={`text-2xl font-extrabold ${scoreStyle.text}`}>{submission.aiScore}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-400">{submission.id}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg}`}>
                        <StatusIcon className="w-3 h-3" />
                        {submission.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{submission.projectTitle}</h3>
                    <p className="text-sm text-slate-500">{submission.milestoneTitle}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        Submitted: {submission.submittedDate}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        Dispute deadline: {new Date(submission.disputeDeadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
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

      {studentSubmissions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No submissions yet</h3>
          <p className="text-slate-500 mt-1">Submit your first piece of work to see it here.</p>
        </motion.div>
      )}
    </div>
  );
};

export default StudentSubmissions;
