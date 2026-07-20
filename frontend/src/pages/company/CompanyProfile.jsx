import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Wallet,
  FileText,
  DollarSign,
  Calendar,
  Shield,
  Settings,
  Copy,
  CheckCircle2,
  Loader2,
  Globe,
  BadgeCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { companyApi } from '../../services/api';
import { formatCurrency, formatDate, humanizeEnum } from '../../utils/formatters';
import { getUserDisplayName } from '../../utils/navigation';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [profileData, dashboardData] = await Promise.all([
          companyApi.profile(),
          companyApi.dashboard(),
        ]);

        if (!cancelled) {
          setProfile(profileData || null);
          setDashboard(dashboardData || null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load company profile.');
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

  const walletAddress = useMemo(() => user?.wallet_address || 'Connected account', [user]);

  const handleCopy = () => {
    const text = user?.wallet_address || user?.email || '';
    if (!text) {
      return;
    }

    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const profileStats = [
    { label: 'Total Contracts', value: dashboard?.total_contracts || 0, icon: FileText, color: 'from-blue-500 to-indigo-600' },
    { label: 'Active Contracts', value: dashboard?.active_contracts || 0, icon: Shield, color: 'from-emerald-500 to-teal-600' },
    { label: 'Total Contract Value', value: formatCurrency(dashboard?.total_value || 0), icon: DollarSign, color: 'from-violet-500 to-purple-600' },
    { label: 'Active Disputes', value: dashboard?.disputed_contracts || 0, icon: Shield, color: 'from-rose-500 to-red-600' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading company profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Company Profile</h1>
        <p className="text-slate-500 mt-1">Manage your company information.</p>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-slate-900">{profile?.company_name || getUserDisplayName(user)}</h2>
              <p className="text-slate-500 mt-1">{profile?.description || 'Company account for contract and escrow management.'}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <Wallet className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-mono text-slate-700">{walletAddress}</span>
                  <button onClick={handleCopy} className="text-slate-400 hover:text-blue-600 transition-colors">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {humanizeEnum(profile?.verification_status)}
                </span>
              </div>
            </div>
            <Link
              to="/company/settings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Edit Settings
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {profileStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Company Name
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{profile?.company_name || 'Not set'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Member Since
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{formatDate(user?.created_at)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Website
              </p>
              {profile?.company_website ? (
                <a href={profile.company_website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 hover:text-blue-700 mt-1 inline-block">
                  {profile.company_website}
                </a>
              ) : (
                <p className="text-sm font-semibold text-slate-900 mt-1">Not set</p>
              )}
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Verification Status
              </p>
              <p className="text-sm font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {humanizeEnum(profile?.verification_status)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/company/contracts" className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group">
              <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">View Contracts</span>
            </Link>
            <Link to="/company/submissions" className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group">
              <CheckCircle2 className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">View Submissions</span>
            </Link>
            <Link to="/company/settings" className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group">
              <Settings className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Account Settings</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyProfile;
