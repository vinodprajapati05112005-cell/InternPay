import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Target,
  CheckCircle2,
  ThumbsUp,
  AlertTriangle,
  Award,
  TrendingUp,
  Scale,
  Calendar,
  DollarSign,
  Shield,
  Loader2,
} from 'lucide-react';
import { judgeApi } from '../../services/api';
import { formatDateTime, humanizeEnum } from '../../utils/formatters';

const CircularProgress = ({ value, max, size = 200, stroke = 14 }) => {
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
          stroke="url(#repGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="repGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-5xl font-extrabold text-slate-900">{value.toFixed(2)}</p>
        <p className="text-sm text-slate-400 mt-1">/ {max}</p>
      </div>
    </div>
  );
};

const JudgeReputation = () => {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [history, setHistory] = useState([]);
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
          setError(loadError?.message || 'Unable to load reputation data.');
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

  const overviewStats = useMemo(() => [
    { label: 'Completed Disputes', value: dashboard?.completed_disputes || 0, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Open Disputes', value: dashboard?.open_disputes || 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Approved', value: dashboard?.total_approved || 0, icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Partial', value: dashboard?.total_partial || 0, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
  ], [dashboard]);

  const monthlyData = useMemo(() => {
    const map = new Map();
    history.forEach((item) => {
      const date = item.resolved_at || item.created_at;
      if (!date) {
        return;
      }
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) {
        return;
      }
      const key = parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .slice(-6)
      .map(([month, disputes]) => ({ month, disputes }));
  }, [history]);

  const maxDisputes = monthlyData.length ? Math.max(...monthlyData.map((item) => item.disputes)) : 1;

  const totalResolved = dashboard?.completed_disputes || 0;
  const approvalRate = totalResolved ? ((dashboard?.total_approved || 0) / totalResolved) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading reputation...
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
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Reputation & Performance</h1>
        <p className="mt-2 text-slate-500 text-lg">Your reputation score, accuracy metrics, and decision history.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Reputation Score</h2>
          </div>
          <CircularProgress value={Number(profile?.rating || 0)} max={5} />
          <div className="mt-6 flex items-center gap-2 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">{dashboard?.completed_disputes || 0} resolved cases</span>
          </div>
          <div className="mt-4 w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Rank</span>
              <span className="font-semibold text-slate-900">Top judge</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-slate-500">Status</span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <Shield className="w-3.5 h-3.5" />
                {humanizeEnum(profile?.verification_status)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3 grid grid-cols-2 gap-4">
          {overviewStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className={`${stat.bg} p-2.5 rounded-xl inline-flex mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Monthly Disputes Resolved</h3>
          <div className="flex items-end gap-4 h-48">
            {monthlyData.length > 0 ? (
              monthlyData.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">{item.disputes}</span>
                  <div className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg min-h-[8px]" style={{ height: `${(item.disputes / maxDisputes) * 100}%` }} />
                  <span className="text-xs text-slate-500">{item.month}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No resolved cases yet.</div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Decision Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Approved Payments', value: dashboard?.total_approved || 0, percent: approvalRate, color: 'bg-emerald-500' },
              { label: 'Rejected & Refunded', value: dashboard?.total_rejected || 0, percent: totalResolved ? ((dashboard?.total_rejected || 0) / totalResolved) * 100 : 0, color: 'bg-red-500' },
              { label: 'Partial Payments', value: dashboard?.total_partial || 0, percent: totalResolved ? ((dashboard?.total_partial || 0) / totalResolved) * 100 : 0, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(item.percent, 100)}%` }} transition={{ duration: 0.7, ease: 'easeOut' }} className={`h-3 ${item.color} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Decision Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-emerald-700">{dashboard?.total_approved || 0}</p>
            <p className="text-sm text-emerald-600 mt-1">Approved Payments</p>
          </div>
          <div className="bg-red-50 rounded-xl p-5 border border-red-100 text-center">
            <Scale className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-red-700">{dashboard?.total_rejected || 0}</p>
            <p className="text-sm text-red-600 mt-1">Rejected & Refunded</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 text-center">
            <DollarSign className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-amber-700">{dashboard?.total_partial || 0}</p>
            <p className="text-sm text-amber-600 mt-1">Partial Payments</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Decision History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contract</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Decision</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reasoning</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(history.length > 0 ? history : dashboard?.recent_decisions || []).map((item) => (
                <tr key={item.dispute_id || item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{item.contract_title || item.project || 'Decision'}</p>
                    <p className="text-xs text-slate-400">{item.dispute_id || item.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                      {humanizeEnum(item.decision)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDateTime(item.resolved_at || item.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-700">
                      {item.reasoning ? item.reasoning.slice(0, 72) : item.decision_reason ? item.decision_reason.slice(0, 72) : 'Recorded decision'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" />
                      Accepted
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default JudgeReputation;
