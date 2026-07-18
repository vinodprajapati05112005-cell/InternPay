import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Bell,
  Mail,
  User,
  Save,
  CheckCircle2,
  ArrowLeft,
  Shield,
  Globe,
  Eye,
  Building2,
  Loader2,
} from 'lucide-react';
import { companyApi } from '../../services/api';
import { formatDate, humanizeEnum } from '../../utils/formatters';

const STORAGE_KEY = 'internpay_company_notification_prefs';

const defaultNotifications = {
  submissionReceived: true,
  disputeFiled: true,
  paymentReleased: true,
  contractFunded: true,
  milestoneCompleted: false,
  weeklyReport: true,
};

const CompanySettings = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    company_name: '',
    company_website: '',
    company_registration_number: '',
    company_industry: '',
    company_address: '',
    description: '',
    team_size: '',
  });
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setNotifications({ ...defaultNotifications, ...JSON.parse(saved) });
      } catch {
        // Ignore malformed settings.
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');

      try {
        const profileData = await companyApi.profile();
        if (!cancelled) {
          setProfile(profileData || null);
          setForm({
            company_name: profileData?.company_name || '',
            company_website: profileData?.company_website || '',
            company_registration_number: profileData?.company_registration_number || '',
            company_industry: profileData?.company_industry || '',
            company_address: profileData?.company_address || '',
            description: profileData?.description || '',
            team_size: profileData?.team_size || '',
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load company settings.');
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) {
      setError('');
    }
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      await companyApi.updateProfile({
        company_name: form.company_name.trim(),
        company_website: form.company_website.trim(),
        company_registration_number: form.company_registration_number.trim(),
        company_industry: form.company_industry.trim(),
        company_address: form.company_address.trim(),
        description: form.description.trim(),
        team_size: form.team_size ? Number(form.team_size) : null,
      });

      const nextProfile = await companyApi.profile();
      setProfile(nextProfile || null);
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 2500);
    } catch (saveError) {
      setError(saveError?.message || 'Unable to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading company settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/company/profile" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          Settings
        </h1>
        <p className="text-slate-500 mt-1">Manage your company details and notification preferences.</p>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Company Profile
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(event) => handleChange('company_name', event.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Website</label>
                <input
                  type="url"
                  value={form.company_website}
                  onChange={(event) => handleChange('company_website', event.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Registration Number</label>
                <input
                  type="text"
                  value={form.company_registration_number}
                  onChange={(event) => handleChange('company_registration_number', event.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Team Size</label>
                <input
                  type="number"
                  value={form.team_size}
                  onChange={(event) => handleChange('team_size', event.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Industry</label>
                <input
                  type="text"
                  value={form.company_industry}
                  onChange={(event) => handleChange('company_industry', event.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Address</label>
                <input
                  type="text"
                  value={form.company_address}
                  onChange={(event) => handleChange('company_address', event.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => handleChange('description', event.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Notification Preferences
          </h2>

          <div className="space-y-4">
            {[
              { key: 'submissionReceived', label: 'Submission Received', description: 'Get notified when a student submits work for review', icon: Mail },
              { key: 'disputeFiled', label: 'Dispute Filed', description: 'Get notified when a dispute is filed on your contracts', icon: Shield },
              { key: 'paymentReleased', label: 'Payment Released', description: 'Get notified when escrow funds are released', icon: CheckCircle2 },
              { key: 'contractFunded', label: 'Contract Funded', description: 'Get confirmation when contract funding is complete', icon: Globe },
              { key: 'milestoneCompleted', label: 'Milestone Completed', description: 'Get notified when a milestone is marked complete', icon: Eye },
              { key: 'weeklyReport', label: 'Weekly Summary Report', description: 'Receive a weekly summary of all contract activity', icon: Bell },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <item.icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification(item.key)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    notifications[item.key] ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    layout
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                    style={{ left: notifications[item.key] ? '26px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Account Snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <User className="w-3 h-3" />
                Company Name
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{profile?.company_name || 'Not set'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <CalendarIconFallback />
                Verification Status
              </p>
              <p className="text-sm font-semibold text-emerald-600 mt-1">{humanizeEnum(profile?.verification_status)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Wallet className="w-3 h-3" />
                Team Size
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{profile?.team_size || 'Not set'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Settings className="w-3 h-3" />
                Updated
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{formatDate(profile?.updated_at)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold text-sm">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CalendarIconFallback = () => <Shield className="w-3 h-3" />;

export default CompanySettings;
