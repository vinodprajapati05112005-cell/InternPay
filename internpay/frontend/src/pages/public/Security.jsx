import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, RefreshCcw, Clock, FileText, Fingerprint,
  CheckCircle2, ArrowRight, Shield, AlertTriangle, Server, Globe,
  Key, Eye, Zap, Database, Code, Activity, Layers
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

const Security = () => {
  const smartContractFeatures = [
    {
      icon: Key,
      title: 'Access Control',
      description: 'Role-based permission system ensures only authorized parties can execute contract functions. Company, freelancer, and judge roles are enforced on-chain with OpenZeppelin\'s AccessControl.',
      details: [
        'Owner-only administrative functions',
        'Role-based function modifiers',
        'Multi-signature for critical operations',
        'Revocable permissions'
      ]
    },
    {
      icon: Shield,
      title: 'Reentrancy Protection',
      description: 'All fund-transferring functions are protected with reentrancy guards using the checks-effects-interactions pattern and OpenZeppelin\'s ReentrancyGuard.',
      details: [
        'Checks-Effects-Interactions pattern',
        'OpenZeppelin ReentrancyGuard',
        'State changes before external calls',
        'Mutex locks on critical functions'
      ]
    },
    {
      icon: Clock,
      title: 'Timelock Mechanisms',
      description: 'Critical contract upgrades and parameter changes are subject to timelock delays, giving users time to review and react before changes take effect.',
      details: [
        '48-hour delay on contract upgrades',
        '24-hour dispute window after AI evaluation',
        'Configurable escrow release delays',
        'Emergency pause functionality'
      ]
    },
    {
      icon: Activity,
      title: 'Event Logging',
      description: 'Every significant action emits blockchain events, creating a permanent, transparent audit trail that anyone can verify independently.',
      details: [
        'Contract creation events',
        'Fund deposit & withdrawal logs',
        'Milestone status change tracking',
        'Dispute filing & resolution events'
      ]
    }
  ];

  const applicationFeatures = [
    {
      icon: Fingerprint,
      title: 'Wallet Signatures',
      description: 'All user authentication is handled through cryptographic wallet signatures. No passwords stored — your wallet is your identity.',
      details: [
        'MetaMask & WalletConnect support',
        'EIP-712 typed data signing',
        'Session tokens from wallet signatures',
        'No password database to breach'
      ]
    },
    {
      icon: CheckCircle2,
      title: 'Input Validation',
      description: 'Every user input is validated both client-side and server-side before processing. Malicious inputs are rejected before reaching the smart contract.',
      details: [
        'Client-side form validation',
        'Server-side data sanitization',
        'Smart contract require() checks',
        'SQL injection & XSS prevention'
      ]
    },
    {
      icon: Zap,
      title: 'Rate Limiting',
      description: 'API endpoints are protected with intelligent rate limiting to prevent abuse, DDoS attacks, and brute-force attempts.',
      details: [
        'Per-user request throttling',
        'IP-based rate limits',
        'Adaptive throttling for sensitive endpoints',
        'Automatic ban for suspicious patterns'
      ]
    },
    {
      icon: Globe,
      title: 'HTTPS / TLS',
      description: 'All communications between users and InternPay servers are encrypted with industry-standard TLS 1.3. No data travels in plaintext.',
      details: [
        'TLS 1.3 encryption',
        'HSTS header enforcement',
        'Certificate pinning',
        'Perfect forward secrecy'
      ]
    }
  ];

  const auditInfo = [
    { label: 'Smart Contract Audit', status: 'Completed', firm: 'CertiK', date: 'March 2026' },
    { label: 'Penetration Test', status: 'Completed', firm: 'Trail of Bits', date: 'April 2026' },
    { label: 'Bug Bounty Program', status: 'Active', firm: 'Immunefi', date: 'Ongoing' }
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
              <ShieldCheck size={16} />
              <span>Security Architecture</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
            >
              Security is not a feature.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                It's the foundation.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              InternPay is built with defense-in-depth security at every layer — from smart contracts on the blockchain to the application layer that serves your dashboard.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Smart Contract Security */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-medium text-sm mb-6 border border-blue-500/30">
              <Code size={16} />
              <span>On-Chain Security</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Smart Contract Security
            </h2>
            <p className="text-lg text-slate-400">
              Our Solidity smart contracts follow industry best practices and are built on battle-tested OpenZeppelin libraries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {smartContractFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 mb-5 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Security */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-6 border border-indigo-200">
              <Server size={16} />
              <span>Application Layer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Application Security
            </h2>
            <p className="text-lg text-slate-600">
              Beyond smart contracts, our web application implements multiple layers of security to protect user data and interactions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {applicationFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 mb-5 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 size={14} className="text-indigo-500 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Architecture Diagram */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Defense in depth
            </h2>
            <p className="text-lg text-slate-600">
              Multiple layers of security ensure that even if one layer is compromised, others continue to protect your assets.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-4"
          >
            {[
              { label: 'User Layer', desc: 'Wallet signatures, input validation, session management', color: 'blue', icon: Fingerprint },
              { label: 'Application Layer', desc: 'Rate limiting, HTTPS/TLS, CORS policies, CSP headers', color: 'indigo', icon: Server },
              { label: 'API Layer', desc: 'Authentication middleware, request validation, logging', color: 'purple', icon: Layers },
              { label: 'Smart Contract Layer', desc: 'Access control, reentrancy guards, timelocks, events', color: 'violet', icon: Code },
              { label: 'Blockchain Layer', desc: 'Immutable ledger, consensus mechanisms, decentralization', color: 'slate', icon: Database }
            ].map((layer, i) => {
              const Icon = layer.icon;
              return (
                <div
                  key={i}
                  className={`bg-${layer.color}-50 border border-${layer.color}-200 rounded-2xl p-6 flex items-center gap-5`}
                >
                  <div className={`w-12 h-12 bg-${layer.color}-100 text-${layer.color}-600 rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{layer.label}</h4>
                    <p className="text-slate-600 text-sm">{layer.desc}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Audit Status */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Audits & Bug Bounties
            </h2>
            <p className="text-lg text-slate-600">
              Our smart contracts and application have been independently audited by leading security firms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {auditInfo.map((audit, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center"
              >
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  audit.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  <CheckCircle2 size={12} />
                  {audit.status}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{audit.label}</h3>
                <p className="text-slate-600 text-sm mb-1">{audit.firm}</p>
                <p className="text-slate-400 text-xs">{audit.date}</p>
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
              Questions about our security?
            </h2>
            <p className="text-xl text-slate-600 mb-10">
              We're transparent about our security practices. Reach out to learn more about how we protect your funds and data.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Contact Us <ArrowRight size={20} />
              </Link>
              <Link
                to="/documentation"
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center text-lg"
              >
                View Documentation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Security;
