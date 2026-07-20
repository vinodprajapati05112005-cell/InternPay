import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale, Eye, FileText, BrainCircuit, Users, CheckCircle2,
  ArrowRight, Shield, Award, BarChart3, Clock, XCircle,
  DollarSign, TrendingUp, AlertTriangle, Gavel, Star, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 }
  })
};

const ForJudges = () => {
  const reviewSteps = [
    {
      icon: FileText,
      title: 'Review Contract Requirements',
      description: 'Examine the original contract scope, deliverables, milestones, and acceptance criteria agreed upon by both parties.'
    },
    {
      icon: Eye,
      title: 'Examine Student Work',
      description: 'Review submitted proof links — GitHub repos, PenTool designs, live demos, documentation — and test the deliverables yourself.'
    },
    {
      icon: BrainCircuit,
      title: 'Analyze AI Reports',
      description: 'Review the AI evaluation scores, reasoning, and recommendations. Understand how the AI assessed code quality, design, and requirement match.'
    },
    {
      icon: AlertTriangle,
      title: 'Review Evidence',
      description: 'Examine evidence from both parties — company\'s dispute filing with reasons and student\'s response with counter-evidence.'
    },
    {
      icon: Gavel,
      title: 'Make Your Decision',
      description: 'Choose from three outcomes: Approve Payment (freelancer wins), Reject & Refund (company wins), or Partial Payment (split).'
    }
  ];

  const decisions = [
    {
      icon: CheckCircle2,
      title: 'Approve Payment',
      description: 'The student\'s work meets contract requirements. Full payment is released from escrow to the freelancer.',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200'
    },
    {
      icon: XCircle,
      title: 'Reject & Refund',
      description: 'The work doesn\'t meet requirements. Full escrow amount is returned to the company.',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    },
    {
      icon: DollarSign,
      title: 'Partial Payment',
      description: 'Work partially meets requirements. Judge sets a percentage split between freelancer and company.',
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200'
    }
  ];

  const mockStats = {
    reputation: 94,
    accuracy: '97.3%',
    completed: 128,
    avgTime: '4.2 hrs'
  };

  const mockHistory = [
    { id: '#D-1092', contract: 'React Dashboard', decision: 'Approve Payment', date: 'Jul 14, 2026', payout: '$45' },
    { id: '#D-1087', contract: 'Mobile App API', decision: 'Partial Payment', date: 'Jul 12, 2026', payout: '$45' },
    { id: '#D-1081', contract: 'Landing Page', decision: 'Reject & Refund', date: 'Jul 10, 2026', payout: '$45' },
    { id: '#D-1076', contract: 'E-Commerce Backend', decision: 'Approve Payment', date: 'Jul 8, 2026', payout: '$45' }
  ];

  const decisionColors = {
    'Approve Payment': 'text-emerald-400',
    'Partial Payment': 'text-amber-400',
    'Reject & Refund': 'text-red-400'
  };

  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-medium text-sm mb-6 border border-purple-200"
            >
              <Scale size={16} />
              <span>For Dispute Judges</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
            >
              Be the voice of{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                fairness in freelancing.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              As an InternPay judge, you review disputed contracts, examine evidence from both parties, and make binding decisions that protect the ecosystem. Earn rewards and build your on-chain reputation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/judge/dashboard"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Judge Dashboard <ArrowRight size={20} />
              </Link>
              <Link
                to="/how-it-works"
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center text-lg"
              >
                How It Works
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reputation Stats */}
      <section className="bg-slate-900 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <h3 className="text-white font-bold text-lg">Judge Reputation Metrics</h3>
            <p className="text-slate-400 text-sm">Track your performance across all dispute resolutions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Star, value: mockStats.reputation, label: 'Reputation Score', suffix: '/100' },
              { icon: Activity, value: mockStats.accuracy, label: 'Accuracy Rate', suffix: '' },
              { icon: CheckCircle2, value: mockStats.completed, label: 'Disputes Resolved', suffix: '' },
              { icon: Clock, value: mockStats.avgTime, label: 'Avg. Resolution Time', suffix: '' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="text-center"
                >
                  <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon size={20} />
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                    {stat.value}<span className="text-sm font-medium text-slate-400">{stat.suffix}</span>
                  </div>
                  <div className="text-slate-400 font-medium text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Review Process */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              How dispute review works
            </h2>
            <p className="text-lg text-slate-600">
              Follow a structured review process to ensure every decision is fair, transparent, and well-documented.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {reviewSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="flex gap-6 items-start"
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
                      <Icon size={24} />
                    </div>
                    {i < reviewSteps.length - 1 && (
                      <div className="w-0.5 h-8 bg-slate-200 mt-2" />
                    )}
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      <span className="text-purple-600 mr-2">Step {i + 1}.</span>
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Decision Types */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Three possible decisions
            </h2>
            <p className="text-lg text-slate-600">
              After reviewing all evidence, make one of three binding decisions that the smart contract will execute automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {decisions.map((decision, i) => {
              const Icon = decision.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className={`${decision.bgColor} p-8 rounded-2xl border ${decision.borderColor} text-center`}
                >
                  <div className={`w-16 h-16 ${decision.bgColor} ${decision.textColor} rounded-full flex items-center justify-center mb-6 mx-auto border-2 ${decision.borderColor}`}>
                    <Icon size={32} />
                  </div>
                  <h3 className={`text-xl font-bold ${decision.textColor} mb-3`}>{decision.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{decision.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mock Dashboard Preview */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-medium text-sm mb-6 border border-purple-200">
                <BarChart3 size={16} />
                <span>Decision History</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Track your decision history
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Your judge dashboard shows your complete decision history, accuracy rate, and reputation score. Consistent, fair decisions improve your reputation and earn higher rewards.
              </p>
              <ul className="space-y-4">
                {[
                  'Complete dispute history with outcomes',
                  'Reputation score updated after every decision',
                  'Accuracy rate compared to consensus',
                  'Earnings tracker for judge rewards',
                  'Detailed feedback on each case'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="text-purple-500 shrink-0" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[50px] rounded-full" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-6">
                    <div>
                      <h4 className="text-white font-bold text-xl mb-1">Decision History</h4>
                      <p className="text-slate-400 text-sm">Your recent dispute resolutions</p>
                    </div>
                    <div className="bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-lg text-center">
                      <div className="text-xl font-black">{mockStats.reputation}</div>
                      <div className="text-[10px] uppercase tracking-wider font-bold">Rep Score</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {mockHistory.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-xs font-mono">{item.id}</span>
                            <span className="text-slate-200 font-medium text-sm truncate">{item.contract}</span>
                          </div>
                          <p className="text-slate-500 text-xs mt-0.5">{item.date}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className={`text-xs font-semibold ${decisionColors[item.decision]}`}>
                            {item.decision}
                          </span>
                          <span className="text-emerald-400 font-bold text-sm">{item.payout}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Total Earned</span>
                    <span className="text-emerald-400 font-bold text-lg">$5,760</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Become a Judge */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Why become an InternPay judge?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Earn Rewards',
                description: 'Get paid for every dispute you resolve. Consistent, fair decisions unlock higher-value cases and bonus rewards.'
              },
              {
                icon: Award,
                title: 'Build Reputation',
                description: 'Your on-chain reputation grows with every accurate decision. Top judges are recognized across the platform.'
              },
              {
                icon: Shield,
                title: 'Protect the Ecosystem',
                description: 'Your decisions ensure fairness for both companies and freelancers. You\'re the backbone of trust in InternPay.'
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center"
                >
                  <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Ready to be a voice of fairness?
            </h2>
            <p className="text-xl text-slate-600 mb-10">
              Join the judge network, resolve disputes fairly, and earn rewards for keeping the InternPay ecosystem trustworthy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/judge/dashboard"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Open Judge Dashboard <ArrowRight size={20} />
              </Link>
              <Link
                to="/how-it-works"
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center text-lg"
              >
                Learn How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ForJudges;
