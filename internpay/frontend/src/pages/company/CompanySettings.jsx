import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Bell, Mail, User, Save, CheckCircle2,
  ArrowLeft, Shield, Globe, Eye
} from 'lucide-react';

const CompanySettings = () => {
  const [displayName, setDisplayName] = useState('TechVentures Inc.');
  const [email, setEmail] = useState('admin@techventures.io');
  const [showToast, setShowToast] = useState(false);

  const [notifications, setNotifications] = useState({
    submissionReceived: true,
    disputeFiled: true,
    paymentReleased: true,
    contractFunded: true,
    milestoneCompleted: false,
    weeklyReport: true,
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const notificationItems = [
    { key: 'submissionReceived', label: 'Submission Received', description: 'Get notified when a student submits work for review', icon: Mail },
    { key: 'disputeFiled', label: 'Dispute Filed', description: 'Get notified when a dispute is filed on your contracts', icon: Shield },
    { key: 'paymentReleased', label: 'Payment Released', description: 'Get notified when escrow funds are released', icon: CheckCircle2 },
    { key: 'contractFunded', label: 'Contract Funded', description: 'Get confirmation when contract funding is complete', icon: Globe },
    { key: 'milestoneCompleted', label: 'Milestone Completed', description: 'Get notified when a milestone is marked complete', icon: Eye },
    { key: 'weeklyReport', label: 'Weekly Summary Report', description: 'Receive a weekly summary of all contract activity', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/company/profile" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          Settings
        </h1>
        <p className="text-slate-500 mt-1">Manage your account preferences</p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" /> Profile Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" /> Notification Preferences
          </h2>

          <div className="space-y-4">
            {notificationItems.map((item) => (
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

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </motion.div>
      </div>

      {/* Success Toast */}
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

export default CompanySettings;
