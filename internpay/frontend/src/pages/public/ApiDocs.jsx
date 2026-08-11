import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code2, BookOpen, Copy, Check, ArrowRight, ChevronDown, ChevronRight,
  ExternalLink, Lock, Server
} from 'lucide-react';

const endpoints = [
  {
    id: 'create-contract',
    method: 'POST',
    path: '/api/contracts',
    title: 'Create a new contract',
    description: 'Creates a new escrow contract with milestones, requirements, and payment terms. The contract is deployed on-chain after funding.',
    auth: true,
    requestBody: {
      title: 'string — Contract title',
      description: 'string — Detailed project description',
      freelancerAddress: 'string — Ethereum address of the freelancer',
      totalAmount: 'number — Total payment amount in ETH',
      milestones: [
        {
          title: 'Frontend Implementation',
          description: 'Build the React frontend with all specified components',
          amount: 750,
          deadline: '2026-08-15T00:00:00Z',
        },
        {
          title: 'Backend Integration',
          description: 'Integrate with smart contracts and deploy',
          amount: 750,
          deadline: '2026-09-01T00:00:00Z',
        },
      ],
      requirements: [
        'React 18+ with TypeScript',
        'Tailwind CSS styling',
        'Responsive design (mobile-first)',
        'Unit test coverage > 80%',
      ],
    },
    requestExample: JSON.stringify(
      {
        title: 'E-commerce Dashboard Frontend',
        description: 'Build a complete admin dashboard for an e-commerce platform...',
        freelancerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
        totalAmount: 1500,
        milestones: [
          {
            title: 'Frontend Implementation',
            description: 'Build the React frontend with all specified components',
            amount: 750,
            deadline: '2026-08-15T00:00:00Z',
          },
          {
            title: 'Backend Integration',
            description: 'Integrate with smart contracts and deploy',
            amount: 750,
            deadline: '2026-09-01T00:00:00Z',
          },
        ],
        requirements: [
          'React 18+ with TypeScript',
          'Tailwind CSS styling',
          'Responsive design (mobile-first)',
          'Unit test coverage > 80%',
        ],
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        data: {
          id: 'contract_8492',
          status: 'CREATED',
          companyAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aec9B',
          freelancerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
          totalAmount: 1500,
          escrowAddress: '0x1234567890abcdef1234567890abcdef12345678',
          milestones: [
            { id: 'ms_001', title: 'Frontend Implementation', amount: 750, status: 'PENDING' },
            { id: 'ms_002', title: 'Backend Integration', amount: 750, status: 'PENDING' },
          ],
          createdAt: '2026-07-17T10:30:00Z',
          transactionHash: '0xabc123...',
        },
      },
      null,
      2
    ),
    statusCodes: [
      { code: 201, description: 'Contract created successfully' },
      { code: 400, description: 'Invalid request body or missing required fields' },
      { code: 401, description: 'Unauthorized — wallet not connected' },
      { code: 422, description: 'Milestone amounts do not sum to totalAmount' },
    ],
  },
  {
    id: 'get-contract',
    method: 'GET',
    path: '/api/contracts/:id',
    title: 'Get contract details',
    description: 'Retrieves the full details of a specific escrow contract including milestones, status, and on-chain data.',
    auth: true,
    requestBody: null,
    requestExample: null,
    responseExample: JSON.stringify(
      {
        success: true,
        data: {
          id: 'contract_8492',
          title: 'E-commerce Dashboard Frontend',
          description: 'Build a complete admin dashboard for an e-commerce platform...',
          status: 'IN_PROGRESS',
          companyAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aec9B',
          freelancerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
          totalAmount: 1500,
          fundedAmount: 1500,
          releasedAmount: 0,
          escrowAddress: '0x1234567890abcdef1234567890abcdef12345678',
          milestones: [
            {
              id: 'ms_001',
              title: 'Frontend Implementation',
              amount: 750,
              status: 'SUBMITTED',
              deadline: '2026-08-15T00:00:00Z',
              submissionId: 'sub_2341',
            },
            {
              id: 'ms_002',
              title: 'Backend Integration',
              amount: 750,
              status: 'PENDING',
              deadline: '2026-09-01T00:00:00Z',
              submissionId: null,
            },
          ],
          requirements: [
            'React 18+ with TypeScript',
            'Tailwind CSS styling',
            'Responsive design (mobile-first)',
            'Unit test coverage > 80%',
          ],
          createdAt: '2026-07-17T10:30:00Z',
          fundedAt: '2026-07-17T11:45:00Z',
        },
      },
      null,
      2
    ),
    statusCodes: [
      { code: 200, description: 'Contract details returned' },
      { code: 401, description: 'Unauthorized — wallet not connected' },
      { code: 403, description: 'Forbidden — not a party to this contract' },
      { code: 404, description: 'Contract not found' },
    ],
  },
  {
    id: 'submit-work',
    method: 'POST',
    path: '/api/submissions',
    title: 'Submit work',
    description: 'Submits work for a specific milestone. Triggers the AI evaluation engine to analyze the submitted deliverables against contract requirements.',
    auth: true,
    requestExample: JSON.stringify(
      {
        contractId: 'contract_8492',
        milestoneId: 'ms_001',
        githubUrl: 'https://github.com/user/ecommerce-dashboard',
        figmaUrl: 'https://figma.com/file/abc123/dashboard-design',
        demoUrl: 'https://ecommerce-dash.vercel.app',
        notes: 'All components implemented per spec. Added extra accessibility features.',
        files: ['screenshot_desktop.png', 'screenshot_mobile.png'],
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        data: {
          id: 'sub_2341',
          contractId: 'contract_8492',
          milestoneId: 'ms_001',
          status: 'EVALUATING',
          githubUrl: 'https://github.com/user/ecommerce-dashboard',
          figmaUrl: 'https://figma.com/file/abc123/dashboard-design',
          demoUrl: 'https://ecommerce-dash.vercel.app',
          submittedAt: '2026-07-20T14:00:00Z',
          estimatedEvaluationTime: '5-10 minutes',
          transactionHash: '0xdef456...',
        },
      },
      null,
      2
    ),
    statusCodes: [
      { code: 201, description: 'Work submitted and evaluation started' },
      { code: 400, description: 'Missing required submission fields' },
      { code: 401, description: 'Unauthorized — wallet not connected' },
      { code: 403, description: 'Forbidden — not the assigned freelancer' },
      { code: 409, description: 'Milestone already has a pending submission' },
    ],
  },
  {
    id: 'get-report',
    method: 'GET',
    path: '/api/submissions/:id/report',
    title: 'Get AI evaluation report',
    description: 'Retrieves the full AI evaluation report for a specific submission. Includes scores across 4 dimensions, reasoning, and recommendations.',
    auth: true,
    requestBody: null,
    requestExample: null,
    responseExample: JSON.stringify(
      {
        success: true,
        data: {
          id: 'report_7891',
          submissionId: 'sub_2341',
          overallScore: 87,
          recommendation: 'APPROVE',
          dimensions: {
            codeQuality: {
              score: 92,
              feedback: 'Excellent code organization with clear separation of concerns. Consistent naming conventions and proper TypeScript usage.',
            },
            designQuality: {
              score: 85,
              feedback: 'Clean UI implementation following the design spec. Minor spacing inconsistencies on tablet viewports.',
            },
            functionality: {
              score: 88,
              feedback: 'All required features implemented and working. Search filtering has a minor edge case with special characters.',
            },
            requirementMatch: {
              score: 84,
              feedback: 'Core requirements met. Test coverage at 76% — slightly below the 80% threshold specified.',
            },
          },
          reasoning: 'The submission demonstrates strong technical execution with well-structured React components...',
          evaluatedAt: '2026-07-20T14:08:23Z',
          modelVersion: 'internpay-eval-v2.1',
        },
      },
      null,
      2
    ),
    statusCodes: [
      { code: 200, description: 'Evaluation report returned' },
      { code: 401, description: 'Unauthorized — wallet not connected' },
      { code: 403, description: 'Forbidden — not a party to this contract' },
      { code: 404, description: 'Submission or report not found' },
      { code: 425, description: 'Evaluation still in progress — try again shortly' },
    ],
  },
  {
    id: 'file-dispute',
    method: 'POST',
    path: '/api/disputes',
    title: 'File a dispute',
    description: 'Files a dispute against an AI evaluation decision. Either party (company or freelancer) can file a dispute within the 72-hour window.',
    auth: true,
    requestExample: JSON.stringify(
      {
        submissionId: 'sub_2341',
        reason: 'UNFAIR_EVALUATION',
        description: 'The AI evaluation did not properly assess the responsive design implementation. All breakpoints are correctly handled as shown in the demo.',
        evidence: [
          {
            type: 'screenshot',
            url: 'https://storage.internpay.dev/evidence/responsive_proof.png',
            description: 'Screenshots showing responsive design on all breakpoints',
          },
          {
            type: 'video',
            url: 'https://storage.internpay.dev/evidence/demo_recording.mp4',
            description: 'Full demo walkthrough showing functionality',
          },
        ],
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        data: {
          id: 'dispute_4521',
          submissionId: 'sub_2341',
          contractId: 'contract_8492',
          status: 'OPEN',
          filedBy: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
          reason: 'UNFAIR_EVALUATION',
          assignedJudge: null,
          createdAt: '2026-07-21T09:15:00Z',
          deadline: '2026-07-28T09:15:00Z',
          transactionHash: '0xghi789...',
        },
      },
      null,
      2
    ),
    statusCodes: [
      { code: 201, description: 'Dispute filed successfully' },
      { code: 400, description: 'Invalid dispute reason or missing evidence' },
      { code: 401, description: 'Unauthorized — wallet not connected' },
      { code: 403, description: 'Forbidden — not a party to this contract' },
      { code: 409, description: 'Dispute already exists for this submission' },
      { code: 410, description: '72-hour dispute window has expired' },
    ],
  },
  {
    id: 'resolve-dispute',
    method: 'POST',
    path: '/api/disputes/:id/resolve',
    title: 'Resolve a dispute',
    description: 'Resolves a dispute with a binding decision. Only assigned judges can call this endpoint. Triggers on-chain payment release or refund.',
    auth: true,
    requestExample: JSON.stringify(
      {
        decision: 'RELEASE_PAYMENT',
        splitPercentage: null,
        reasoning: 'After reviewing the submitted code, design files, and live demo, the work clearly meets the specified requirements. The AI evaluation underscored the responsive design which is properly implemented across all breakpoints. Recommending full payment release.',
        scores: {
          codeQuality: 90,
          designQuality: 92,
          functionality: 88,
          requirementMatch: 91,
        },
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        data: {
          id: 'dispute_4521',
          status: 'RESOLVED',
          decision: 'RELEASE_PAYMENT',
          judgeAddress: '0x9876543210fedcba9876543210fedcba98765432',
          reasoning: 'After reviewing the submitted code, design files, and live demo...',
          resolvedAt: '2026-07-24T16:30:00Z',
          paymentReleased: true,
          amountReleased: 750,
          judgeReward: 18.75,
          transactionHash: '0xjkl012...',
        },
      },
      null,
      2
    ),
    statusCodes: [
      { code: 200, description: 'Dispute resolved and payment processed' },
      { code: 400, description: 'Invalid decision type or missing reasoning' },
      { code: 401, description: 'Unauthorized — wallet not connected' },
      { code: 403, description: 'Forbidden — not the assigned judge' },
      { code: 404, description: 'Dispute not found' },
      { code: 409, description: 'Dispute already resolved' },
    ],
  },
];

const MethodBadge = ({ method }) => {
  const colors = {
    GET: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    POST: 'bg-blue-100 text-blue-700 border-blue-200',
    PUT: 'bg-amber-100 text-amber-700 border-amber-200',
    DELETE: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${colors[method] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {method}
    </span>
  );
};

const StatusCode = ({ code, description }) => {
  let color = 'text-slate-600';
  if (code >= 200 && code < 300) color = 'text-emerald-600';
  if (code >= 400 && code < 500) color = 'text-amber-600';
  if (code >= 500) color = 'text-red-600';
  return (
    <div className="flex items-baseline gap-3 py-1.5">
      <code className={`text-sm font-bold ${color}`}>{code}</code>
      <span className="text-sm text-slate-600">{description}</span>
    </div>
  );
};

const CodeBlock = ({ code, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {label && (
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</div>
      )}
      <div className="relative group">
        <pre className="bg-slate-900 text-slate-300 rounded-xl p-5 text-sm overflow-x-auto leading-relaxed font-mono">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-slate-700"
          title="Copy to clipboard"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-400" />}
        </button>
      </div>
    </div>
  );
};

const EndpointCard = ({ endpoint }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id={endpoint.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-24">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 md:p-6 hover:bg-slate-50/50 transition-colors text-left"
      >
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-semibold text-slate-800 font-mono">{endpoint.path}</code>
        <span className="text-sm text-slate-500 hidden md:inline ml-2">— {endpoint.title}</span>
        {endpoint.auth && (
          <Lock size={14} className="text-slate-400 ml-auto mr-2" title="Authentication required" />
        )}
        {expanded ? (
          <ChevronDown size={18} className="text-slate-400 shrink-0" />
        ) : (
          <ChevronRight size={18} className="text-slate-400 shrink-0" />
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="border-t border-slate-100"
        >
          <div className="p-5 md:p-6 space-y-6">
            {/* Description */}
            <div>
              <p className="text-slate-600 leading-relaxed">{endpoint.description}</p>
              {endpoint.auth && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                  <Lock size={12} />
                  Requires wallet authentication
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Request */}
              {endpoint.requestExample && (
                <div>
                  <CodeBlock code={endpoint.requestExample} label="Request Body" />
                </div>
              )}

              {/* Response */}
              <div className={!endpoint.requestExample ? 'lg:col-span-2' : ''}>
                <CodeBlock code={endpoint.responseExample} label="Response" />
              </div>
            </div>

            {/* Status Codes */}
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status Codes</div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                {endpoint.statusCodes.map((sc) => (
                  <StatusCode key={sc.code} code={sc.code} description={sc.description} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ApiDocs = () => {
  return (
    <div className="w-full font-sans">
      {/* Hero */}
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
              <Code2 size={16} />
              <span>API Reference</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              InternPay{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                API Docs
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Complete REST API reference for integrating with InternPay's escrow, submission, and dispute resolution services.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/documentation"
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all text-sm flex items-center gap-2"
              >
                <BookOpen size={16} /> Documentation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* API Content */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="lg:sticky lg:top-24">
                <nav className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Base URL</h3>
                  <code className="text-xs bg-slate-900 text-emerald-400 px-3 py-2 rounded-lg block mb-5 font-mono">
                    https://api.internpay.dev/v1
                  </code>

                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Endpoints</h3>
                  <ul className="space-y-1">
                    {endpoints.map((ep) => (
                      <li key={ep.id}>
                        <a
                          href={`#${ep.id}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-sm font-medium"
                        >
                          <MethodBadge method={ep.method} />
                          <span className="truncate font-mono text-xs">{ep.path.split('/').slice(-1)[0]}</span>
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-slate-100 mt-4 pt-4">
                    <Link
                      to="/documentation"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-sm font-medium"
                    >
                      <BookOpen size={14} /> Back to Docs
                    </Link>
                  </div>
                </nav>

                {/* Authentication Info */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mt-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Authentication</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    All endpoints require wallet-based authentication via signed messages.
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <code className="text-xs text-slate-700 font-mono block">
                      Authorization: Bearer {'<signed_token>'}
                    </code>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-5">
              {/* Info Banner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4"
              >
                <Server size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-blue-900 mb-1">Mock API Reference</h3>
                  <p className="text-sm text-blue-700">
                    This is a mock API reference for demonstration purposes. All examples show the expected request and response formats. 
                    Click any endpoint to expand and see full details.
                  </p>
                </div>
              </motion.div>

              {/* Endpoints */}
              {endpoints.map((endpoint, i) => (
                <motion.div
                  key={endpoint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <EndpointCard endpoint={endpoint} />
                </motion.div>
              ))}

              {/* Rate Limiting Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">Rate Limiting</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                    <div className="text-2xl font-extrabold text-slate-900">100</div>
                    <div className="text-sm text-slate-500">Requests / minute</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                    <div className="text-2xl font-extrabold text-slate-900">1,000</div>
                    <div className="text-sm text-slate-500">Requests / hour</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                    <div className="text-2xl font-extrabold text-slate-900">10,000</div>
                    <div className="text-sm text-slate-500">Requests / day</div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-4">
                  Rate limit headers (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">X-RateLimit-Remaining</code>,{' '}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">X-RateLimit-Reset</code>) are included in every response.
                </p>
              </motion.div>

              {/* Error Format */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">Error Response Format</h3>
                <p className="text-sm text-slate-600 mb-4">
                  All error responses follow a consistent format with an error code, message, and optional field-level details.
                </p>
                <CodeBlock
                  code={JSON.stringify(
                    {
                      success: false,
                      error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid request body',
                        details: [
                          { field: 'totalAmount', message: 'Must be a positive number' },
                          { field: 'milestones', message: 'At least one milestone is required' },
                        ],
                      },
                    },
                    null,
                    2
                  )}
                  label="Error Response Example"
                />
              </motion.div>

              {/* CTA */}
              <div className="bg-slate-900 rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 blur-[60px] rounded-full" />
                <div className="relative z-10">
                  <h3 className="text-xl font-extrabold text-white mb-3">Need Help Integrating?</h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    Check out the full documentation or reach out to our team for support.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Link
                      to="/documentation"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all text-sm flex items-center gap-2"
                    >
                      Documentation <ArrowRight size={14} />
                    </Link>
                    <Link
                      to="/contact"
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-all text-sm"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApiDocs;
