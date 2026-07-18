import React, { useEffect, useMemo, useState } from 'react';
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
  Loader2,
} from 'lucide-react';
import { judgeApi } from '../../services/api';
import { formatDateTime, humanizeEnum } from '../../utils/formatters';
import { getUserDisplayName } from '../../utils/navigation';
import { useAuth } from '../../context/AuthContext';

const CircularProgress = ({ value, max, size = 160, stroke = 10 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#judge-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="judge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [profileData, dashboardData, historyData] = await Promise.all([
          judgeApi.profile(),
          judgeApi.dashboard(),
          judgeApi.decisionHistory(),
        ]);

        if (!cancelled) {
          setProfile(profileData || null);
          setDashboard(dashboardData || null);
          setHistory(Array.isArray(historyData) ? historyData : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load judge profile.');
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
  }, []);

  const stats = useMemo(() => [
    { label: 'Reputation Score', value: `${profile?.rating || 0}/5`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Accuracy Rate', value: dashboard ? `${Math.round((dashboard.total_approved + dashboard.total_rejected + dashboard.total_partial) ? (dashboard.total_approved / (dashboard.total_approved + dashboard.total_rejected + dashboard.total_partial)) * 100 : 0)}%` : '0%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completed Disputes', value: dashboard?.completed_disputes || 0, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Open Disputes', value: dashboard?.open_disputes || 0, icon: Scale, color: 'text-violet-600', bg: 'bg-violet-50' },
  ], [dashboard, profile]);

  const handleCopy = () => {
    const text = user?.email || '';
    if (!text) {
      return;
    }

    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading judge profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <Link to="/judge/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">My Profile</h1>
        <p className="mt-2 text-slate-500 text-lg">Your judge profile and credentials.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">{profile?.judge_display_name || getUserDisplayName(user)}</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">Verified Judge</span>
          </div>

          <div className="mb-6">
            <CircularProgress value={Number(profile?.rating || 0)} max={5} />
            <p className="text-sm text-slate-500 mt-2">Reputation Score</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">{user?.email}</span>
              </div>
              <button onClick={handleCopy} className="text-slate-400 hover:text-blue-600 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-xs text-emerald-600 mt-1">Copied to clipboard!</p>}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            Member since {formatDateTime(user?.created_at)}
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
                <div className={`${stat.bg} p-2.5 rounded-xl inline-flex mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">About</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">{profile?.bio || 'No bio provided.'}</p>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Specialization</h4>
            <div className="flex flex-wrap gap-2">
              {[profile?.specialization || 'General'].map((spec) => (
                <span key={spec} className="text-xs bg-blue-50 text-blue-700 font-medium px-3 py-1.5 rounded-full border border-blue-100">
                  {spec}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">License Number</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{profile?.license_number || 'Not set'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">Years of Experience</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{profile?.years_experience || 'Not set'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">Verification Status</p>
                <p className="text-sm font-semibold text-emerald-600 mt-1">{humanizeEnum(profile?.verification_status)}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">Resolved Disputes</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{dashboard?.completed_disputes || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Recent Decisions</h3>
              <Link to="/judge/reputation" className="text-sm font-medium text-blue-600 hover:text-blue-700">View Reputation</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {(history.slice(0, 3).length > 0 ? history.slice(0, 3) : dashboard?.recent_decisions || []).map((decision) => (
                <div key={decision.dispute_id || decision.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{decision.contract_title || decision.project || 'Decision'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{humanizeEnum(decision.decision)}</span>
                      <span className="text-xs text-slate-400">{formatDateTime(decision.resolved_at || decision.date)}</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{decision.reasoning ? 'Reviewed' : 'Recorded'}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-3">
            <Link to="/judge/reputation" className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm">
              <Award className="w-4 h-4" />
              View Reputation
            </Link>
            <Link to="/judge/disputes" className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all">
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
