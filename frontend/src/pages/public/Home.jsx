import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, BrainCircuit, Wallet, ArrowRight, CheckCircle2,
  AlertTriangle, Scale, Lock, FileText, CheckCircle, Upload,
  Clock, Star, Eye, Gavel, TrendingUp, Users, DollarSign,
  GitBranch, PenTool, Video, FileCode, BarChart3, Award,
  ChevronRight, Zap, Target, Layers, MessageSquare,
  ThumbsUp, ThumbsDown, MinusCircle, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ──────────────────────────── animation helpers ──────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay },
});

const SectionBadge = ({ icon: Icon, label, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-300',
  };
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm mb-6 border ${colorMap[color]}`}>
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════ */
/*                                HOME PAGE                                   */
/* ════════════════════════════════════════════════════════════════════════════ */

const Home = () => {
  return (
    <div className="w-full font-sans">

      {/* ═══════════════════ 1. HERO SECTION ═══════════════════ */}
      <section className="relative overflow-hidden bg-white pt-20 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div {...fadeUp(0)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6 border border-blue-200"
            >
              <ShieldCheck size={16} />
              <span>Smart Contract Escrow + AI Evaluation</span>
            </motion.div>

            <motion.h1 {...fadeUp(0.1)}
              className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
            >
              Work completed. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Payment protected.
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              InternPay combines AI-powered evaluation, blockchain escrow, and human dispute resolution to guarantee fair payment for every project.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/select-role"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Start a Contract <ArrowRight size={20} />
              </Link>
              <Link to="/how-it-works"
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center text-lg"
              >
                Explore How It Works
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual Workflow */}
          <motion.div {...fadeUp(0.45)}
            className="mt-20 max-w-5xl mx-auto bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-2xl p-6 md:p-8 hidden md:block"
          >
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-emerald-200 -z-10 -translate-y-1/2 rounded-full" />

              {[
                { label: 'Company', icon: Users, bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
                { label: 'Contract', icon: FileText, bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
                { label: 'Milestones', icon: Target, bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200' },
                { label: 'Escrow', icon: Lock, bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200' },
                { label: 'Work', icon: FileCode, bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-200' },
                { label: 'AI Eval', icon: BrainCircuit, bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200' },
                { label: 'Dispute Window', icon: Scale, bg: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-200' },
                { label: 'Release', icon: Wallet, bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-3 bg-white px-1 py-2">
                  <div className={`w-14 h-14 rounded-full ${step.bg} ${step.text} flex items-center justify-center ring-4 ${step.ring} shadow-md relative z-10`}>
                    <step.icon size={24} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 text-center leading-tight">{step.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mobile simplified workflow */}
          <motion.div {...fadeUp(0.45)} className="mt-12 md:hidden flex flex-wrap justify-center gap-3">
            {['Company', 'Contract', 'Escrow', 'Work', 'AI Eval', 'Dispute', 'Release'].map((s, i) => (
              <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                {i + 1}. {s}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 2. PROBLEM SECTION ═══════════════════ */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div {...fadeUp()} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">The Trust Problem in Freelancing</h2>
            <p className="text-lg text-slate-600">Traditional freelance platforms and direct contracts leave both parties vulnerable to ghosting and expensive disputes.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: AlertTriangle, iconBg: 'bg-red-50', iconColor: 'text-red-600', title: 'Payment Ghosting', desc: 'Work is completed, but payment is delayed for weeks or the client disappears completely. Freelancers lack guaranteed protection.' },
              { icon: Scale, iconBg: 'bg-orange-50', iconColor: 'text-orange-600', title: 'Expensive Disputes', desc: 'Traditional dispute resolution is costly, time-consuming, and heavily biased. Small contracts aren\'t worth fighting for.' },
              { icon: ShieldCheck, iconBg: 'bg-slate-100', iconColor: 'text-slate-600', title: 'Unreliable Verification', desc: 'Companies lack reliable, impartial verification that the delivered code actually meets the technical requirements they set.' },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${item.iconBg} ${item.iconColor} rounded-xl flex items-center justify-center mb-6`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 3. WHAT IS INTERNPAY ═══════════════════ */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div {...fadeUp()} className="text-center max-w-3xl mx-auto mb-16">
            <SectionBadge icon={Zap} label="The Solution" color="indigo" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">What is InternPay?</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              InternPay is a trustless freelance payment platform. Companies create contracts, students submit work, AI evaluates quality, escrow protects funds, a 24-hour dispute window ensures fairness, and certified judges resolve disagreements.
            </p>
          </motion.div>

          {/* Product flow visualization */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: FileText, color: 'blue', title: 'Companies Create Contracts', desc: 'Define project scope, requirements, milestones, deadlines, and payment amounts. Everything is on-chain and immutable.' },
                { icon: Upload, color: 'indigo', title: 'Students Submit Work', desc: 'Upload GitHub repos, PenTool links, demo URLs, documentation, and video walkthroughs as proof of delivery.' },
                { icon: BrainCircuit, color: 'purple', title: 'AI Evaluates Quality', desc: 'Specialized AI models analyze submissions against contract requirements and generate transparent scores.' },
                { icon: Lock, color: 'green', title: 'Escrow Protects Funds', desc: 'Funds are locked in blockchain escrow before work begins. Neither party can withdraw without verification.' },
                { icon: Clock, color: 'orange', title: '24-Hour Dispute Window', desc: 'After AI evaluation, both parties have 24 hours to accept the result or file a dispute before payment releases.' },
                { icon: Gavel, color: 'red', title: 'Judges Resolve Disputes', desc: 'Certified judges review all evidence—contract, submission, AI report—and make binding decisions with on-chain reputation.' },
              ].map((item, i) => (
                <motion.div key={i} {...fadeUp(i * 0.08)}
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors shadow-sm">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 4. COMPLETE 7-STEP WORKFLOW ═══════════════════ */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div {...fadeUp()} className="text-center max-w-3xl mx-auto mb-16">
            <SectionBadge icon={Layers} label="Complete Workflow" color="blue" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">How InternPay Works — 7 Steps</h2>
            <p className="text-lg text-slate-600">From contract creation to final payment, every step is transparent, verifiable, and protected.</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-0">
            {[
              {
                step: 1,
                title: 'Create Contract',
                desc: 'The company defines the project scope, technical requirements, milestones with individual deadlines, and total payment amount. The contract is recorded on-chain.',
                icon: FileText,
                color: 'blue',
                detail: 'Project name, description, tech stack, deliverables, milestone breakdown, deadlines, payment per milestone',
              },
              {
                step: 2,
                title: 'Lock Funds in Escrow',
                desc: 'The company deposits the agreed payment amount into a blockchain smart contract escrow. Funds are locked and cannot be withdrawn by either party until evaluation is complete.',
                icon: Lock,
                color: 'indigo',
                detail: 'USDC/ETH deposits, smart contract holds, automatic milestone allocation',
              },
              {
                step: 3,
                title: 'Submit Work',
                desc: 'The student submits their completed deliverables through the platform — linking GitHub repositories, PenTool designs, live demo URLs, documentation, and video walkthroughs.',
                icon: Upload,
                color: 'green',
                detail: 'GitHub, PenTool, demo URL, documentation files, video walkthrough',
              },
              {
                step: 4,
                title: 'AI Evaluation',
                desc: 'Specialized AI models evaluate the submitted work against the original contract requirements. The evaluation is automated, impartial, and consistent.',
                icon: BrainCircuit,
                color: 'purple',
                detail: 'Code analysis, design review, functionality testing, requirement matching',
              },
              {
                step: 5,
                title: 'Transparent Report',
                desc: 'Both parties receive a detailed evaluation report with an overall score, individual dimension scores (code quality, design quality, functionality, requirement match), strengths, weaknesses, AI reasoning, and a final recommendation.',
                icon: BarChart3,
                color: 'blue',
                detail: 'Score out of 100, 4 dimensions, strengths, weaknesses, reasoning, approve/reject recommendation',
              },
              {
                step: 6,
                title: '24-Hour Dispute Window',
                desc: 'After the report is published, both the company and student have a 24-hour window to review the evaluation. If either party disagrees, they can file a dispute with supporting evidence.',
                icon: Clock,
                color: 'orange',
                detail: 'Timer countdown, evidence upload, dispute reason, automatic acceptance after 24h',
              },
              {
                step: 7,
                title: 'Payment Release or Dispute Resolution',
                desc: 'If no dispute is filed within 24 hours, payment is automatically released to the student. If a dispute is filed, a certified judge reviews all evidence and makes a binding decision: Approve, Reject, or Partial.',
                icon: Wallet,
                color: 'emerald',
                detail: 'Auto-release, judge review, approve/reject/partial split, on-chain settlement',
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.06)} className="relative flex gap-6 pb-10">
                {/* Vertical connector */}
                {i < 6 && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-slate-200" />
                )}

                {/* Step circle */}
                <div className="shrink-0 relative z-10">
                  <div className={`w-12 h-12 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-sm`}>
                    <span className="font-extrabold text-slate-900 text-sm">{item.step}</span>
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <item.icon size={20} className="text-blue-600 shrink-0 mt-0.5" />
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-slate-600 mb-3 leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.detail.split(', ').map((tag, ti) => (
                      <span key={ti} className="px-2.5 py-1 bg-slate-50 text-slate-500 text-xs font-medium rounded-lg border border-slate-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 5. AI EVALUATION PREVIEW ═══════════════════ */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div {...fadeUp()} className="lg:w-1/2">
              <SectionBadge icon={BrainCircuit} label="AI-Powered Review" color="purple" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Impartial AI Verification</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                When work is submitted, our specialized AI models analyze the code, designs, and demo links against the original contract requirements.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Code Quality & Best Practices',
                  'Design Quality & UX/UI',
                  'Functional Completeness',
                  'Requirement Match Accuracy',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle className="text-green-500" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/documentation" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                Read about AI Evaluation <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="lg:w-1/2 w-full">
              {/* Mock AI Report Card */}
              <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[50px] rounded-full" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8 border-b border-slate-700 pb-6">
                    <div>
                      <h4 className="text-white font-bold text-xl mb-1">AI Evaluation Report</h4>
                      <p className="text-slate-400 text-sm">Contract: #8492 — Frontend Implementation</p>
                    </div>
                    <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-center">
                      <div className="text-2xl font-black">87<span className="text-sm font-medium text-emerald-500/70">/100</span></div>
                      <div className="text-[10px] uppercase tracking-wider font-bold">Approve</div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {[
                      { label: 'Code Quality', score: 92, color: 'bg-emerald-500' },
                      { label: 'Design Quality', score: 85, color: 'bg-blue-500' },
                      { label: 'Functionality', score: 88, color: 'bg-indigo-500' },
                      { label: 'Requirement Match', score: 84, color: 'bg-purple-500' },
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

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="bg-emerald-900/30 rounded-xl p-3 border border-emerald-800/40">
                      <h6 className="text-emerald-400 font-bold text-xs mb-1.5 uppercase tracking-wider">Strengths</h6>
                      <ul className="text-slate-400 text-xs space-y-1">
                        <li>• Clean component architecture</li>
                        <li>• Proper state management</li>
                        <li>• Excellent accessibility</li>
                      </ul>
                    </div>
                    <div className="bg-red-900/20 rounded-xl p-3 border border-red-800/30">
                      <h6 className="text-red-400 font-bold text-xs mb-1.5 uppercase tracking-wider">Weaknesses</h6>
                      <ul className="text-slate-400 text-xs space-y-1">
                        <li>• Tablet responsive issues</li>
                        <li>• Missing loading states</li>
                        <li>• No error boundaries</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <h5 className="text-slate-300 font-bold text-sm mb-2 uppercase tracking-wider">AI Reasoning</h5>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      "The implementation perfectly matches the requested React architecture. The code is modular and properly utilizes Tailwind CSS. Minor responsive issues detected on tablet viewports, but overall functionality is complete and well-structured."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6. ESCROW VISUALIZATION ═══════════════════ */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-slate-900 rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-900/40 to-transparent opacity-50" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <motion.div {...fadeUp()} className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Blockchain-Powered Escrow</h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  Our smart contracts are built with industry-standard security patterns to ensure funds are never locked permanently and transactions are always transparent and verifiable.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <Lock className="text-blue-400 mb-2" size={24} />
                    <h4 className="text-white font-bold mb-1">Access Control</h4>
                    <p className="text-slate-400 text-sm">Role-based permissions</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <ShieldCheck className="text-blue-400 mb-2" size={24} />
                    <h4 className="text-white font-bold mb-1">Reentrancy Guards</h4>
                    <p className="text-slate-400 text-sm">Prevents attack vectors</p>
                  </div>
                </div>
                <Link to="/security" className="mt-8 inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300">
                  Read our Security Architecture <ArrowRight size={16} />
                </Link>
              </motion.div>

              <motion.div {...fadeUp(0.15)} className="md:w-1/2 flex justify-center">
                <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Escrow Balance</div>
                    <div className="text-3xl font-black text-white">$1,500 <span className="text-base font-semibold text-slate-400">USDC</span></div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: FileText, label: 'Contract Created', done: true, active: false, iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400' },
                      { icon: Wallet, label: 'Funds Locked', done: true, active: false, iconBg: 'bg-indigo-500/20', iconColor: 'text-indigo-400' },
                      { icon: BrainCircuit, label: 'AI Evaluating...', done: false, active: true, iconBg: 'bg-blue-500/30', iconColor: 'text-blue-300' },
                      { icon: Scale, label: 'Release / Dispute', done: false, active: false, iconBg: 'bg-slate-700', iconColor: 'text-slate-400' },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-3 rounded-lg relative overflow-hidden ${
                          row.active
                            ? 'bg-blue-600/20 border border-blue-500/30'
                            : row.done
                            ? 'bg-slate-700/50'
                            : 'bg-slate-800 opacity-50'
                        }`}
                      >
                        {row.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${row.iconBg} flex items-center justify-center ${row.iconColor}`}>
                            <row.icon size={16} />
                          </div>
                          <span className={`font-medium ${row.active ? 'text-blue-100' : row.done ? 'text-slate-200' : 'text-slate-400'}`}>
                            {row.label}
                          </span>
                        </div>
                        {row.done && <CheckCircle2 className="text-green-400" size={18} />}
                        {row.active && <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 7. COMPANY EXPERIENCE PREVIEW ═══════════════════ */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div {...fadeUp()} className="text-center max-w-3xl mx-auto mb-16">
            <SectionBadge icon={Users} label="Company Dashboard" color="blue" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Manage Projects with Confidence</h2>
            <p className="text-lg text-slate-600">Track contracts, manage milestones, and release payments — all from one powerful dashboard.</p>
          </motion.div>

          {/* Stats row */}
          <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
            {[
              { label: 'Active Contracts', value: '12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Locked Funds', value: '$24,500', icon: Lock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Pending Submissions', value: '5', icon: Upload, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Active Disputes', value: '1', icon: Scale, color: 'text-red-600', bg: 'bg-red-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon size={20} />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Mock contract card + milestone timeline */}
          <motion.div {...fadeUp(0.2)} className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">In Progress</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">E-Commerce Dashboard Redesign</h4>
                <p className="text-sm text-slate-500">Assigned to Sarah M. · Due Aug 15, 2026</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-slate-900">$3,200</div>
                <div className="text-xs text-slate-400">Locked in Escrow</div>
              </div>
            </div>

            {/* Milestone timeline */}
            <div className="p-6">
              <h5 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Milestone Timeline</h5>
              <div className="space-y-4">
                {[
                  { name: 'UI/UX Wireframes', amount: '$800', status: 'completed', date: 'Jul 5' },
                  { name: 'Frontend Implementation', amount: '$1,200', status: 'in-progress', date: 'Jul 20' },
                  { name: 'Backend Integration', amount: '$800', status: 'pending', date: 'Aug 5' },
                  { name: 'Testing & Launch', amount: '$400', status: 'pending', date: 'Aug 15' },
                ].map((ms, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      ms.status === 'completed' ? 'bg-green-100 text-green-600' :
                      ms.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {ms.status === 'completed' ? <CheckCircle2 size={16} /> :
                       ms.status === 'in-progress' ? <Clock size={16} /> :
                       <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium text-sm ${ms.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{ms.name}</span>
                        <span className="text-sm font-semibold text-slate-600">{ms.amount}</span>
                      </div>
                      <div className="text-xs text-slate-400">Due {ms.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="text-center mt-10">
            <Link to="/company/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all">
              Explore Company Dashboard <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 8. STUDENT EXPERIENCE PREVIEW ═══════════════════ */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div {...fadeUp()} className="text-center max-w-3xl mx-auto mb-16">
            <SectionBadge icon={Award} label="Student Dashboard" color="indigo" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Get Paid for Your Skills</h2>
            <p className="text-lg text-slate-600">Submit work, view transparent AI evaluations, and track guaranteed payments — no more chasing invoices.</p>
          </motion.div>

          {/* Stats row */}
          <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
            {[
              { label: 'Total Earnings', value: '$8,450', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Active Contracts', value: '3', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Pending Payments', value: '$2,100', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Average AI Score', value: '91', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon size={20} />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Submission interface preview */}
            <motion.div {...fadeUp(0.15)} className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Submit Deliverables</h4>
              <div className="space-y-3">
                {[
                  { icon: GitBranch, label: 'GitHub Repository', value: 'github.com/sarah/ecomm-dash', connected: true },
                  { icon: PenTool, label: 'PenTool Design', value: 'figma.com/file/abc123', connected: true },
                  { icon: Eye, label: 'Live Demo URL', value: 'ecomm-dash.vercel.app', connected: true },
                  { icon: FileText, label: 'Documentation', value: 'README.md uploaded', connected: true },
                  { icon: Video, label: 'Video Walkthrough', value: 'walkthrough.mp4', connected: false },
                ].map((link, i) => (
                  <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <link.icon size={18} className="text-slate-500" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">{link.label}</div>
                        <div className="text-xs text-slate-400">{link.value}</div>
                      </div>
                    </div>
                    {link.connected ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <Upload size={16} className="text-slate-400" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment timeline preview */}
            <motion.div {...fadeUp(0.2)} className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Payment Timeline</h4>
              <div className="space-y-4">
                {[
                  { project: 'Logo Design – Acme Corp', amount: '+$450', date: 'Jul 12', score: 94, status: 'paid' },
                  { project: 'Landing Page – StartupXYZ', amount: '+$1,200', date: 'Jul 8', score: 89, status: 'paid' },
                  { project: 'API Integration – DataFlow', amount: '$2,100', date: 'Pending', score: 87, status: 'pending' },
                  { project: 'Mobile App UI – FitTrack', amount: '$1,800', date: 'In Review', score: null, status: 'review' },
                ].map((pmt, i) => (
                  <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-900 truncate">{pmt.project}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{pmt.date}</span>
                        {pmt.score && (
                          <>
                            <span>·</span>
                            <span className="text-purple-500 font-medium">AI: {pmt.score}/100</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${pmt.status === 'paid' ? 'text-emerald-600' : 'text-slate-500'}`}>{pmt.amount}</div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${
                        pmt.status === 'paid' ? 'text-emerald-500' :
                        pmt.status === 'pending' ? 'text-orange-500' :
                        'text-blue-500'
                      }`}>{pmt.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.3)} className="text-center mt-10">
            <Link to="/student/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
              Explore Student Dashboard <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 9. JUDGE EXPERIENCE PREVIEW ═══════════════════ */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div {...fadeUp()} className="text-center max-w-3xl mx-auto mb-16">
            <SectionBadge icon={Gavel} label="Judge Dashboard" color="purple" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Fair, Human-Backed Dispute Resolution</h2>
            <p className="text-lg text-slate-600">Certified judges review disputes with full context — contract, submission, AI reports, and evidence — to make binding decisions.</p>
          </motion.div>

          {/* Stats row */}
          <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
            {[
              { label: 'Active Disputes', value: '4', icon: Scale, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Completed', value: '47', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Accuracy Rate', value: '96%', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Reputation Score', value: '4.9', icon: Star, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon size={20} />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Mock evidence review interface */}
          <motion.div {...fadeUp(0.2)} className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Under Review</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Dispute #1847 — API Integration Contract</h4>
                  <p className="text-sm text-slate-500">Filed by TechCorp Inc. · 18 hours remaining</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-200">Company Disputes</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full border border-purple-200">AI Score: 72</span>
                </div>
              </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-4">
              {/* Evidence tabs */}
              {[
                { label: 'Contract Requirements', icon: FileText, items: ['RESTful API with 12 endpoints', 'JWT authentication', 'Rate limiting', 'Unit test coverage > 80%'] },
                { label: 'Submission Evidence', icon: FileCode, items: ['GitHub: 847 commits, 12 branches', 'API docs via Swagger', 'Test coverage: 67%', 'Missing: Rate limiting'] },
              ].map((panel, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <panel.icon size={16} className="text-slate-500" />
                    <h5 className="text-sm font-bold text-slate-700">{panel.label}</h5>
                  </div>
                  <ul className="space-y-2">
                    {panel.items.map((it, j) => (
                      <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                        <ChevronRight size={14} className="text-slate-400 shrink-0 mt-0.5" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h5 className="text-sm font-bold text-slate-700 mb-3">Judge Decision Options</h5>
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors">
                    <ThumbsUp size={16} /> Approve Payment
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                    <ThumbsDown size={16} /> Reject — Refund Company
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl text-sm font-semibold hover:bg-orange-100 transition-colors">
                    <MinusCircle size={16} /> Partial Split
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="text-center mt-10">
            <Link to="/judge/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition-all">
              Explore Judge Dashboard <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 10. DISPUTE SYSTEM EXPLANATION ═══════════════════ */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div {...fadeUp()} className="text-center max-w-3xl mx-auto mb-16">
            <SectionBadge icon={Scale} label="Dispute Resolution" color="orange" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Transparent Dispute Process</h2>
            <p className="text-lg text-slate-600">When disagreements happen, our structured process ensures fair resolution backed by evidence and human judgment.</p>
          </motion.div>

          {/* Visual dispute flow */}
          <motion.div {...fadeUp(0.1)} className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1: File Dispute */}
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100 relative">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">Step 1</div>
                <div className="mt-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm border border-red-200">
                    <AlertTriangle size={24} className="text-red-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Company Files Dispute</h4>
                  <p className="text-sm text-slate-600 mb-4">Within the 24-hour window, the company submits a formal dispute with a reason and supporting evidence.</p>
                  <div className="space-y-2">
                    {['Dispute reason', 'Additional evidence', 'Specific requirements missed'].map((it, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-red-100">
                        <ChevronRight size={12} /> {it}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2: Judge Review */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 relative">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">Step 2</div>
                <div className="mt-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm border border-purple-200">
                    <Eye size={24} className="text-purple-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Judge Reviews Everything</h4>
                  <p className="text-sm text-slate-600 mb-4">A certified judge examines the full picture to make an informed decision.</p>
                  <div className="space-y-2">
                    {['Original contract & requirements', 'Submitted deliverables', 'AI evaluation report', 'Dispute evidence from both sides'].map((it, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-purple-100">
                        <CheckCircle2 size={12} className="text-purple-400" /> {it}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Decision */}
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 relative">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">Step 3</div>
                <div className="mt-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm border border-emerald-200">
                    <Gavel size={24} className="text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Binding Decision</h4>
                  <p className="text-sm text-slate-600 mb-4">The judge makes a final, binding decision that triggers automatic on-chain settlement.</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Approve — Pay freelancer', color: 'text-green-600 border-green-200 bg-green-50' },
                      { label: 'Reject — Refund company', color: 'text-red-600 border-red-200 bg-red-50' },
                      { label: 'Partial — Split funds', color: 'text-orange-600 border-orange-200 bg-orange-50' },
                    ].map((it, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border ${it.color}`}>
                        <Gavel size={12} /> {it.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 11. ROLES SECTION ═══════════════════ */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div {...fadeUp()} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Built for everyone in the ecosystem</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Benefits */}
            <motion.div {...fadeUp(0)} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">For Companies</h3>
              <ul className="space-y-4">
                {[
                  'Milestone-based contracts',
                  'Funds secured in smart contract escrow',
                  'Impartial AI verification of deliverables',
                  'Transparent evaluation reports',
                  'Fair, human-backed dispute system',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-600">
                    <CheckCircle2 className="text-blue-500 shrink-0" size={20} /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/for-companies" className="mt-8 inline-block text-blue-600 font-semibold hover:text-blue-700">
                Company Details &rarr;
              </Link>
            </motion.div>

            {/* Freelancer Benefits */}
            <motion.div {...fadeUp(0.1)} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">For Freelancers</h3>
              <ul className="space-y-4">
                {[
                  'Funds are locked before you start work',
                  'Submit GitHub/PenTool links as proof of work',
                  'Transparent AI scoring protects you',
                  'Automated payment tracking',
                  'Dispute protection against bad clients',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-600">
                    <CheckCircle2 className="text-indigo-500 shrink-0" size={20} /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/for-freelancers" className="mt-8 inline-block text-indigo-600 font-semibold hover:text-indigo-700">
                Freelancer Details &rarr;
              </Link>
            </motion.div>

            {/* Judge Benefits */}
            <motion.div {...fadeUp(0.2)} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">For Judges</h3>
              <ul className="space-y-4">
                {[
                  'Review escalated disputes impartially',
                  'Examine AI reports and user evidence',
                  'Test submitted code and designs',
                  'Make binding decisions',
                  'Build on-chain reputation score',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-600">
                    <CheckCircle2 className="text-purple-500 shrink-0" size={20} /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/for-judges" className="mt-8 inline-block text-purple-600 font-semibold hover:text-purple-700">
                Judge Details &rarr;
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 12. SECURITY SECTION ═══════════════════ */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-slate-900 rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-900/40 to-transparent opacity-50" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <motion.div {...fadeUp()} className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Bank-grade Blockchain Security</h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  Our smart contracts are built with industry-standard security patterns to ensure funds are never locked permanently and transactions are secure.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Lock, title: 'Access Control', desc: 'Role-based permissions' },
                    { icon: ShieldCheck, title: 'Reentrancy Guards', desc: 'Prevents attack vectors' },
                    { icon: Eye, title: 'Transparent Auditing', desc: 'On-chain verifiable' },
                    { icon: Zap, title: 'Gas Optimized', desc: 'Low transaction costs' },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <item.icon className="text-blue-400 mb-2" size={24} />
                      <h4 className="text-white font-bold mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <Link to="/security" className="mt-8 inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300">
                  Read our Security Architecture <ArrowRight size={16} />
                </Link>
              </motion.div>

              <motion.div {...fadeUp(0.15)} className="md:w-1/2">
                {/* Trust metrics */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl">
                  <h4 className="text-white font-bold text-lg mb-6 text-center">Platform Trust Metrics</h4>
                  <div className="space-y-6">
                    {[
                      { label: 'Contracts Completed', value: '2,847', trend: '+12%' },
                      { label: 'Funds Secured', value: '$1.2M', trend: '+28%' },
                      { label: 'Disputes Resolved', value: '156', trend: '96% fair' },
                      { label: 'Average AI Accuracy', value: '94.2%', trend: 'Verified' },
                    ].map((metric, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">{metric.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold text-lg">{metric.value}</span>
                          <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">{metric.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 13. FINAL CTA ═══════════════════ */}
      <section className="py-28 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-200/30 to-indigo-200/30 blur-[100px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Your work deserves more <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">than a promise.</span>
            </h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Join the platform that guarantees payment for completed work, delivers verified results for companies, and resolves disputes fairly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/select-role"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg flex items-center justify-center gap-2"
              >
                Start with InternPay <ArrowRight size={20} />
              </Link>
              <Link to="/documentation"
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-lg flex items-center justify-center gap-2"
              >
                <BookOpen size={20} /> Read Documentation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
