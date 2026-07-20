import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, FileText, Target, Lock, Eye, BrainCircuit, CheckCircle2,
  AlertTriangle, ArrowRight, Clock, DollarSign, Shield, Users,
  BarChart3, Milestone, ClipboardCheck, Scale
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

const ForCompanies = () => {
  const benefits = [
    {
      icon: FileText,
      title: 'Create Structured Contracts',
      description: 'Define project scope, requirements, tech stack, and acceptance criteria in a smart contract that both parties agree on before work begins.'
    },
    {
      icon: Milestone,
      title: 'Define Milestones',
      description: 'Break projects into clear milestones with specific deliverables, deadlines, and payment amounts tied to each phase of work.'
    },
    {
      icon: Lock,
      title: 'Lock Funds in Escrow',
      description: 'Deposit USDC into our blockchain escrow. Funds are secured on-chain and only released when milestones are verified and approved.'
    },
    {
      icon: Eye,
      title: 'Review Submitted Work',
      description: 'Access submitted deliverables including GitHub repos, PenTool designs, live demos, documentation, and video walkthroughs — all in one place.'
    },
    {
      icon: BrainCircuit,
      title: 'AI-Powered Evaluation',
      description: 'Our AI analyzes every submission against your original requirements, generating transparent scores for code quality, functionality, and design.'
    },
    {
      icon: CheckCircle2,
      title: 'Approve & Release Payment',
      description: 'Review the AI report and approve payment with a single click. Funds are released instantly to the freelancer\'s wallet.'
    },
    {
      icon: Scale,
      title: 'Fair Dispute Resolution',
      description: 'Disagree with a submission? File a dispute with evidence. An impartial human judge reviews everything and makes a binding decision.'
    },
    {
      icon: BarChart3,
      title: 'Full Transparency',
      description: 'Track every contract, milestone, payment, and evaluation on your company dashboard. Complete audit trail stored on-chain.'
    }
  ];

  const workflowSteps = [
    { icon: FileText, label: 'Create Contract', color: 'blue', desc: 'Define scope & requirements' },
    { icon: Target, label: 'Define Milestones', color: 'indigo', desc: 'Set deliverables & deadlines' },
    { icon: Lock, label: 'Fund Escrow', color: 'purple', desc: 'Lock USDC on-chain' },
    { icon: Eye, label: 'Review Work', color: 'sky', desc: 'Examine submissions' },
    { icon: BrainCircuit, label: 'Review AI Report', color: 'violet', desc: 'AI scores & reasoning' },
    { icon: CheckCircle2, label: 'Approve or Dispute', color: 'emerald', desc: 'Release funds or escalate' }
  ];

  const stats = [
    { value: '$2.4M+', label: 'Funds Secured in Escrow' },
    { value: '98%', label: 'Successful Completions' },
    { value: '< 24h', label: 'Average Dispute Resolution' },
    { value: '340+', label: 'Active Companies' }
  ];

  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6 border border-blue-200"
            >
              <Building2 size={16} />
              <span>For Companies & Hiring Teams</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
            >
              Hire with confidence. {' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Pay only for verified work.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              InternPay protects your investment with blockchain escrow, AI-powered work verification, and milestone-based payment releases. No more chasing deliverables or paying for incomplete work.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/company/contracts/create"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Create a Contract <ArrowRight size={20} />
              </Link>
              <Link
                to="/company/dashboard"
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center text-lg"
              >
                Go to Dashboard
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-900 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 font-medium text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Your workflow, simplified
            </h2>
            <p className="text-lg text-slate-600">
              From contract creation to payment release — every step is transparent, secure, and verifiable on the blockchain.
            </p>
          </div>

          {/* Workflow Visual */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {workflowSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeUp}
                    className="relative"
                  >
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center h-full flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full bg-${step.color}-50 text-${step.color}-600 flex items-center justify-center mb-4 border-2 border-${step.color}-100`}>
                        <Icon size={24} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{step.label}</h4>
                      <p className="text-xs text-slate-500">{step.desc}</p>
                    </div>
                    {i < workflowSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                        <ArrowRight size={16} className="text-slate-300" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Everything you need to manage freelance contracts
            </h2>
            <p className="text-lg text-slate-600">
              InternPay gives companies complete control and visibility over every stage of the freelance engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Report Preview */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-medium text-sm mb-6 border border-purple-200">
                <BrainCircuit size={16} />
                <span>AI Evaluation Reports</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Make data-driven approval decisions
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Every submission is evaluated by our AI against your original requirements. You get a detailed report with scores, reasoning, and recommendations — so you never have to guess whether the work meets your standards.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Automated code quality analysis',
                  'Requirement-to-delivery match scoring',
                  'Design fidelity & UX assessment',
                  'Detailed reasoning for every score',
                  'Clear approve/reject recommendation'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[50px] rounded-full" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8 border-b border-slate-700 pb-6">
                    <div>
                      <h4 className="text-white font-bold text-xl mb-1">Company Review Panel</h4>
                      <p className="text-slate-400 text-sm">Contract: #1247 — E-Commerce Dashboard</p>
                    </div>
                    <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-center">
                      <div className="text-2xl font-black">91<span className="text-sm font-medium text-emerald-500/70">/100</span></div>
                      <div className="text-[10px] uppercase tracking-wider font-bold">Approve</div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {[
                      { label: 'Code Quality', score: 94, color: 'bg-emerald-500' },
                      { label: 'Requirement Match', score: 89, color: 'bg-blue-500' },
                      { label: 'Design Fidelity', score: 92, color: 'bg-indigo-500' },
                      { label: 'Performance', score: 88, color: 'bg-purple-500' }
                    ].map((dim, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-300 font-medium">{dim.label}</span>
                          <span className="text-slate-400">{dim.score}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div className={`${dim.color} h-2 rounded-full`} style={{ width: `${dim.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex gap-3">
                    <div className="flex-1 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-center py-3 rounded-xl font-bold text-sm">
                      ✓ Approve Payment
                    </div>
                    <div className="flex-1 bg-red-600/20 border border-red-500/30 text-red-400 text-center py-3 rounded-xl font-bold text-sm">
                      ✕ File Dispute
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Companies Choose InternPay */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Why companies choose InternPay
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Zero Risk',
                description: 'Funds stay locked in escrow until work is verified. If the freelancer doesn\'t deliver, you get a full refund.'
              },
              {
                icon: Clock,
                title: 'Save Time',
                description: 'AI evaluation eliminates hours of manual code review. Get instant, objective assessments of every submission.'
              },
              {
                icon: Users,
                title: 'Access Verified Talent',
                description: 'Every freelancer on InternPay has an on-chain reputation built from verified completions and AI scores.'
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
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
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
              Ready to hire smarter?
            </h2>
            <p className="text-xl text-slate-600 mb-10">
              Create your first milestone-based contract and experience secure, AI-verified freelance hiring.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/company/contracts/create"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Create a Contract <ArrowRight size={20} />
              </Link>
              <Link
                to="/company/dashboard"
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center text-lg"
              >
                Company Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ForCompanies;
