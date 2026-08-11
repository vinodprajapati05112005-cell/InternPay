import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Terms = () => {
  const lastUpdated = 'July 1, 2026';

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using InternPay ("the Platform," "Service," "we," "our," or "us"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not access or use the Platform. These Terms constitute a legally binding agreement between you and InternPay.`
    },
    {
      title: '2. Eligibility',
      content: 'To use InternPay, you must:',
      bullets: [
        'Be at least 18 years of age or the age of legal majority in your jurisdiction.',
        'Have the legal capacity to enter into binding contracts.',
        'Have a compatible cryptocurrency wallet (e.g., MetaMask, WalletConnect).',
        'Not be located in a jurisdiction where the use of blockchain-based services or cryptocurrency is prohibited.',
        'Not have been previously banned or removed from the Platform for violations of these Terms.'
      ]
    },
    {
      title: '3. Platform Description',
      content: 'InternPay is a blockchain-powered escrow platform that facilitates secure freelance work contracts between companies (clients) and freelancers (students/contractors). The Platform provides:',
      bullets: [
        'Smart contract-based escrow services for securing project payments.',
        'Milestone-based contract creation and management.',
        'AI-powered evaluation of submitted work against contract requirements.',
        'A dispute resolution system with impartial human judges.',
        'On-chain reputation tracking for all participants.'
      ],
      footer: 'InternPay acts as a technology platform and escrow facilitator. We are not a party to the contracts between companies and freelancers, and we do not guarantee the quality of work or the outcome of any contract.'
    },
    {
      title: '4. User Accounts & Wallets',
      subsections: [
        {
          subtitle: '4.1 Wallet Connection',
          content: 'You access InternPay by connecting your cryptocurrency wallet. You are solely responsible for maintaining the security of your wallet, private keys, and seed phrases. InternPay never has access to your private keys.'
        },
        {
          subtitle: '4.2 Account Responsibility',
          content: 'You are responsible for all activities that occur through your connected wallet address. You must notify us immediately if you suspect unauthorized use of your account.'
        },
        {
          subtitle: '4.3 Roles',
          content: 'Users may register as Companies (contract creators), Freelancers/Students (contract workers), or Judges (dispute resolvers). Each role has specific permissions and responsibilities within the Platform.'
        }
      ]
    },
    {
      title: '5. Smart Contracts & Escrow',
      subsections: [
        {
          subtitle: '5.1 Contract Creation',
          content: 'Companies create contracts by specifying project requirements, milestones, deliverables, deadlines, and payment amounts. Once a contract is created and funded, its terms are enforced by the smart contract on the blockchain.'
        },
        {
          subtitle: '5.2 Escrow Funding',
          content: 'Companies must deposit the full contract value in ETH into the escrow smart contract before a freelancer can begin work. Funds are locked and cannot be withdrawn unilaterally by either party.'
        },
        {
          subtitle: '5.3 Payment Release',
          content: 'Escrowed funds are released to the freelancer when: (a) the company approves the milestone submission, (b) the AI evaluation score meets the contract threshold and no dispute is filed within 24 hours, or (c) a judge rules in favor of the freelancer in a dispute.'
        },
        {
          subtitle: '5.4 Refunds',
          content: 'Escrowed funds are returned to the company when: (a) the freelancer fails to submit work by the deadline, (b) both parties mutually agree to cancel the contract, or (c) a judge rules in favor of the company in a dispute.'
        },
        {
          subtitle: '5.5 Smart Contract Risks',
          content: 'While our smart contracts have been audited, blockchain technology carries inherent risks. You acknowledge that smart contracts may contain undiscovered vulnerabilities, and InternPay is not liable for losses arising from smart contract exploits beyond our reasonable control.'
        }
      ]
    },
    {
      title: '6. AI Evaluation',
      subsections: [
        {
          subtitle: '6.1 Purpose',
          content: 'InternPay uses AI-powered evaluation to provide an objective assessment of submitted work against contract requirements. AI evaluation generates scores across multiple dimensions (code quality, design fidelity, functional completeness, requirement match).'
        },
        {
          subtitle: '6.2 Limitations',
          content: 'AI evaluation is provided as a tool to assist decision-making. It is not infallible and may not capture all nuances of complex deliverables. Both parties retain the right to dispute AI evaluation results.'
        },
        {
          subtitle: '6.3 Data Usage',
          content: 'Submitted work materials (code, designs, documentation) are processed by our AI systems solely for evaluation purposes. We do not use submitted work to train our AI models without explicit consent.'
        }
      ]
    },
    {
      title: '7. Dispute Resolution',
      subsections: [
        {
          subtitle: '7.1 Filing Disputes',
          content: 'Either party may file a dispute within 24 hours of an AI evaluation being published. Disputes must include a clear explanation of the disagreement and supporting evidence.'
        },
        {
          subtitle: '7.2 Judge Review',
          content: 'Disputes are assigned to qualified, impartial judges from the InternPay judge network. Judges review the contract requirements, submitted work, AI evaluation, and evidence from both parties before making a decision.'
        },
        {
          subtitle: '7.3 Judge Decisions',
          content: 'Judges may issue one of three decisions: (a) Approve Payment — full escrow amount is released to the freelancer, (b) Reject & Refund — full escrow amount is returned to the company, or (c) Partial Payment — judge sets a percentage split between both parties.'
        },
        {
          subtitle: '7.4 Finality',
          content: 'Judge decisions are final and binding. The smart contract will automatically execute the judge\'s decision. By using the Platform, you agree to accept judge decisions as the final resolution of disputes.'
        }
      ]
    },
    {
      title: '8. Fees',
      content: 'InternPay charges the following fees:',
      bullets: [
        'Platform Fee: A percentage fee (currently 2.5%) is deducted from each successful payment release.',
        'Gas Fees: Users are responsible for blockchain gas fees associated with their transactions.',
        'Judge Fees: A fixed fee per dispute is charged to the losing party to compensate the judge.',
        'No Hidden Fees: All fees are transparently displayed before any transaction is confirmed.'
      ],
      footer: 'Fee rates may be updated with 30 days\' prior notice. Changes will be posted on the Platform and communicated to registered users.'
    },
    {
      title: '9. Intellectual Property',
      subsections: [
        {
          subtitle: '9.1 Platform IP',
          content: 'The InternPay platform, including its design, code, AI models, logos, and documentation, is the intellectual property of InternPay. You may not copy, modify, distribute, or reverse-engineer any part of the Platform.'
        },
        {
          subtitle: '9.2 User Content',
          content: 'You retain ownership of all content you submit to the Platform, including code, designs, and documentation. By submitting content for AI evaluation, you grant InternPay a limited license to process the content for evaluation purposes only.'
        },
        {
          subtitle: '9.3 Work Product',
          content: 'Ownership of work product created under InternPay contracts is governed by the terms of the individual contract between the company and freelancer. InternPay does not claim ownership of any work product.'
        }
      ]
    },
    {
      title: '10. Prohibited Conduct',
      content: 'You agree not to:',
      bullets: [
        'Use the Platform for any illegal purpose or in violation of applicable laws.',
        'Submit fraudulent work, fake proof links, or plagiarized content.',
        'Manipulate AI evaluation scores through any automated or deceptive means.',
        'Collude with judges to influence dispute outcomes.',
        'Create multiple accounts to circumvent bans or reputation systems.',
        'Attempt to exploit, hack, or compromise smart contracts or platform infrastructure.',
        'Harass, threaten, or intimidate other users of the Platform.',
        'Use the Platform to launder money or finance prohibited activities.',
        'Interfere with the proper functioning of the Platform or its security features.'
      ]
    },
    {
      title: '11. Limitation of Liability',
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, INTERNPAY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE PLATFORM. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNT OF FEES YOU PAID TO INTERNPAY IN THE 12 MONTHS PRECEDING THE CLAIM.`
    },
    {
      title: '12. Indemnification',
      content: 'You agree to indemnify, defend, and hold harmless InternPay, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys\' fees) arising out of or related to your use of the Platform, your violation of these Terms, or your violation of any rights of a third party.'
    },
    {
      title: '13. Modifications to Terms',
      content: 'We reserve the right to modify these Terms at any time. Material changes will be communicated through the Platform at least 30 days before they take effect. Your continued use of the Platform after changes take effect constitutes acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using the Platform.'
    },
    {
      title: '14. Termination',
      content: 'We may suspend or terminate your access to the Platform at any time for violation of these Terms or for any other reason at our sole discretion. Upon termination, any funds in active escrow will be handled according to the smart contract terms — we cannot and will not unilaterally seize escrowed funds. You may terminate your account at any time by disconnecting your wallet, though on-chain data will persist.'
    },
    {
      title: '15. Governing Law',
      content: 'These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising under these Terms that are not resolved through our dispute resolution system shall be resolved through binding arbitration.'
    },
    {
      title: '16. Severability',
      content: 'If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.'
    },
    {
      title: '17. Contact',
      content: 'If you have any questions about these Terms of Service, please contact us:',
      bullets: [
        'Email: legal@internpay.io',
        'Contact Form: Use our contact page for general inquiries.',
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
              <FileText size={16} />
              <span>Legal</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
            >
              Terms of Service
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

      {/* Terms Content */}
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
                    <p className={`text-slate-600 leading-relaxed ${section.title.includes('Limitation') ? 'text-xs font-medium uppercase tracking-wide bg-slate-50 p-4 rounded-xl border border-slate-100' : ''} mb-4`}>
                      {section.content}
                    </p>
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
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Privacy Policy
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

export default Terms;
