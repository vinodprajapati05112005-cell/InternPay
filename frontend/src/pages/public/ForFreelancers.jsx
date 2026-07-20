import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Eye, Target, Upload, GitBranch, PenTool, Globe, FileText,
  Video, BrainCircuit, CheckCircle2, DollarSign, ArrowRight, Shield,
  Clock, TrendingUp, Wallet, AlertTriangle, Scale, Star
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

const ForFreelancers = () => {
  const benefits = [
    {
      icon: Eye,
      title: 'View Available Contracts',
      description: 'Browse contracts from verified companies with clear requirements, timelines, and guaranteed escrow-locked payments.'
    },
    {
      icon: Target,
      title: 'See Milestones Clearly',
      description: 'Every contract breaks down into specific milestones with deliverables, deadlines, and individual payment amounts.'
    },
    {
      icon: Upload,
      title: 'Submit Your Work',
      description: 'Upload your completed work with proof links — connect your GitHub repos, PenTool designs, live demos, and documentation.'
    },
    {
      icon: BrainCircuit,
      title: 'AI-Scored Reports',
      description: 'Your work is evaluated by impartial AI against the contract requirements. Transparent scoring protects you from unfair rejections.'
    },
    {
      icon: DollarSign,
      title: 'Track Payments',
      description: 'Monitor payment status in real-time. See when escrow is funded, when milestones are approved, and when funds are released.'
    },
    {
      icon: Scale,
      title: 'Dispute Protection',
      description: 'Disagree with a company\'s decision? File a dispute response with your own evidence. A human judge reviews everything fairly.'
    }
  ];

  const proofTypes = [
    { icon: GitBranch, label: 'GitHub Repository', desc: 'Source code & commit history', color: 'slate' },
    { icon: PenTool, label: 'PenTool Design', desc: 'UI/UX design files', color: 'purple' },
    { icon: Globe, label: 'Live Demo', desc: 'Deployed application URL', color: 'blue' },
    { icon: FileText, label: 'Documentation', desc: 'Technical docs & guides', color: 'indigo' },
    { icon: Video, label: 'Video Walkthrough', desc: 'Screen recordings & demos', color: 'red' }
  ];

  const mockPayments = [
    { milestone: 'Frontend UI Implementation', amount: '$800', status: 'Paid', date: 'Jul 12, 2026' },
    { milestone: 'API Integration', amount: '$600', status: 'Approved', date: 'Jul 15, 2026' },
    { milestone: 'Testing & QA', amount: '$400', status: 'In Review', date: 'Pending' },
    { milestone: 'Final Deployment', amount: '$500', status: 'Locked', date: 'Pending' }
  ];

  const statusColors = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Approved: 'bg-blue-50 text-blue-700 border-blue-200',
    'In Review': 'bg-amber-50 text-amber-700 border-amber-200',
    Locked: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-6 border border-indigo-200"
            >
              <GraduationCap size={16} />
              <span>For Students & Freelancers</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
            >
              Do the work. {' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Get paid. Guaranteed.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              InternPay ensures your payment is locked in escrow before you start working. Submit your work, get AI-verified scores, and receive payment automatically. No more chasing clients.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/student/dashboard"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Student Dashboard <ArrowRight size={20} />
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

      {/* Why Freelancers Love InternPay */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Guaranteed Payment', desc: 'Funds are locked in blockchain escrow before you write a single line of code. No more unpaid invoices.' },
              { icon: BrainCircuit, title: 'Fair AI Evaluation', desc: 'Impartial AI scoring protects you from subjective rejections. Your work is evaluated against objective criteria.' },
              { icon: TrendingUp, title: 'Build Your Reputation', desc: 'Every completed contract adds to your on-chain reputation. Higher scores mean better contract opportunities.' }
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
                  className="text-center"
                >
                  <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-5 mx-auto border border-indigo-500/20">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Your freelance toolkit
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to find contracts, submit work, and get paid securely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
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

      {/* Proof of Work Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-6 border border-indigo-200">
                <Upload size={16} />
                <span>Proof of Work</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Submit proof links with your work
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                When you complete a milestone, attach proof links so both the company and AI can verify your deliverables. Support for all major platforms.
              </p>

              <div className="space-y-4">
                {proofTypes.map((proof, i) => {
                  const Icon = proof.icon;
                  return (
                    <motion.div
                      key={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={i}
                      variants={fadeUp}
                      className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100"
                    >
                      <div className={`w-10 h-10 bg-${proof.color}-50 text-${proof.color}-600 rounded-lg flex items-center justify-center shrink-0`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{proof.label}</h4>
                        <p className="text-slate-500 text-xs">{proof.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Payment Tracker Preview */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[50px] rounded-full" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-6">
                    <div>
                      <h4 className="text-white font-bold text-xl mb-1">Payment Tracker</h4>
                      <p className="text-slate-400 text-sm">Contract: #1247 — E-Commerce Dashboard</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">$2,300</div>
                      <div className="text-slate-400 text-xs">Total Contract Value</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {mockPayments.map((payment, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 font-medium text-sm truncate">{payment.milestone}</p>
                          <p className="text-slate-500 text-xs">{payment.date}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="text-white font-bold text-sm">{payment.amount}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[payment.status]}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Earned so far</span>
                    <span className="text-emerald-400 font-bold text-lg">$1,400</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Trusted by freelancers worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Alex Chen',
                role: 'Full-Stack Developer',
                quote: 'I never have to worry about getting paid anymore. The escrow locks funds before I start, and the AI scoring protects me from unfair rejections.',
                rating: 5
              },
              {
                name: 'Priya Sharma',
                role: 'UI/UX Designer',
                quote: 'The proof link system is brilliant. I can attach my PenTool files, live demos, and documentation all in one place. Clients love the transparency.',
                rating: 5
              },
              {
                name: 'Marcus Johnson',
                role: 'Mobile Developer',
                quote: 'Built my entire on-chain reputation here. Higher scores opened doors to bigger contracts. The dispute system is fair and fast.',
                rating: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-slate-500 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white border-t border-slate-200 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Start earning with confidence
            </h2>
            <p className="text-xl text-slate-600 mb-10">
              Browse contracts with guaranteed escrow, submit your work, and get paid fairly — every single time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/student/dashboard"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Go to Student Dashboard <ArrowRight size={20} />
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

export default ForFreelancers;
