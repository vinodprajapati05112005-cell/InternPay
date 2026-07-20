import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Workflow, Server, FileCode2, BrainCircuit, Scale, ShieldCheck,
  Rocket, Coins, ArrowLeft, ArrowRight, ExternalLink, CheckCircle2,
  AlertTriangle, Lock, Code2, Zap, Users, Eye, Target, Star,
  DollarSign, PieChart, Award, Clock, Layers, Database, Globe,
  GitBranch, Terminal, Shield, Bug, FileSearch, Gavel, MessageSquare
} from 'lucide-react';

const sidebarSections = [
  { slug: 'overview', title: 'Overview', icon: BookOpen },
  { slug: 'how-it-works', title: 'How It Works', icon: Workflow },
  { slug: 'architecture', title: 'Architecture', icon: Server },
  { slug: 'smart-contracts', title: 'Smart Contracts', icon: FileCode2 },
  { slug: 'ai-evaluation', title: 'AI Evaluation', icon: BrainCircuit },
  { slug: 'disputes', title: 'Disputes', icon: Scale },
  { slug: 'security', title: 'Security', icon: ShieldCheck },
  { slug: 'deployment', title: 'Deployment', icon: Rocket },
  { slug: 'economics', title: 'Economics', icon: Coins },
];

const CodeBlock = ({ code, language }) => (
  <pre className="bg-slate-900 text-slate-300 rounded-xl p-5 text-sm overflow-x-auto leading-relaxed font-mono my-4 border border-slate-800">
    <code>{code}</code>
  </pre>
);

const SectionLink = ({ to, children }) => (
  <Link to={to} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
    {children}
  </Link>
);

const TableOfContents = ({ items }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10">
    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">On This Page</h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
          <ChevronIcon />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ChevronIcon = () => (
  <svg className="w-3 h-3 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
  </svg>
);

/* ============================================================
   SECTION CONTENT COMPONENTS
   ============================================================ */

const OverviewSection = () => (
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
      What is{' '}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        InternPay
      </span>
      ?
    </h1>
    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
      InternPay is a blockchain-powered escrow platform designed to eliminate the trust problem in freelance work.
      It guarantees payment for completed work and delivers verified results for companies — all without intermediaries.
    </p>

    <TableOfContents items={['The Problem', 'Our Solution', 'Core Features', 'Who Is It For?', 'Technology Stack']} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">The Problem</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      Freelance work is fundamentally built on trust — but trust between strangers is fragile. Companies worry about
      paying for subpar work, while freelancers fear working for weeks only to get ghosted on payment. Traditional
      platforms charge high fees and still can't guarantee fair outcomes.
    </p>
    <div className="grid md:grid-cols-3 gap-4 my-6">
      {[
        { icon: AlertTriangle, title: 'Payment Ghosting', desc: '47% of freelancers report being stiffed on at least one project.', color: 'red' },
        { icon: Clock, title: 'Slow Disputes', desc: 'Traditional dispute resolution takes 30-90 days on average.', color: 'orange' },
        { icon: Eye, title: 'No Transparency', desc: 'Opaque evaluation processes leave both parties frustrated.', color: 'slate' },
      ].map((item, i) => (
        <div key={i} className={`bg-${item.color === 'slate' ? 'slate-50' : item.color + '-50'} p-5 rounded-2xl border border-${item.color === 'slate' ? 'slate' : item.color}-200`}>
          <item.icon size={20} className={`text-${item.color}-600 mb-2`} />
          <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
          <p className="text-xs text-slate-600">{item.desc}</p>
        </div>
      ))}
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Our Solution</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      InternPay combines three powerful technologies to create a trustless freelance ecosystem:
    </p>
    <ul className="space-y-3 mb-6">
      {[
        'Smart Contract Escrow — Funds are locked on-chain before work begins. No one can withdraw until conditions are met.',
        'AI-Powered Evaluation — An impartial AI engine analyzes submitted work across 4 quality dimensions.',
        'Human Judge Network — For edge cases, verified human judges review disputes and make binding decisions.',
      ].map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-600">
          <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Core Features</h2>
    <div className="grid md:grid-cols-2 gap-4 my-6">
      {[
        { icon: Lock, title: 'Escrow Protection', desc: 'Funds locked in audited smart contracts until work is verified.' },
        { icon: BrainCircuit, title: 'AI Verification', desc: 'Automated, impartial code and design quality evaluation.' },
        { icon: Scale, title: 'Fair Disputes', desc: 'Human judges resolve escalations with full transparency.' },
        { icon: Zap, title: 'Instant Payments', desc: 'Automatic USDC release upon approval — no waiting.' },
        { icon: Layers, title: 'Milestone-Based', desc: 'Break projects into milestones for incremental delivery and payment.' },
        { icon: Shield, title: 'On-Chain Security', desc: 'All transactions are immutable and verifiable on the blockchain.' },
      ].map((item, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <item.icon size={20} className="text-blue-600 mb-2" />
          <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
          <p className="text-sm text-slate-600">{item.desc}</p>
        </div>
      ))}
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Who Is It For?</h2>
    <div className="grid md:grid-cols-3 gap-4 my-6">
      <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
        <Users size={20} className="text-blue-600 mb-2" />
        <h4 className="font-bold text-slate-900 mb-1">Companies</h4>
        <p className="text-sm text-slate-600">Post contracts, fund escrow, and receive AI-verified deliverables with guaranteed quality.</p>
      </div>
      <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200">
        <Code2 size={20} className="text-indigo-600 mb-2" />
        <h4 className="font-bold text-slate-900 mb-1">Freelancers</h4>
        <p className="text-sm text-slate-600">Work with confidence knowing payment is locked before you start. Get paid instantly on approval.</p>
      </div>
      <div className="bg-purple-50 p-5 rounded-2xl border border-purple-200">
        <Gavel size={20} className="text-purple-600 mb-2" />
        <h4 className="font-bold text-slate-900 mb-1">Judges</h4>
        <p className="text-sm text-slate-600">Review disputed cases, make binding decisions, and earn rewards while building on-chain reputation.</p>
      </div>
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Technology Stack</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      InternPay is built on modern, battle-tested technologies. For a deeper dive, check out the{' '}
      <SectionLink to="/documentation/architecture">Architecture</SectionLink> section.
    </p>
    <CodeBlock code={`Frontend:     React 18 + Tailwind CSS + Framer Motion
Blockchain:   Ethereum / Polygon (Solidity smart contracts)
AI Engine:    Custom evaluation models (Code, Design, UX)
Payments:     USDC (ERC-20 stablecoin)
Judge Layer:  Decentralized human review network`} />
  </div>
);

const HowItWorksSection = () => (
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
      How{' '}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        InternPay
      </span>
      {' '}Works
    </h1>
    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
      A complete 7-step workflow that takes a project from contract creation to payment release, with built-in
      safeguards at every stage.
    </p>

    <TableOfContents items={[
      'Step 1: Contract Creation',
      'Step 2: Escrow Funding',
      'Step 3: Work Execution',
      'Step 4: Submission',
      'Step 5: AI Evaluation',
      'Step 6: Dispute Window',
      'Step 7: Payment Release',
    ]} />

    {[
      {
        step: 1,
        title: 'Contract Creation',
        icon: FileCode2,
        color: 'blue',
        content: `The company creates a new contract specifying the project requirements, milestones, deadlines, and payment amounts. Each milestone has a clear description and acceptance criteria.`,
        detail: `The contract is initially created off-chain for review. Both parties can negotiate terms before finalizing. Once agreed upon, the contract details are hashed and prepared for on-chain deployment.`,
        code: `// Contract structure
{
  title: "E-commerce Dashboard",
  milestones: [
    { title: "Frontend", amount: 750, deadline: "2026-08-15" },
    { title: "Backend",  amount: 750, deadline: "2026-09-01" }
  ],
  requirements: ["React 18+", "TypeScript", "80% test coverage"],
  totalAmount: 1500  // USDC
}`,
      },
      {
        step: 2,
        title: 'Escrow Funding',
        icon: Lock,
        color: 'indigo',
        content: `The company funds the smart contract escrow with USDC. The full contract amount is locked on-chain — visible and verifiable by both parties. No work begins until funding is confirmed.`,
        detail: `The escrow contract uses a state machine pattern. Once funded, the contract moves from CREATED to FUNDED state. The freelancer is notified automatically and can begin work. Learn more in the Smart Contracts section.`,
        code: `// Escrow funding transaction
await escrowContract.fund(contractId, {
  value: ethers.utils.parseUnits("1500", 6),  // USDC has 6 decimals
  gasLimit: 150000
});
// Contract state: CREATED → FUNDED`,
      },
      {
        step: 3,
        title: 'Work Execution',
        icon: Code2,
        color: 'emerald',
        content: `The freelancer completes the work for the current milestone. They can track progress through their dashboard and see real-time contract status. The locked funds provide motivation and security.`,
        detail: `During this phase, the freelancer has access to all contract requirements. InternPay's dashboard shows milestone details, deadlines, and remaining time. Communication between parties happens off-chain.`,
        code: null,
      },
      {
        step: 4,
        title: 'Submission',
        icon: GitBranch,
        color: 'violet',
        content: `When work is complete, the freelancer submits proof of work — GitHub repositories, PenTool designs, live demo URLs, and any additional documentation.`,
        detail: `The submission is recorded on-chain with a hash of all submitted materials. This creates an immutable record that the work was delivered at a specific time. The AI evaluation is triggered automatically.`,
        code: `// Submission payload
{
  contractId: "contract_8492",
  milestoneId: "ms_001",
  githubUrl: "https://github.com/user/project",
  figmaUrl: "https://figma.com/file/abc123",
  demoUrl: "https://project.vercel.app",
  notes: "All requirements implemented per spec."
}`,
      },
      {
        step: 5,
        title: 'AI Evaluation',
        icon: BrainCircuit,
        color: 'purple',
        content: `InternPay's AI engine analyzes the submitted work against the original requirements. It evaluates 4 dimensions: Code Quality, Design Quality, Functionality, and Requirement Match.`,
        detail: `The AI generates a comprehensive report with scores, reasoning, and a recommendation (APPROVE/REVISE/REJECT). Scores above 70% trigger automatic approval. See the full methodology in the AI Evaluation section.`,
        code: `// AI Evaluation Report (example output)
{
  overallScore: 87,
  recommendation: "APPROVE",
  dimensions: {
    codeQuality:      { score: 92, feedback: "..." },
    designQuality:    { score: 85, feedback: "..." },
    functionality:    { score: 88, feedback: "..." },
    requirementMatch: { score: 84, feedback: "..." }
  }
}`,
      },
      {
        step: 6,
        title: 'Dispute Window',
        icon: Scale,
        color: 'orange',
        content: `After the AI evaluation, both parties have a 72-hour window to dispute the decision. If either party disagrees, they can file a formal dispute with evidence.`,
        detail: `If no dispute is filed within 72 hours, the AI decision becomes final. If a dispute is filed, a verified human judge is assigned to review the case. Full dispute process is covered in the Disputes section.`,
        code: null,
      },
      {
        step: 7,
        title: 'Payment Release',
        icon: DollarSign,
        color: 'emerald',
        content: `Upon approval (either by AI or judge), the smart contract automatically releases the milestone payment to the freelancer. No manual action needed — it's trustless and instant.`,
        detail: `The payment includes the milestone amount minus the 2.5% platform fee. For disputed cases resolved in the freelancer's favor, a judge reward (2.5% of milestone) is deducted from the platform fee. See Economics for details.`,
        code: `// Automatic payment release
// Smart contract emits:
event PaymentReleased(
  contractId,
  milestoneId,
  freelancerAddress,
  amount: 731.25,   // 750 - 2.5% fee
  timestamp
);`,
      },
    ].map((step, i) => (
      <div key={i} className="mb-12 last:mb-0">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-10 h-10 rounded-xl bg-${step.color}-100 text-${step.color}-600 flex items-center justify-center font-extrabold text-sm`}>
            {step.step}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">{step.title}</h2>
        </div>
        <p className="text-slate-600 mb-3 leading-relaxed">{step.content}</p>
        <p className="text-slate-500 mb-3 leading-relaxed text-sm">{step.detail}</p>
        {step.code && <CodeBlock code={step.code} />}
      </div>
    ))}

    <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <h3 className="font-bold text-blue-900 mb-2">What's Next?</h3>
      <p className="text-blue-700 text-sm">
        Dive deeper into the technical details: <SectionLink to="/documentation/architecture">Architecture</SectionLink>,{' '}
        <SectionLink to="/documentation/smart-contracts">Smart Contracts</SectionLink>, or{' '}
        <SectionLink to="/documentation/ai-evaluation">AI Evaluation</SectionLink>.
      </p>
    </div>
  </div>
);

const ArchitectureSection = () => (
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
      System{' '}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Architecture
      </span>
    </h1>
    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
      InternPay's architecture is built on four pillars: a modern React frontend, Solidity smart contracts,
      an AI evaluation engine, and a decentralized judge network.
    </p>

    <TableOfContents items={['High-Level Overview', 'Frontend (React)', 'Smart Contracts (Solidity)', 'AI Evaluation Engine', 'Judge Network', 'Data Flow']} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">High-Level Overview</h2>
    <CodeBlock code={`┌─────────────────────────────────────────────────────────────┐
│                     InternPay Platform                       │
├──────────────┬──────────────┬────────────┬──────────────────┤
│   Frontend   │    Smart     │     AI     │     Judge        │
│   (React)    │  Contracts   │   Engine   │    Network       │
│              │  (Solidity)  │            │                  │
│  • Dashboard │  • Escrow    │  • Code    │  • Assignment    │
│  • Profiles  │  • Payment   │  • Design  │  • Review UI     │
│  • Forms     │  • Dispute   │  • UX/UI   │  • Voting        │
│  • Reports   │  • States    │  • Match   │  • Reputation    │
├──────────────┼──────────────┼────────────┼──────────────────┤
│        ethers.js / wagmi    │  REST API  │    On-chain      │
│        (Web3 Provider)      │            │   Transactions   │
├─────────────────────────────┴────────────┴──────────────────┤
│              Ethereum / Polygon Network                      │
└─────────────────────────────────────────────────────────────┘`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Frontend (React)</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      The frontend is a single-page React application built with modern tooling. It provides role-specific
      dashboards for companies, freelancers, and judges.
    </p>
    <div className="grid md:grid-cols-2 gap-4 my-6">
      {[
        { title: 'React 18', desc: 'Latest React with hooks and concurrent features' },
        { title: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid UI development' },
        { title: 'Framer Motion', desc: 'Production-ready animations and transitions' },
        { title: 'React Router v6', desc: 'Client-side routing with nested layouts' },
        { title: 'ethers.js', desc: 'Ethereum wallet connection and contract interaction' },
        { title: 'Vite', desc: 'Lightning-fast build tool and dev server' },
      ].map((item, i) => (
        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
          <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
        </div>
      ))}
    </div>
    <CodeBlock code={`src/
├── pages/
│   ├── public/        # Landing, docs, how-it-works
│   ├── auth/          # Login, register, wallet connection
│   ├── company/       # Company dashboard, contracts, submissions
│   ├── student/       # Freelancer dashboard, work submission
│   └── judge/         # Judge dashboard, dispute review
├── components/
│   └── layout/        # Navbar, footer, sidebar
├── layouts/           # MainLayout, DashboardLayout
├── routes/            # AppRoutes.jsx
└── data/              # Mock data for development`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Smart Contracts (Solidity)</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      The smart contract layer handles escrow, payments, and dispute states. All contracts are deployed on
      Ethereum/Polygon and written in Solidity 0.8+. For a deep dive, see{' '}
      <SectionLink to="/documentation/smart-contracts">Smart Contracts</SectionLink>.
    </p>
    <CodeBlock code={`// Core contract structure
contracts/
├── InternPayEscrow.sol      # Main escrow logic
├── PaymentRelease.sol        # Automated payment handler
├── DisputeManager.sol        # Dispute state management
├── JudgeRegistry.sol         # Judge registration & reputation
└── interfaces/
    ├── IEscrow.sol
    └── IDisputeManager.sol`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">AI Evaluation Engine</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      The AI engine is the core innovation of InternPay. It provides impartial, automated evaluation of submitted
      work across multiple quality dimensions. See <SectionLink to="/documentation/ai-evaluation">AI Evaluation</SectionLink> for full details.
    </p>
    <div className="bg-slate-900 rounded-2xl p-6 my-6">
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Code Quality', score: '0-100', icon: Code2 },
          { label: 'Design Quality', score: '0-100', icon: Eye },
          { label: 'Functionality', score: '0-100', icon: Zap },
          { label: 'Req. Match', score: '0-100', icon: Target },
        ].map((dim, i) => (
          <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <dim.icon size={20} className="text-blue-400 mx-auto mb-2" />
            <div className="text-white font-bold text-sm">{dim.label}</div>
            <div className="text-slate-400 text-xs mt-1">{dim.score}</div>
          </div>
        ))}
      </div>
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Judge Network</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      When disputes arise, the judge network provides human review. Judges are vetted technical professionals
      who earn rewards for accurate, timely decisions. Their reputation is tracked on-chain.
    </p>
    <ul className="space-y-2 mb-6">
      {[
        'Random judge assignment prevents collusion',
        'Judges review AI reports, submitted work, and evidence',
        'Decisions are binding and executed on-chain',
        'Reputation score affects future case assignments',
        'Judge rewards come from the platform fee pool',
      ].map((item, i) => (
        <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
          <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
          {item}
        </li>
      ))}
    </ul>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Data Flow</h2>
    <CodeBlock code={`1. Company → Creates Contract → On-chain (CREATED)
2. Company → Funds Escrow   → On-chain (FUNDED)
3. Freelancer → Submits Work → Off-chain + hash on-chain
4. AI Engine → Evaluates     → Off-chain report, hash on-chain
5. 72h Window → No dispute?  → Auto-release (on-chain)
6. Dispute?   → Judge Review  → Decision on-chain
7. Payment    → Release/Refund → USDC transfer (on-chain)`} />
  </div>
);

const SmartContractsSection = () => (
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
      Smart{' '}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Contracts
      </span>
    </h1>
    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
      Deep dive into InternPay's Solidity smart contracts — escrow logic, payment release mechanics,
      dispute handling, and the contract state machine.
    </p>

    <TableOfContents items={['Contract Overview', 'Escrow Contract', 'Contract States', 'Payment Release', 'Dispute Handling', 'Events & Modifiers']} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Contract Overview</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      InternPay uses a set of interconnected smart contracts deployed on Ethereum/Polygon. The core contract
      is <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm text-slate-800">InternPayEscrow.sol</code> which
      manages the full lifecycle of a freelance contract.
    </p>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Escrow Contract</h2>
    <CodeBlock code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract InternPayEscrow is ReentrancyGuard, AccessControl {
    
    IERC20 public immutable paymentToken;  // USDC
    
    enum ContractState {
        CREATED,
        FUNDED,
        IN_PROGRESS,
        SUBMITTED,
        EVALUATED,
        DISPUTE_OPEN,
        COMPLETED,
        CANCELLED,
        REFUNDED
    }
    
    struct Milestone {
        string title;
        uint256 amount;
        uint256 deadline;
        MilestoneState state;
    }
    
    struct EscrowContract {
        address company;
        address freelancer;
        uint256 totalAmount;
        uint256 fundedAmount;
        uint256 releasedAmount;
        ContractState state;
        Milestone[] milestones;
        uint256 createdAt;
    }
    
    mapping(uint256 => EscrowContract) public contracts;
    uint256 public contractCount;
    
    uint256 public constant PLATFORM_FEE_BPS = 250; // 2.5%
    uint256 public constant DISPUTE_WINDOW = 72 hours;
    
    // ... constructor and functions below
}`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Contract States</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      Each contract follows a strict state machine pattern. Transitions are enforced by modifiers to prevent
      invalid operations.
    </p>
    <CodeBlock code={`State Machine:

CREATED ──fund()──→ FUNDED ──startWork()──→ IN_PROGRESS
                                                │
                                          submitWork()
                                                │
                                                ▼
                                           SUBMITTED
                                                │
                                          evaluate()
                                                │
                                                ▼
                                           EVALUATED
                                           ╱        ╲
                                   (no dispute)   fileDispute()
                                          │           │
                                          ▼           ▼
                                     COMPLETED   DISPUTE_OPEN
                                                      │
                                               resolveDispute()
                                                ╱          ╲
                                               ▼            ▼
                                          COMPLETED    REFUNDED

Special transitions:
  ANY ──cancel()──→ CANCELLED (only if CREATED/FUNDED, by company)
  FUNDED ──refund()──→ REFUNDED (after deadline expiry)`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Payment Release</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      Payment release is triggered automatically when conditions are met. The contract calculates the platform
      fee and transfers the net amount to the freelancer.
    </p>
    <CodeBlock code={`function releaseMilestonePayment(
    uint256 _contractId,
    uint256 _milestoneIndex
) external nonReentrant {
    EscrowContract storage c = contracts[_contractId];
    Milestone storage m = c.milestones[_milestoneIndex];
    
    require(c.state == ContractState.EVALUATED, "Invalid state");
    require(m.state == MilestoneState.APPROVED, "Not approved");
    require(
        block.timestamp > m.evaluatedAt + DISPUTE_WINDOW,
        "Dispute window active"
    );
    
    uint256 fee = (m.amount * PLATFORM_FEE_BPS) / 10000;
    uint256 payout = m.amount - fee;
    
    c.releasedAmount += m.amount;
    m.state = MilestoneState.PAID;
    
    paymentToken.transfer(c.freelancer, payout);
    paymentToken.transfer(treasury, fee);
    
    emit PaymentReleased(_contractId, _milestoneIndex, payout);
}`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Dispute Handling</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      Disputes are managed by the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">DisputeManager.sol</code> contract.
      For the full dispute flow, see <SectionLink to="/documentation/disputes">Disputes</SectionLink>.
    </p>
    <CodeBlock code={`function fileDispute(
    uint256 _contractId,
    string calldata _reason,
    bytes32 _evidenceHash
) external {
    EscrowContract storage c = contracts[_contractId];
    
    require(
        msg.sender == c.company || msg.sender == c.freelancer,
        "Not authorized"
    );
    require(c.state == ContractState.EVALUATED, "Invalid state");
    require(
        block.timestamp <= c.evaluatedAt + DISPUTE_WINDOW,
        "Window expired"
    );
    
    c.state = ContractState.DISPUTE_OPEN;
    
    disputeManager.createDispute(
        _contractId,
        msg.sender,
        _reason,
        _evidenceHash
    );
    
    emit DisputeFiled(_contractId, msg.sender, _reason);
}`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Events & Modifiers</h2>
    <CodeBlock code={`// Key Events
event ContractCreated(uint256 indexed contractId, address company, address freelancer);
event ContractFunded(uint256 indexed contractId, uint256 amount);
event WorkSubmitted(uint256 indexed contractId, uint256 milestoneIndex, bytes32 hash);
event EvaluationCompleted(uint256 indexed contractId, uint256 score, string recommendation);
event DisputeFiled(uint256 indexed contractId, address filedBy, string reason);
event DisputeResolved(uint256 indexed contractId, string decision, address judge);
event PaymentReleased(uint256 indexed contractId, uint256 milestoneIndex, uint256 amount);

// Key Modifiers
modifier onlyParty(uint256 _contractId) {
    require(
        msg.sender == contracts[_contractId].company ||
        msg.sender == contracts[_contractId].freelancer,
        "Not authorized"
    );
    _;
}

modifier inState(uint256 _contractId, ContractState _state) {
    require(contracts[_contractId].state == _state, "Invalid state");
    _;
}`} />

    <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <h3 className="font-bold text-blue-900 mb-2">Related Sections</h3>
      <p className="text-blue-700 text-sm">
        <SectionLink to="/documentation/security">Security</SectionLink> — audit info and security patterns •{' '}
        <SectionLink to="/documentation/economics">Economics</SectionLink> — fee calculations and payment flow •{' '}
        <Link to="/api-docs" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">API Reference</Link>
      </p>
    </div>
  </div>
);

const AiEvaluationSection = () => (
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
      AI{' '}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Evaluation
      </span>
    </h1>
    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
      InternPay's AI evaluation engine provides impartial, automated assessment of submitted work across
      4 key dimensions. Here's how it works.
    </p>

    <TableOfContents items={['How AI Evaluates Work', 'The 4 Dimensions', 'Scoring Methodology', 'Recommendations', 'Transparency & Fairness']} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">How AI Evaluates Work</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      When a freelancer submits work, the AI evaluation pipeline is triggered automatically. The engine
      analyzes all submitted materials — source code, design files, live demos — against the original
      contract requirements.
    </p>
    <CodeBlock code={`Evaluation Pipeline:

1. Submission Received
   ↓
2. Material Ingestion
   • Clone GitHub repository
   • Capture PenTool design snapshots
   • Load and test demo URL
   ↓
3. Requirement Parsing
   • Extract acceptance criteria from contract
   • Build evaluation rubric
   ↓
4. Multi-Dimensional Analysis
   • Code Quality Analysis (AST parsing, linting, patterns)
   • Design Quality Analysis (visual comparison, UX heuristics)
   • Functionality Testing (endpoint testing, feature verification)
   • Requirement Matching (criteria-by-criteria comparison)
   ↓
5. Score Aggregation & Report Generation
   ↓
6. Recommendation Output (APPROVE / REVISE / REJECT)`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">The 4 Dimensions</h2>
    <div className="space-y-6 my-6">
      {[
        {
          title: 'Code Quality',
          score: '0–100',
          icon: Code2,
          color: 'emerald',
          criteria: [
            'Code organization and file structure',
            'Naming conventions and readability',
            'Error handling and edge cases',
            'Performance optimizations',
            'Security best practices',
            'Type safety and documentation',
          ],
          example: 'AST analysis detects unused variables, circular dependencies, and missing error boundaries. Lint rules check for common vulnerabilities.',
        },
        {
          title: 'Design Quality',
          score: '0–100',
          icon: Eye,
          color: 'blue',
          criteria: [
            'Visual consistency and spacing',
            'Responsive design across breakpoints',
            'Accessibility (WCAG compliance)',
            'Color contrast and typography',
            'Interactive states (hover, focus, active)',
            'Loading and error states',
          ],
          example: 'Automated screenshots at 320px, 768px, 1024px, and 1440px widths are compared against design specs for pixel-level accuracy.',
        },
        {
          title: 'Functionality',
          score: '0–100',
          icon: Zap,
          color: 'indigo',
          criteria: [
            'Feature completeness (all required features working)',
            'Data flow correctness',
            'Navigation and routing',
            'Form validation and submission',
            'API integration (if applicable)',
            'Edge case handling',
          ],
          example: 'Automated testing visits each required page, interacts with forms, and verifies expected behavior matches the contract spec.',
        },
        {
          title: 'Requirement Match',
          score: '0–100',
          icon: Target,
          color: 'purple',
          criteria: [
            'Each requirement matched individually',
            'Technology stack compliance',
            'Test coverage thresholds',
            'Documentation completeness',
            'Deployment requirements',
            'Additional specifications',
          ],
          example: 'Each requirement in the contract is evaluated as met/partially met/not met and weighted by importance.',
        },
      ].map((dim, i) => (
        <div key={i} className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 bg-${dim.color}-100 text-${dim.color}-600 rounded-xl flex items-center justify-center`}>
              <dim.icon size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">{dim.title}</h3>
              <span className="text-xs text-slate-400">Score Range: {dim.score}</span>
            </div>
          </div>
          <ul className="grid md:grid-cols-2 gap-2 mb-4">
            {dim.criteria.map((c, j) => (
              <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 size={14} className={`text-${dim.color}-500 shrink-0`} />
                {c}
              </li>
            ))}
          </ul>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-xs text-slate-500 italic">{dim.example}</p>
          </div>
        </div>
      ))}
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Scoring Methodology</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      The overall score is a weighted average of the 4 dimensions. Weights can be customized per contract
      but default to equal weighting.
    </p>
    <CodeBlock code={`// Default scoring weights
const weights = {
  codeQuality:      0.30,  // 30%
  designQuality:    0.25,  // 25%
  functionality:    0.25,  // 25%
  requirementMatch: 0.20,  // 20%
};

// Overall score calculation
overallScore = (
  codeQuality      * weights.codeQuality +
  designQuality    * weights.designQuality +
  functionality    * weights.functionality +
  requirementMatch * weights.requirementMatch
);

// Example: (92 * 0.30) + (85 * 0.25) + (88 * 0.25) + (84 * 0.20)
//        = 27.6 + 21.25 + 22.0 + 16.8
//        = 87.65 → rounded to 87`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Recommendations</h2>
    <div className="grid md:grid-cols-3 gap-4 my-6">
      <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
        <div className="text-2xl font-extrabold text-emerald-700 mb-1">APPROVE</div>
        <div className="text-sm font-bold text-emerald-600 mb-2">Score ≥ 70</div>
        <p className="text-xs text-emerald-700">Work meets requirements. Payment is released after the 72-hour dispute window.</p>
      </div>
      <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
        <div className="text-2xl font-extrabold text-amber-700 mb-1">REVISE</div>
        <div className="text-sm font-bold text-amber-600 mb-2">Score 40–69</div>
        <p className="text-xs text-amber-700">Work partially meets requirements. Freelancer is given specific feedback and can resubmit.</p>
      </div>
      <div className="bg-red-50 p-5 rounded-2xl border border-red-200">
        <div className="text-2xl font-extrabold text-red-700 mb-1">REJECT</div>
        <div className="text-sm font-bold text-red-600 mb-2">Score &lt; 40</div>
        <p className="text-xs text-red-700">Work does not meet requirements. Funds remain in escrow. Either party can dispute the decision.</p>
      </div>
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Transparency & Fairness</h2>
    <ul className="space-y-3 mb-6">
      {[
        'All evaluation reports are fully visible to both parties — no black boxes.',
        'The AI provides human-readable reasoning for every score and recommendation.',
        'Evaluation criteria are derived directly from the contract requirements — not arbitrary standards.',
        'Either party can dispute an AI decision within 72 hours and request human review.',
        'AI model versions are tracked so evaluations can be audited and reproduced.',
      ].map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-600">
          <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>

    <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <h3 className="font-bold text-blue-900 mb-2">Related Sections</h3>
      <p className="text-blue-700 text-sm">
        <SectionLink to="/documentation/disputes">Disputes</SectionLink> — what happens when you disagree with AI •{' '}
        <SectionLink to="/documentation/how-it-works">How It Works</SectionLink> — the full workflow •{' '}
        <Link to="/api-docs" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">API Reference</Link>
      </p>
    </div>
  </div>
);

const DisputesSection = () => (
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
      Dispute{' '}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Resolution
      </span>
    </h1>
    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
      When either party disagrees with an AI evaluation, InternPay's dispute system provides fair,
      human-backed resolution. Here's how it works.
    </p>

    <TableOfContents items={['Dispute Flow', 'Filing a Dispute', 'Evidence Submission', 'Judge Review Process', 'Decision Types', 'Timeline & Deadlines']} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Dispute Flow</h2>
    <CodeBlock code={`Dispute Lifecycle:

1. AI Evaluation Published
   ↓
2. 72-Hour Dispute Window Opens
   ↓
3. Party Files Dispute + Submits Evidence
   ↓
4. Judge Assigned (random selection from qualified pool)
   ↓
5. Judge Reviews:
   • AI evaluation report
   • Submitted work (code, designs, demo)
   • Contract requirements
   • Dispute evidence from both parties
   ↓
6. Judge Makes Decision
   ↓
7. Decision Executed On-Chain
   • RELEASE_PAYMENT → Freelancer gets paid
   • REFUND          → Funds returned to company
   • SPLIT           → Partial payment to both parties
   ↓
8. Judge Receives Reward + Reputation Update`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Filing a Dispute</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      Either the company or freelancer can file a dispute within 72 hours of the AI evaluation being published.
      The dispute must include a reason and supporting evidence.
    </p>
    <div className="grid md:grid-cols-2 gap-4 my-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="font-bold text-slate-900 mb-3">Company Disputes (examples)</h4>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> AI approved work that doesn't meet requirements</li>
          <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Plagiarized or template-based submission</li>
          <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Demo link doesn't match submitted code</li>
          <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Critical bugs or security vulnerabilities</li>
        </ul>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="font-bold text-slate-900 mb-3">Freelancer Disputes (examples)</h4>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> AI rejected work that clearly meets requirements</li>
          <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Evaluation didn't consider submitted materials</li>
          <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Score doesn't reflect actual quality</li>
          <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Requirements were ambiguous or changed</li>
        </ul>
      </div>
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Evidence Submission</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      Both parties can submit evidence to support their case. Evidence is hashed on-chain for integrity.
    </p>
    <CodeBlock code={`// Evidence types supported
{
  evidence: [
    {
      type: "screenshot",
      url: "https://storage.internpay.dev/evidence/proof.png",
      description: "Screenshot showing correct implementation"
    },
    {
      type: "video",
      url: "https://storage.internpay.dev/evidence/demo.mp4",
      description: "Video walkthrough of all features"
    },
    {
      type: "document",
      url: "https://storage.internpay.dev/evidence/analysis.pdf",
      description: "Detailed analysis of requirement compliance"
    },
    {
      type: "code_diff",
      url: "https://github.com/user/repo/compare/main...feature",
      description: "Code diff showing implementation details"
    }
  ]
}`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Judge Review Process</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      Once a dispute is filed, a qualified judge is randomly assigned from the judge pool. The judge has
      7 days to review the case and make a binding decision.
    </p>
    <div className="space-y-3 my-6">
      {[
        { step: 1, title: 'Case Assignment', desc: 'Judge is randomly selected from verified judges with relevant expertise.' },
        { step: 2, title: 'Material Review', desc: 'Judge reviews the AI report, submitted work, contract requirements, and evidence.' },
        { step: 3, title: 'Testing', desc: 'Judge tests the submitted code/design against requirements independently.' },
        { step: 4, title: 'Decision', desc: 'Judge submits a reasoned decision with optional re-scoring of the 4 dimensions.' },
        { step: 5, title: 'Execution', desc: 'Decision is executed on-chain — payment released, refunded, or split.' },
      ].map((item) => (
        <div key={item.step} className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
            {item.step}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
            <p className="text-sm text-slate-600">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Decision Types</h2>
    <div className="grid md:grid-cols-3 gap-4 my-6">
      <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
        <DollarSign size={20} className="text-emerald-600 mb-2" />
        <div className="font-bold text-emerald-900 mb-1">Release Payment</div>
        <p className="text-xs text-emerald-700">Full milestone payment released to the freelancer. Work meets requirements.</p>
      </div>
      <div className="bg-red-50 p-5 rounded-2xl border border-red-200">
        <ArrowLeft size={20} className="text-red-600 mb-2" />
        <div className="font-bold text-red-900 mb-1">Refund</div>
        <p className="text-xs text-red-700">Full milestone amount refunded to the company. Work doesn't meet requirements.</p>
      </div>
      <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
        <PieChart size={20} className="text-amber-600 mb-2" />
        <div className="font-bold text-amber-900 mb-1">Split</div>
        <p className="text-xs text-amber-700">Partial payment to both parties based on the judge's assessment of work completion.</p>
      </div>
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Timeline & Deadlines</h2>
    <div className="bg-slate-900 rounded-2xl p-6 my-6">
      <div className="space-y-4">
        {[
          { time: 'T+0', event: 'AI Evaluation Published', color: 'blue' },
          { time: 'T+72h', event: 'Dispute Window Closes (auto-release if no dispute)', color: 'indigo' },
          { time: 'T+72h', event: 'Dispute Filed → Judge Assigned within 24h', color: 'purple' },
          { time: 'T+7d', event: 'Judge Decision Deadline', color: 'orange' },
          { time: 'T+7d', event: 'Decision Executed On-Chain (immediate)', color: 'emerald' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`text-${item.color}-400 text-xs font-mono font-bold w-16 shrink-0`}>{item.time}</div>
            <div className={`w-3 h-3 bg-${item.color}-500 rounded-full shrink-0`} />
            <div className="text-slate-300 text-sm">{item.event}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <h3 className="font-bold text-blue-900 mb-2">Related Sections</h3>
      <p className="text-blue-700 text-sm">
        <SectionLink to="/documentation/ai-evaluation">AI Evaluation</SectionLink> — what generates the initial decision •{' '}
        <SectionLink to="/documentation/economics">Economics</SectionLink> — judge rewards and fee structure •{' '}
        <SectionLink to="/documentation/smart-contracts">Smart Contracts</SectionLink> — on-chain dispute handling
      </p>
    </div>
  </div>
);

const SecuritySection = () => (
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
      Security &{' '}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Audits
      </span>
    </h1>
    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
      Security is foundational to InternPay. Our smart contracts and application follow industry-leading
      security practices with multiple audit layers.
    </p>

    <TableOfContents items={['Smart Contract Security', 'Application Security', 'Audit Information', 'Bug Bounty Program', 'Best Practices']} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Smart Contract Security</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      Our Solidity contracts implement industry-standard security patterns to protect user funds.
    </p>
    <div className="grid md:grid-cols-2 gap-4 my-6">
      {[
        { icon: Shield, title: 'Reentrancy Guards', desc: 'OpenZeppelin ReentrancyGuard on all fund-transferring functions prevents reentrancy attacks.' },
        { icon: Lock, title: 'Access Control', desc: 'Role-based access via OpenZeppelin AccessControl. Only authorized addresses can execute sensitive functions.' },
        { icon: Clock, title: 'Timelock Mechanisms', desc: '72-hour dispute window and multi-sig admin operations prevent hasty irreversible actions.' },
        { icon: Bug, title: 'Overflow Protection', desc: 'Solidity 0.8+ built-in overflow/underflow protection. All arithmetic operations are safe by default.' },
        { icon: Eye, title: 'Immutable State', desc: 'Critical parameters (payment token, fee rates) are immutable after deployment. No admin backdoors.' },
        { icon: FileSearch, title: 'Event Logging', desc: 'Comprehensive event emission for all state changes enables full auditability and off-chain monitoring.' },
      ].map((item, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <item.icon size={20} className="text-blue-600 mb-2" />
          <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
          <p className="text-xs text-slate-600">{item.desc}</p>
        </div>
      ))}
    </div>
    <CodeBlock code={`// Security patterns used in InternPayEscrow.sol

// 1. Checks-Effects-Interactions Pattern
function releasePayout(uint256 contractId) external nonReentrant {
    // CHECKS
    require(contracts[contractId].state == State.APPROVED, "Invalid state");
    require(msg.sender == authorized, "Unauthorized");
    
    // EFFECTS (state changes BEFORE external calls)
    contracts[contractId].state = State.PAID;
    contracts[contractId].releasedAmount += amount;
    
    // INTERACTIONS (external calls LAST)
    paymentToken.transfer(freelancer, payout);
}

// 2. Access Control
bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

modifier onlyJudge() {
    require(hasRole(JUDGE_ROLE, msg.sender), "Not a judge");
    _;
}

// 3. Pausable (emergency circuit breaker)
function pause() external onlyRole(ADMIN_ROLE) {
    _pause();
}`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Application Security</h2>
    <ul className="space-y-3 mb-6">
      {[
        'Wallet-based authentication — no passwords to leak. Sign messages with your private key.',
        'All API communications encrypted with TLS 1.3.',
        'Input validation and sanitization on all user-facing forms.',
        'Rate limiting on all API endpoints (100 req/min, 1000 req/hr).',
        'Content Security Policy (CSP) headers prevent XSS attacks.',
        'CORS whitelist restricts API access to authorized origins.',
        'Evidence files stored with integrity hashes — tampering is detectable.',
      ].map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-600">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Audit Information</h2>
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left p-4 font-bold text-slate-900">Audit Firm</th>
            <th className="text-left p-4 font-bold text-slate-900">Scope</th>
            <th className="text-left p-4 font-bold text-slate-900">Date</th>
            <th className="text-left p-4 font-bold text-slate-900">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <td className="p-4 text-slate-700 font-medium">CertiK</td>
            <td className="p-4 text-slate-600">InternPayEscrow.sol, PaymentRelease.sol</td>
            <td className="p-4 text-slate-600">June 2026</td>
            <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">Passed</span></td>
          </tr>
          <tr className="border-b border-slate-100">
            <td className="p-4 text-slate-700 font-medium">OpenZeppelin</td>
            <td className="p-4 text-slate-600">DisputeManager.sol, JudgeRegistry.sol</td>
            <td className="p-4 text-slate-600">May 2026</td>
            <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">Passed</span></td>
          </tr>
          <tr>
            <td className="p-4 text-slate-700 font-medium">Trail of Bits</td>
            <td className="p-4 text-slate-600">Full platform security review</td>
            <td className="p-4 text-slate-600">July 2026</td>
            <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">In Progress</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Bug Bounty Program</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      InternPay runs an active bug bounty program. We reward security researchers who responsibly disclose
      vulnerabilities.
    </p>
    <div className="grid md:grid-cols-4 gap-4 my-6">
      {[
        { severity: 'Critical', reward: '$10,000', color: 'red' },
        { severity: 'High', reward: '$5,000', color: 'orange' },
        { severity: 'Medium', reward: '$2,000', color: 'amber' },
        { severity: 'Low', reward: '$500', color: 'blue' },
      ].map((item, i) => (
        <div key={i} className={`bg-${item.color}-50 p-4 rounded-2xl border border-${item.color}-200 text-center`}>
          <div className={`text-${item.color}-700 font-bold text-sm`}>{item.severity}</div>
          <div className={`text-xl font-extrabold text-${item.color}-800 mt-1`}>{item.reward}</div>
        </div>
      ))}
    </div>

    <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <h3 className="font-bold text-blue-900 mb-2">Related Sections</h3>
      <p className="text-blue-700 text-sm">
        <SectionLink to="/documentation/smart-contracts">Smart Contracts</SectionLink> — contract source code and patterns •{' '}
        <SectionLink to="/documentation/deployment">Deployment</SectionLink> — secure deployment procedures
      </p>
    </div>
  </div>
);

const DeploymentSection = () => (
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
      Deployment{' '}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Guide
      </span>
    </h1>
    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
      Technical deployment guide for setting up InternPay — from local development to production infrastructure.
    </p>

    <TableOfContents items={['Prerequisites', 'Local Development', 'Smart Contract Deployment', 'Frontend Deployment', 'Environment Variables', 'Supported Chains']} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Prerequisites</h2>
    <CodeBlock code={`# Required tools
Node.js     >= 18.0.0
npm         >= 9.0.0
Hardhat     >= 2.19.0
MetaMask    (browser extension)
Git         >= 2.40.0

# Optional
Docker      >= 24.0.0
Foundry     (for advanced contract testing)`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Local Development</h2>
    <CodeBlock code={`# 1. Clone the repository
git clone https://github.com/internpay/internpay-platform.git
cd internpay-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Start local blockchain (Hardhat node)
npx hardhat node

# 5. Deploy contracts to local network
npx hardhat run scripts/deploy.js --network localhost

# 6. Start the frontend development server
cd frontend
npm install
npm run dev

# App available at http://localhost:5173`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Smart Contract Deployment</h2>
    <CodeBlock code={`// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy USDC mock (testnet only)
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.deployed();
  console.log("MockUSDC deployed to:", usdc.address);

  // Deploy JudgeRegistry
  const JudgeRegistry = await ethers.getContractFactory("JudgeRegistry");
  const judgeRegistry = await JudgeRegistry.deploy();
  await judgeRegistry.deployed();

  // Deploy DisputeManager
  const DisputeManager = await ethers.getContractFactory("DisputeManager");
  const disputeManager = await DisputeManager.deploy(judgeRegistry.address);
  await disputeManager.deployed();

  // Deploy main Escrow contract
  const InternPayEscrow = await ethers.getContractFactory("InternPayEscrow");
  const escrow = await InternPayEscrow.deploy(
    usdc.address,
    disputeManager.address,
    deployer.address  // treasury
  );
  await escrow.deployed();
  console.log("InternPayEscrow deployed to:", escrow.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Frontend Deployment</h2>
    <CodeBlock code={`# Build for production
cd frontend
npm run build

# Deploy to Vercel (recommended)
npx vercel --prod

# Or deploy to Netlify
npx netlify deploy --prod --dir=dist

# Or serve with Docker
docker build -t internpay-frontend .
docker run -p 3000:3000 internpay-frontend`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Environment Variables</h2>
    <CodeBlock code={`# .env file
# ──────────────────────────────────────────────
# Blockchain
VITE_CHAIN_ID=137                           # Polygon mainnet
VITE_RPC_URL=https://polygon-rpc.com
VITE_ESCROW_CONTRACT=0x1234...5678
VITE_USDC_CONTRACT=0xabcd...ef01

# API
VITE_API_URL=https://api.internpay.dev/v1
VITE_WS_URL=wss://ws.internpay.dev

# AI Engine
AI_ENGINE_URL=https://ai.internpay.dev
AI_ENGINE_API_KEY=sk-ipe-xxxxx

# Storage
EVIDENCE_STORAGE_URL=https://storage.internpay.dev
EVIDENCE_STORAGE_KEY=sk-stor-xxxxx

# Analytics (optional)
VITE_ANALYTICS_ID=G-XXXXXXXXXX`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Supported Chains</h2>
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left p-4 font-bold text-slate-900">Chain</th>
            <th className="text-left p-4 font-bold text-slate-900">Chain ID</th>
            <th className="text-left p-4 font-bold text-slate-900">Status</th>
            <th className="text-left p-4 font-bold text-slate-900">Gas Token</th>
          </tr>
        </thead>
        <tbody>
          {[
            { chain: 'Polygon', id: '137', status: 'Live', token: 'MATIC', live: true },
            { chain: 'Ethereum', id: '1', status: 'Live', token: 'ETH', live: true },
            { chain: 'Arbitrum', id: '42161', status: 'Beta', token: 'ETH', live: false },
            { chain: 'Base', id: '8453', status: 'Planned', token: 'ETH', live: false },
            { chain: 'Mumbai (Testnet)', id: '80001', status: 'Live', token: 'MATIC', live: true },
          ].map((item, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0">
              <td className="p-4 text-slate-700 font-medium">{item.chain}</td>
              <td className="p-4 text-slate-600 font-mono text-xs">{item.id}</td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                  item.live ? 'bg-emerald-100 text-emerald-700' : item.status === 'Beta' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                }`}>{item.status}</span>
              </td>
              <td className="p-4 text-slate-600">{item.token}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <h3 className="font-bold text-blue-900 mb-2">Related Sections</h3>
      <p className="text-blue-700 text-sm">
        <SectionLink to="/documentation/architecture">Architecture</SectionLink> — system design overview •{' '}
        <SectionLink to="/documentation/security">Security</SectionLink> — deployment security best practices •{' '}
        <Link to="/api-docs" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">API Reference</Link>
      </p>
    </div>
  </div>
);

const EconomicsSection = () => (
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
      Platform{' '}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Economics
      </span>
    </h1>
    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
      InternPay's economic model is simple and transparent — a flat 2.5% platform fee with clear
      payment flows and judge reward mechanics.
    </p>

    <TableOfContents items={['Fee Structure', 'Payment Flow', 'Fee Calculation Examples', 'Judge Rewards', 'Revenue Distribution', 'Comparison']} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Fee Structure</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      InternPay charges a flat <strong>2.5% platform fee</strong> on every released payment. This fee is
      deducted from the milestone amount at the time of payment release.
    </p>
    <div className="grid md:grid-cols-3 gap-4 my-6">
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 text-center">
        <div className="text-4xl font-extrabold text-blue-700">2.5%</div>
        <div className="text-sm font-bold text-blue-600 mt-1">Platform Fee</div>
        <p className="text-xs text-blue-600 mt-2">Deducted from each milestone payment</p>
      </div>
      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center">
        <div className="text-4xl font-extrabold text-emerald-700">97.5%</div>
        <div className="text-sm font-bold text-emerald-600 mt-1">Freelancer Payout</div>
        <p className="text-xs text-emerald-600 mt-2">Net amount received by the freelancer</p>
      </div>
      <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200 text-center">
        <div className="text-4xl font-extrabold text-purple-700">0%</div>
        <div className="text-sm font-bold text-purple-600 mt-1">Company Fee</div>
        <p className="text-xs text-purple-600 mt-2">Companies pay zero additional fees</p>
      </div>
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Payment Flow</h2>
    <CodeBlock code={`Payment Flow (No Dispute):

Company funds escrow:        $1,500.00 USDC
                                  │
                            Milestone 1: $750
                                  │
                          AI Approves (score ≥ 70)
                                  │
                       72h window (no dispute)
                                  │
                          ┌───────┴────────┐
                          │                │
                    Platform Fee      Freelancer
                   $18.75 (2.5%)    $731.25 (97.5%)


Payment Flow (With Dispute):

                          AI Evaluates
                                │
                       Dispute Filed by Party
                                │
                         Judge Assigned
                                │
                     Judge Decision: RELEASE
                                │
                    ┌───────────┼──────────┐
                    │           │          │
              Platform Fee   Judge     Freelancer
             $7.50 (1.0%)   Reward    $731.25 (97.5%)
                          $11.25 (1.5%)`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Fee Calculation Examples</h2>
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left p-4 font-bold text-slate-900">Milestone</th>
            <th className="text-right p-4 font-bold text-slate-900">Amount</th>
            <th className="text-right p-4 font-bold text-slate-900">Fee (2.5%)</th>
            <th className="text-right p-4 font-bold text-slate-900">Payout</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'Frontend Implementation', amount: 750 },
            { name: 'Backend Integration', amount: 750 },
            { name: 'Logo Design', amount: 200 },
            { name: 'Full-Stack MVP', amount: 5000 },
            { name: 'Mobile App UI', amount: 1200 },
          ].map((item, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0">
              <td className="p-4 text-slate-700 font-medium">{item.name}</td>
              <td className="p-4 text-slate-600 text-right font-mono">${item.amount.toFixed(2)}</td>
              <td className="p-4 text-red-600 text-right font-mono">-${(item.amount * 0.025).toFixed(2)}</td>
              <td className="p-4 text-emerald-600 text-right font-mono font-bold">${(item.amount * 0.975).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Judge Rewards</h2>
    <p className="text-slate-600 mb-4 leading-relaxed">
      Judges are incentivized to provide timely, fair decisions. Their reward comes from the platform fee
      pool — not from either party's funds.
    </p>
    <CodeBlock code={`Judge Reward Calculation:

Base reward = 1.5% of disputed milestone amount
(Taken from the 2.5% platform fee, not additional)

Example:
  Milestone amount:     $750.00
  Platform fee (2.5%):  $18.75
  Judge reward (1.5%):  $11.25  (from the $18.75 fee)
  Net platform fee:     $7.50   (remaining)
  Freelancer payout:    $731.25 (unchanged)

Reputation Bonuses:
  Top 10% judges:       +20% reward bonus
  Perfect streak (5+):  +10% reward bonus
  Fast resolution (<2d): +5% reward bonus`} />

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Revenue Distribution</h2>
    <div className="bg-slate-900 rounded-2xl p-6 my-6">
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Operations', pct: '40%', desc: 'Platform maintenance and infrastructure' },
          { label: 'Development', pct: '30%', desc: 'AI model training and feature development' },
          { label: 'Judge Pool', pct: '20%', desc: 'Judge rewards and incentive programs' },
          { label: 'Reserve', pct: '10%', desc: 'Security fund and insurance pool' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <div className="text-2xl font-extrabold text-white">{item.pct}</div>
            <div className="text-blue-400 font-bold text-sm mt-1">{item.label}</div>
            <p className="text-slate-400 text-xs mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>

    <h2 className="text-2xl font-extrabold text-slate-900 mb-4 mt-10">Comparison</h2>
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left p-4 font-bold text-slate-900">Platform</th>
            <th className="text-center p-4 font-bold text-slate-900">Fee</th>
            <th className="text-center p-4 font-bold text-slate-900">Escrow</th>
            <th className="text-center p-4 font-bold text-slate-900">AI Review</th>
            <th className="text-center p-4 font-bold text-slate-900">On-Chain</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'InternPay', fee: '2.5%', escrow: true, ai: true, chain: true, highlight: true },
            { name: 'Upwork', fee: '5-20%', escrow: false, ai: false, chain: false },
            { name: 'Fiverr', fee: '20%', escrow: false, ai: false, chain: false },
            { name: 'Toptal', fee: '~30%', escrow: false, ai: false, chain: false },
          ].map((item, i) => (
            <tr key={i} className={`border-b border-slate-100 last:border-0 ${item.highlight ? 'bg-blue-50/50' : ''}`}>
              <td className="p-4 text-slate-700 font-bold">{item.name}</td>
              <td className="p-4 text-center font-mono text-sm">{item.fee}</td>
              <td className="p-4 text-center">{item.escrow ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <span className="text-slate-300">—</span>}</td>
              <td className="p-4 text-center">{item.ai ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <span className="text-slate-300">—</span>}</td>
              <td className="p-4 text-center">{item.chain ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <span className="text-slate-300">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <h3 className="font-bold text-blue-900 mb-2">Related Sections</h3>
      <p className="text-blue-700 text-sm">
        <SectionLink to="/documentation/smart-contracts">Smart Contracts</SectionLink> — on-chain fee deduction logic •{' '}
        <SectionLink to="/documentation/disputes">Disputes</SectionLink> — judge reward scenarios •{' '}
        <SectionLink to="/documentation/how-it-works">How It Works</SectionLink> — full payment lifecycle
      </p>
    </div>
  </div>
);

/* ============================================================
   SECTION MAPPING
   ============================================================ */

const sectionComponents = {
  overview: OverviewSection,
  'how-it-works': HowItWorksSection,
  architecture: ArchitectureSection,
  'smart-contracts': SmartContractsSection,
  'ai-evaluation': AiEvaluationSection,
  disputes: DisputesSection,
  security: SecuritySection,
  deployment: DeploymentSection,
  economics: EconomicsSection,
};

const sectionTitles = {
  overview: 'Overview',
  'how-it-works': 'How It Works',
  architecture: 'Architecture',
  'smart-contracts': 'Smart Contracts',
  'ai-evaluation': 'AI Evaluation',
  disputes: 'Disputes',
  security: 'Security',
  deployment: 'Deployment',
  economics: 'Economics',
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

const DocSection = () => {
  const { section } = useParams();
  const SectionComponent = sectionComponents[section];

  // Find prev/next for navigation
  const currentIndex = sidebarSections.findIndex((s) => s.slug === section);
  const prev = currentIndex > 0 ? sidebarSections[currentIndex - 1] : null;
  const next = currentIndex < sidebarSections.length - 1 ? sidebarSections[currentIndex + 1] : null;

  if (!SectionComponent) {
    return (
      <div className="w-full font-sans">
        <section className="bg-slate-50 min-h-screen py-20">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Section Not Found</h1>
            <p className="text-slate-600 mb-8">
              The documentation section "{section}" doesn't exist.
            </p>
            <Link
              to="/documentation"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back to Documentation
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      {/* Breadcrumb */}
      <section className="bg-white border-b border-slate-200 py-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/documentation" className="text-blue-600 hover:text-blue-700 font-medium">Documentation</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600 font-medium">{sectionTitles[section]}</span>
          </div>
        </div>
      </section>

      {/* Content with Sidebar */}
      <section className="bg-slate-50 py-10">
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
                    {sidebarSections.map((s) => {
                      const Icon = s.icon;
                      const isActive = s.slug === section;
                      return (
                        <li key={s.slug}>
                          <Link
                            to={`/documentation/${s.slug}`}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                            }`}
                          >
                            <Icon
                              size={16}
                              className={isActive ? 'text-blue-600' : 'text-slate-400'}
                            />
                            {s.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="border-t border-slate-100 mt-4 pt-4">
                    <Link
                      to="/api-docs"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-sm font-medium"
                    >
                      <ExternalLink size={16} className="text-slate-400" />
                      API Reference
                    </Link>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10"
              >
                <SectionComponent />
              </motion.div>

              {/* Prev/Next Navigation */}
              <div className="flex items-center justify-between mt-8 gap-4">
                {prev ? (
                  <Link
                    to={`/documentation/${prev.slug}`}
                    className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex-1"
                  >
                    <ArrowLeft size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Previous</div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{prev.title}</div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
                {next ? (
                  <Link
                    to={`/documentation/${next.slug}`}
                    className="flex items-center justify-end gap-3 bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex-1 text-right"
                  >
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Next</div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{next.title}</div>
                    </div>
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </div>

              {/* Back to docs */}
              <div className="mt-6 text-center">
                <Link
                  to="/documentation"
                  className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft size={14} /> Back to Documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocSection;
