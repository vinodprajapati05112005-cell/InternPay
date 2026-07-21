import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Bell, Shield, User, Wallet, Loader2, CheckCircle2, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi, studentApi } from '../../services/api';
import { humanizeEnum } from '../../utils/formatters';

const STORAGE_KEY = 'internpay_student_notification_prefs';

const defaultNotifications = {
  milestoneUpdates: true,
  paymentReleases: true,
  disputeAlerts: true,
  weeklySummary: false,
};

const StudentSettings = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    wallet_address: '',
    bio: '',
    portfolio_url: '',
    skills: '',
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
        // Ignore malformed local storage values.
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [authProfile, studentProfile] = await Promise.all([
          authApi.profile(),
          studentApi.profile(),
        ]);

        if (!cancelled) {
          setProfile(studentProfile || null);
          setForm({
            first_name: authProfile?.first_name || '',
            last_name: authProfile?.last_name || '',
            phone_number: authProfile?.phone_number || '',
            wallet_address: authProfile?.wallet_address || '',
            bio: studentProfile?.bio || '',
            portfolio_url: studentProfile?.portfolio_url || '',
            skills: Array.isArray(studentProfile?.skills) ? studentProfile.skills.join(', ') : '',
          });
        }
      } catch (loadError) {

        if (!cancelled) {
          setError(loadError?.message || 'Unable to load settings.');
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

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      await Promise.all([
        authApi.updateProfile({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          phone_number: form.phone_number.trim(),
          wallet_address: form.wallet_address.trim(),
        }),

        studentApi.updateProfile({
          bio: form.bio.trim(),
          portfolio_url: form.portfolio_url.trim(),
          skills: form.skills
            ? form.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
            : [],
        }),
      ]);

      await refreshProfile();
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 2500);
    } catch (saveError) {
      setError(saveError?.message || 'Unable to save your settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account preferences and notifications.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4">
              <nav className="space-y-1">
                <button className="w-full flex items-center px-3 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-medium transition-colors">
                  <User className="w-4 h-4 mr-3" />
                  Account
                </button>
                <button className="w-full flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
                </button>
                <button className="w-full flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">
                  <Wallet className="w-4 h-4 mr-3" />
                  Wallet
                </button>
                <button className="w-full flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">
                  <Shield className="w-4 h-4 mr-3" />
                  Security
                </button>
              </nav>
            </div>

            <div className="flex-1 p-6 md:p-8">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Account Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                      <input
                        type="text"
                        value={form.first_name}
                        onChange={(event) => handleChange('first_name', event.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                      <input
                        type="text"
                        value={form.last_name}
                        onChange={(event) => handleChange('last_name', event.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                      <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        value={form.phone_number}
                        onChange={(event) => handleChange('phone_number', event.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Wallet Address (EVM Compatible)</label>
                    <input
                      type="text"
                      value={form.wallet_address}
                      onChange={(event) => handleChange('wallet_address', event.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-mono text-sm"
                    />
                  </div>
                </div>


                <div className="pt-6 border-t border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Student Profile</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Portfolio URL</label>
                        <input
                          type="url"
                          value={form.portfolio_url}
                          onChange={(event) => handleChange('portfolio_url', event.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Skills</label>
                        <input
                          type="text"
                          value={form.skills}
                          onChange={(event) => handleChange('skills', event.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
                      <textarea
                        rows={4}
                        value={form.bio}
                        onChange={(event) => handleChange('bio', event.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Email Notifications</h2>
                  <div className="space-y-4">
                    {[
                      {
                        key: 'milestoneUpdates',
                        title: 'Milestone Updates',
                        description: 'Get notified when a milestone is approved or rejected.',
                      },
                      {
                        key: 'paymentReleases',
                        title: 'Payment Releases',
                        description: 'Get notified when funds are released to your wallet.',
                      },
                      {
                        key: 'disputeAlerts',
                        title: 'Dispute Alerts',
                        description: 'Get notified if a dispute is filed on your submission.',
                      },
                      {
                        key: 'weeklySummary',
                        title: 'Weekly Summary',
                        description: 'Receive a weekly digest of your activity.',
                      },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between cursor-pointer group">
                        <div>
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          <p className="text-sm text-slate-500">{item.description}</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notifications[item.key]}
                            onChange={() => toggleNotification(item.key)}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    Notification preferences are stored locally in this browser.
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    {showToast && (
                      <span className="text-emerald-600 font-medium text-sm flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Settings saved successfully
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
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

export default StudentSettings;
