import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Workflow, Server, FileCode2, BrainCircuit, Scale, ShieldCheck,
  Rocket, Coins, ArrowRight, Search, Code2, ExternalLink
} from 'lucide-react';

const docSections = [
  {
    slug: 'overview',
    title: 'Overview',
    description: 'What is InternPay, its purpose, and core features that power trustless freelance payments.',
    icon: BookOpen,
    color: 'blue',
  },
  {
    slug: 'how-it-works',
    title: 'How It Works',
    description: 'A detailed 7-step walkthrough of the InternPay workflow — from contract creation to payment release.',
    icon: Workflow,
    color: 'indigo',
  },
  {
    slug: 'architecture',
    title: 'Architecture',
    description: 'System architecture overview covering React frontend, Solidity smart contracts, AI engine, and judge network.',
    icon: Server,
    color: 'purple',
  },
  {
    slug: 'smart-contracts',
    title: 'Smart Contracts',
    description: 'Deep dive into the escrow contract, payment release logic, dispute handling, and contract state machine.',
    icon: FileCode2,
    color: 'emerald',
  },
  {
    slug: 'ai-evaluation',
    title: 'AI Evaluation',
    description: 'How the AI engine evaluates submitted work across 4 dimensions with transparent scoring methodology.',
    icon: BrainCircuit,
    color: 'violet',
  },
  {
    slug: 'disputes',
    title: 'Disputes',
    description: 'The dispute resolution flow — evidence submission, judge review process, and binding decisions.',
    icon: Scale,
    color: 'orange',
  },
  {
    slug: 'security',
    title: 'Security',
    description: 'Smart contract security patterns, application security measures, and audit information.',
    icon: ShieldCheck,
    color: 'red',
  },
  {
    slug: 'deployment',
    title: 'Deployment',
    description: 'Technical deployment guide for setting up InternPay — frontend, contracts, and infrastructure.',
    icon: Rocket,
    color: 'sky',
  },
  {
    slug: 'economics',
    title: 'Economics',
    description: 'Platform fee structure (2.5%), payment flow mechanics, and judge reward economics.',
    icon: Coins,
    color: 'amber',
  },
];

const colorMap = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hoverBorder: 'hover:border-blue-400' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', hoverBorder: 'hover:border-indigo-400' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hoverBorder: 'hover:border-purple-400' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', hoverBorder: 'hover:border-emerald-400' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', hoverBorder: 'hover:border-violet-400' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', hoverBorder: 'hover:border-orange-400' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', hoverBorder: 'hover:border-red-400' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', hoverBorder: 'hover:border-sky-400' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', hoverBorder: 'hover:border-amber-400' },
};

const Documentation = () => {
  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6 border border-blue-200">
              <BookOpen size={16} />
              <span>Documentation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              InternPay{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Documentation
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Everything you need to understand, integrate, and build with InternPay — the blockchain-powered escrow platform for freelance work.
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/documentation/overview"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all text-sm flex items-center gap-2"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <Link
                to="/api-docs"
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all text-sm flex items-center gap-2"
              >
                <Code2 size={16} /> API Reference
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="lg:sticky lg:top-24">
                <nav className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Documentation
                  </h3>
                  <ul className="space-y-1">
                    {docSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <li key={section.slug}>
                          <Link
                            to={`/documentation/${section.slug}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-sm font-medium group"
                          >
                            <Icon size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                            {section.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="border-t border-slate-100 mt-4 pt-4">
                    <Link
                      to="/api-docs"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-sm font-medium group"
                    >
                      <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                      API Reference
                    </Link>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Main Content - Section Cards */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Browse Documentation</h2>
                <p className="text-slate-600 mb-8">
                  Select a topic below to dive into the details of how InternPay works.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {docSections.map((section, i) => {
                  const Icon = section.icon;
                  const colors = colorMap[section.color];
                  return (
                    <motion.div
                      key={section.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Link
                        to={`/documentation/${section.slug}`}
                        className={`block bg-white p-6 rounded-2xl border ${colors.border} ${colors.hoverBorder} shadow-sm hover:shadow-md transition-all group h-full`}
                      >
                        <div className={`w-11 h-11 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center mb-4`}>
                          <Icon size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          {section.description}
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read more <ArrowRight size={14} />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Start Guide */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-12 bg-slate-900 rounded-2xl p-8 md:p-10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[80px] rounded-full" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold text-white mb-3">Quick Start Guide</h3>
                  <p className="text-slate-400 mb-8 max-w-xl">
                    Get up and running with InternPay in minutes. Follow these steps to create your first escrow contract.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        step: '01',
                        title: 'Connect Wallet',
                        desc: 'Connect your MetaMask or WalletConnect wallet to the platform.',
                        link: '/connect-wallet',
                      },
                      {
                        step: '02',
                        title: 'Create Contract',
                        desc: 'Define milestones, set requirements, and fund the escrow.',
                        link: '/documentation/smart-contracts',
                      },
                      {
                        step: '03',
                        title: 'Submit & Get Paid',
                        desc: 'Complete work, submit proof, and receive automated payment.',
                        link: '/documentation/how-it-works',
                      },
                    ].map((item) => (
                      <Link
                        key={item.step}
                        to={item.link}
                        className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-colors group"
                      >
                        <div className="text-blue-400 text-sm font-bold mb-2">Step {item.step}</div>
                        <h4 className="text-white font-bold mb-1 group-hover:text-blue-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Popular Topics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
              >
                <h3 className="text-xl font-extrabold text-slate-900 mb-6">Popular Topics</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: 'How does the AI evaluate my work?', link: '/documentation/ai-evaluation' },
                    { title: 'What happens if I disagree with a decision?', link: '/documentation/disputes' },
                    { title: 'How are platform fees calculated?', link: '/documentation/economics' },
                    { title: 'Is the escrow contract audited?', link: '/documentation/security' },
                    { title: 'What chains does InternPay support?', link: '/documentation/deployment' },
                    { title: 'How do judges get rewarded?', link: '/documentation/economics' },
                  ].map((topic, i) => (
                    <Link
                      key={i}
                      to={topic.link}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <Search size={16} className="text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
                        {topic.title}
                      </span>
                      <ArrowRight size={14} className="text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Documentation;
