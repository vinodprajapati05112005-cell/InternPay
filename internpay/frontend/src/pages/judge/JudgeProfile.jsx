import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Wallet,
  Star,
  Target,
  CheckCircle2,
  Calendar,
  Shield,
  Award,
  Scale,
  Mail,
  Globe,
  Copy,
} from 'lucide-react';
import { mockJudgeStats } from '../../data/mockData';

const CircularProgress = ({ value, max, size = 160, stroke = 10 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
        <p className="text-xs text-slate-400">/ {max}</p>
      </div>
    </div>
  );
};

const JudgeProfile = () => {
  const profile = {
    name: 'Judge Martinez',
    wallet: '0xD4...8E77',
    fullWallet: '0xD4a7C3f29b6E8A12d5F90c3B7a4e1D6f2C5A8E77',
    email: 'martinez@internpay.dev',
    memberSince: 'March 2025',
    specializations: ['Web Development', 'Smart Contracts', 'UI/UX Design', 'Mobile Development'],
    bio: 'Experienced blockchain developer and arbitrator with over 5 years in decentralized governance. Specializing in fair dispute resolution for freelance contracts.',
  };

  const stats = [
    { label: 'Reputation Score', value: `${mockJudgeStats.reputationScore}/${mockJudgeStats.maxReputation}`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Accuracy Rate', value: `${mockJudgeStats.accuracyRate}%`, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completed Disputes', value: mockJudgeStats.completedDisputes, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Disputes', value: mockJudgeStats.activeDisputes, icon: Scale, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.fullWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          to="/judge/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          My Profile
        </h1>
        <p className="mt-2 text-slate-500 text-lg">
          Your judge profile and credentials.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center"
        >
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">
            {profile.name}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">
              Verified Judge
            </span>
          </div>

          {/* Reputation Score */}
          <div className="mb-6">
            <CircularProgress
              value={mockJudgeStats.reputationScore}
              max={mockJudgeStats.maxReputation}
            />
            <p className="text-sm text-slate-500 mt-2">Reputation Score</p>
          </div>

          {/* Wallet */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-mono text-slate-700">
                  {profile.wallet}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <p className="text-xs text-emerald-600 mt-1">Copied to clipboard!</p>
            )}
          </div>

          {/* Member since */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            Member since {profile.memberSince}
          </div>
        </motion.div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center"
              >
                <div className={`${stat.bg} p-2.5 rounded-xl inline-flex mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-3">About</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              {profile.bio}
            </p>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">
              Specializations
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.specializations.map((spec) => (
                <span
                  key={spec}
                  className="text-xs bg-blue-50 text-blue-700 font-medium px-3 py-1.5 rounded-full border border-blue-100"
                >
                  {spec}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Recent Decisions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Decisions
              </h3>
              <Link
                to="/judge/reputation"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All →
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {mockJudgeStats.decisionHistory.slice(0, 3).map((dec) => {
                const decisionColor =
                  dec.decision === 'Approve Payment'
                    ? 'text-emerald-600 bg-emerald-50'
                    : dec.decision === 'Reject and Refund'
                      ? 'text-red-600 bg-red-50'
                      : 'text-amber-600 bg-amber-50';
                return (
                  <div key={dec.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {dec.project}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${decisionColor}`}>
                          {dec.decision}
                        </span>
                        <span className="text-xs text-slate-400">{dec.date}</span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      ${dec.amount.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              to="/judge/reputation"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
            >
              <Award className="w-4 h-4" />
              View Reputation
            </Link>
            <Link
              to="/judge/disputes"
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
            >
              <Scale className="w-4 h-4" />
              View Disputes
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JudgeProfile;
