import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Privacy = () => {
  const lastUpdated = 'July 1, 2026';

  const sections = [
    {
      title: '1. Introduction',
      content: `Welcome to InternPay ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blockchain-powered escrow platform for freelance work (the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.`
    },
    {
      title: '2. Information We Collect',
      subsections: [
        {
          subtitle: '2.1 Wallet Information',
          content: 'When you connect your cryptocurrency wallet to InternPay, we collect your public wallet address. We do not collect or store private keys, seed phrases, or wallet passwords.'
        },
        {
          subtitle: '2.2 Profile Information',
          content: 'You may voluntarily provide profile information such as your display name, profile picture, professional skills, and portfolio links. This information helps companies and freelancers identify each other on the platform.'
        },
        {
          subtitle: '2.3 Contract & Transaction Data',
          content: 'When you create or participate in contracts, we collect contract details including project requirements, milestones, deliverables, payment amounts, and submission links (e.g., GitHub repositories, PenTool files, live demo URLs).'
        },
        {
          subtitle: '2.4 Communication Data',
          content: 'If you contact us through our contact form, email, or community channels, we collect the information you provide including your name, email address, and message content.'
        },
        {
          subtitle: '2.5 Usage Data',
          content: 'We automatically collect certain information about your device and how you interact with the Service, including IP address, browser type, operating system, pages visited, time spent on pages, and click patterns.'
        }
      ]
    },
    {
      title: '3. Blockchain Data',
      content: `InternPay operates on public blockchain networks. Please be aware that blockchain transactions are publicly visible and immutable. This means:`,
      bullets: [
        'Your wallet address and transaction history on the blockchain are publicly visible to anyone.',
        'Contract creation, escrow funding, milestone approvals, and payment releases are recorded on the blockchain permanently.',
        'Dispute filings and resolutions are recorded as blockchain events.',
        'We cannot delete or modify data that has been written to the blockchain.',
        'AI evaluation scores associated with contracts may be referenced on-chain.'
      ]
    },
    {
      title: '4. How We Use Your Information',
      bullets: [
        'Operate and maintain the InternPay platform and escrow services.',
        'Process and facilitate smart contract transactions between companies and freelancers.',
        'Generate AI-powered evaluation reports for submitted work.',
        'Facilitate dispute resolution through our judge network.',
        'Calculate and display reputation scores based on verified contract completions.',
        'Send notifications about contract status changes, payment releases, and disputes.',
        'Improve our platform, AI models, and user experience.',
        'Respond to your inquiries and provide customer support.',
        'Comply with legal obligations and enforce our Terms of Service.'
      ]
    },
    {
      title: '5. AI Evaluation & Data Processing',
      content: `When work is submitted for a milestone, our AI evaluation system processes the submitted materials (code repositories, design files, documentation, live demos) to generate an evaluation report. This processing includes:`,
      bullets: [
        'Analyzing code quality, structure, and adherence to best practices.',
        'Evaluating design deliverables against stated requirements.',
        'Assessing functional completeness of submitted work.',
        'Generating scores and written reasoning for transparency.',
        'Comparing submissions against original contract requirements.'
      ],
      footer: 'AI evaluation data is used solely for the purpose of contract fulfillment and dispute resolution. We do not sell AI evaluation data to third parties.'
    },
    {
      title: '6. Cookies & Tracking',
      content: 'InternPay uses essential cookies to maintain your session and preferences. We may use analytics cookies to understand how users interact with our platform.',
      bullets: [
        'Essential Cookies: Required for wallet authentication and session management. Cannot be disabled.',
        'Analytics Cookies: Help us understand usage patterns and improve the platform. You can opt out.',
        'We do not use advertising cookies or sell your data to advertisers.'
      ]
    },
    {
      title: '7. Third-Party Services',
      content: 'We may use third-party services that collect, monitor, and analyze user data to improve our Service:',
      bullets: [
        'Blockchain Networks: Transaction data is processed by public blockchain validators.',
        'Wallet Providers: MetaMask, WalletConnect, and other wallet providers have their own privacy policies.',
        'Cloud Infrastructure: We use industry-standard cloud providers with SOC 2 compliance.',
        'Analytics: We may use privacy-focused analytics tools to understand platform usage.'
      ]
    },
    {
      title: '8. Data Security',
      content: 'We implement appropriate technical and organizational security measures to protect your personal data, including encryption at rest and in transit (TLS 1.3), role-based access controls, regular security audits, and smart contract security reviews. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.'
    },
    {
      title: '9. Your Rights',
      content: 'Depending on your jurisdiction, you may have the following rights regarding your personal data:',
      bullets: [
        'Right to Access: Request a copy of the personal data we hold about you.',
        'Right to Rectification: Request correction of inaccurate personal data.',
        'Right to Erasure: Request deletion of your personal data (subject to blockchain data limitations).',
        'Right to Portability: Request a copy of your data in a machine-readable format.',
        'Right to Restriction: Request limitation of processing of your personal data.',
        'Right to Object: Object to processing of your personal data for certain purposes.'
      ],
      footer: 'Please note that data stored on the blockchain cannot be modified or deleted due to the immutable nature of blockchain technology. Off-chain data deletion requests will be processed within 30 days.'
    },
    {
      title: '10. Children\'s Privacy',
      content: 'InternPay is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately and we will take steps to delete such information.'
    },
    {
      title: '11. International Data Transfers',
      content: 'Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from your jurisdiction. By using InternPay, you consent to the transfer of your information to these countries.'
    },
    {
      title: '12. Changes to This Policy',
      content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.'
    },
    {
      title: '13. Contact Us',
      content: 'If you have any questions about this Privacy Policy or our data practices, please contact us:',
      bullets: [
        'Email: privacy@internpay.io',
        'Contact Form: Use our contact page to send us a message.',
        'Discord: Join our community for real-time support.'
      ]
    }
  ];

  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-15 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6 border border-blue-200"
            >
              <ShieldCheck size={16} />
              <span>Privacy Policy</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
            >
              Privacy Policy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-500 text-sm"
            >
              Last updated: {lastUpdated}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            <div className="space-y-10">
              {sections.map((section, i) => (
                <div key={i} className="scroll-mt-24" id={`section-${i + 1}`}>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    {section.title}
                  </h2>

                  {section.content && (
                    <p className="text-slate-600 leading-relaxed mb-4">{section.content}</p>
                  )}

                  {section.subsections && (
                    <div className="space-y-4 ml-4">
                      {section.subsections.map((sub, j) => (
                        <div key={j}>
                          <h3 className="text-base font-semibold text-slate-800 mb-2">{sub.subtitle}</h3>
                          <p className="text-slate-600 leading-relaxed text-sm">{sub.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.bullets && (
                    <ul className="space-y-2 ml-4 mt-3">
                      {section.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-2 text-slate-600 text-sm">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.footer && (
                    <p className="text-slate-600 leading-relaxed mt-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {section.footer}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Links */}
            <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
                © 2026 InternPay. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Terms of Service
                </Link>
                <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Contact Us
                </Link>
                <Link to="/security" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Security
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
