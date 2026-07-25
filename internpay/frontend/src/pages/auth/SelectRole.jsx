import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  GraduationCap,
  Scale,
  ArrowRight,
  Shield,
  CheckCircle2,
  Briefcase,
  Code,
  DollarSign,
  Users,
  Star,
  FileCheck,
} from 'lucide-react';
import { getStoredWalletSession, shortenWalletAddress } from '../../utils/wallet';

const roles = [
  {
    id: 'company',
    title: 'Company',
    subtitle: 'Employer / Client',
    description: 'Create contracts and hire talent',
    link: '/register?role=COMPANY',
    icon: Building2,
    gradient: 'from-blue-500 to-blue-700',
    lightBg: 'bg-blue-50',
    lightBorder: 'border-blue-200',
    lightText: 'text-blue-700',
    hoverShadow: 'hover:shadow-blue-500/20',
    ringColor: 'ring-blue-500',
    features: [
      { icon: Briefcase, text: 'Post escrow-backed contracts' },
      { icon: Users, text: 'Hire verified freelancers' },
      { icon: DollarSign, text: 'Secure fund management' },
    ],
  },
  {
    id: 'student',
    title: 'Student / Freelancer',
    subtitle: 'Talent / Worker',
    description: 'Complete work and get paid',
    link: '/register?role=STUDENT',
    icon: GraduationCap,
    gradient: 'from-indigo-500 to-purple-600',
    lightBg: 'bg-indigo-50',
    lightBorder: 'border-indigo-200',
    lightText: 'text-indigo-700',
    hoverShadow: 'hover:shadow-indigo-500/20',
    ringColor: 'ring-indigo-500',
    features: [
      { icon: Code, text: 'Browse available contracts' },
      { icon: FileCheck, text: 'Submit work for review' },
      { icon: DollarSign, text: 'Guaranteed escrow payments' },
    ],
  },
  {
    id: 'judge',
    title: 'Judge',
    subtitle: 'Dispute Resolver',
    description: 'Review disputes and build reputation',
    link: '/register?role=JUDGE',
    icon: Scale,
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50',
    lightBorder: 'border-emerald-200',
    lightText: 'text-emerald-700',
    hoverShadow: 'hover:shadow-emerald-500/20',
    ringColor: 'ring-emerald-500',
    features: [
      { icon: Scale, text: 'Resolve contract disputes' },
      { icon: Star, text: 'Build your reputation score' },
      { icon: DollarSign, text: 'Earn arbitration rewards' },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const SelectRole = () => {
  const [selected, setSelected] = useState(null);
  const [walletSession] = useState(() => getStoredWalletSession());

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-indigo-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-64 h-64 bg-emerald-50 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900">
              Intern<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pay</span>
            </span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Choose Your Role
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Select how you want to use InternPay. You can always change your role later in settings.
          </p>
        </motion.div>

        {/* Role Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selected === role.id;
            const walletSuffix = walletSession?.address ? `&wallet=${encodeURIComponent(walletSession.address)}` : '';

            return (
              <motion.div
                key={role.id}
                variants={item}
                onHoverStart={() => setSelected(role.id)}
                onHoverEnd={() => setSelected(null)}
                className={`relative bg-white rounded-2xl border ${
                  isSelected
                    ? `${role.lightBorder} ring-2 ${role.ringColor}`
                    : 'border-slate-200'
                } shadow-sm ${role.hoverShadow} hover:shadow-xl transition-all duration-300 overflow-hidden group`}
              >
                {/* Gradient top bar */}
                <div className={`h-1.5 bg-gradient-to-r ${role.gradient}`} />

                <div className="p-6 md:p-8 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 ${role.lightBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-7 h-7 ${role.lightText}`} />
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-extrabold text-slate-900 mb-1">{role.title}</h2>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {role.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-slate-500 mb-6">{role.description}</p>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-1">
                    {role.features.map((feature, idx) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 ${role.lightBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                          >
                            <FeatureIcon className={`w-4 h-4 ${role.lightText}`} />
                          </div>
                          <span className="text-sm text-slate-600">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={`${role.link}${walletSuffix}`}
                    className={`w-full py-3 bg-gradient-to-r ${role.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group-hover:gap-3`}
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm text-slate-500">
              {walletSession?.address ? (
                <>
                  Wallet connected:{' '}
                  <code className="text-slate-900 font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                    {shortenWalletAddress(walletSession.address)}
                  </code>
                </>
              ) : (
                <>
                  No wallet connected yet.{' '}
                  <Link to="/connect-wallet" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Connect a wallet
                  </Link>
                </>
              )}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SelectRole;
