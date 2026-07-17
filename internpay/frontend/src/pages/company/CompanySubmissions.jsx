import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, ArrowRight, User, Calendar, Clock,
  Brain, AlertCircle, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { mockSubmissions } from '../../data/mockData';

const statusColors = {
  'Dispute Window': 'bg-amber-50 text-amber-700 border-amber-200',
  'Released': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Disputed': 'bg-rose-50 text-rose-700 border-rose-200',
  'Pending Review': 'bg-blue-50 text-blue-700 border-blue-200',
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

const CountdownTimer = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calcTime = () => {
      const now = new Date();
      const end = new Date(deadline);
      const diff = end - now;
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${hours}h ${minutes}m remaining`);
    };
    calcTime();
    const interval = setInterval(calcTime, 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
      <Clock className="w-3 h-3" /> {timeLeft}
    </span>
  );
};

const CompanySubmissions = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Submissions</h1>
        <p className="text-slate-500 mt-1">{mockSubmissions.length} submissions to review</p>
      </motion.div>

      {/* Submission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSubmissions.map((submission, i) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{submission.projectTitle}</h3>
                <p className="text-sm text-slate-500 truncate">{submission.milestoneTitle}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border flex-shrink-0 ${statusColors[submission.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {submission.status}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {submission.studentName}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(submission.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>

            {/* AI Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1"><Brain className="w-3 h-3" /> AI Score</span>
                <span className={`text-sm font-extrabold px-2 py-0.5 rounded-lg ${getScoreColor(submission.aiScore)}`}>
                  {submission.aiScore}/100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${submission.aiScore}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`h-full bg-gradient-to-r ${getScoreBarColor(submission.aiScore)} rounded-full`}
                />
              </div>
            </div>

            {/* Dispute Deadline */}
            {submission.status === 'Dispute Window' && (
              <div className="mb-3 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                <CountdownTimer deadline={submission.disputeDeadline} />
              </div>
            )}

            <Link
              to={`/company/submissions/${submission.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              View Submission <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompanySubmissions;
