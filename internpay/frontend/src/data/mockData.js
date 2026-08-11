// ============================================
// InternPay Mock Data — Source of Truth
// ============================================

export const mockContracts = [
  {
    id: 'CTR-001',
    title: 'InternPay Landing Page',
    description: 'Build a modern, responsive landing page for InternPay with hero section, features, workflow visualization, and CTA sections.',
    company: '0x92...A41B',
    companyName: 'TechVentures Inc.',
    student: '0x7a...9F21',
    studentName: 'Alex Chen',
    category: 'Web Development',
    totalAmount: 1500,
    lockedAmount: 1500,
    status: 'In Progress',
    createdDate: '2026-06-15',
    deadline: '2026-07-30',
    milestones: [
      { id: 1, title: 'UI/UX Design', amount: 300, deadline: '2026-06-25', status: 'Completed', deliverables: ['Figma mockups', 'Component library', 'Style guide'] },
      { id: 2, title: 'Frontend Implementation', amount: 800, deadline: '2026-07-15', status: 'Submitted', deliverables: ['React components', 'Responsive layout', 'Animations'] },
      { id: 3, title: 'Testing & Polish', amount: 400, deadline: '2026-07-30', status: 'Pending', deliverables: ['Cross-browser testing', 'Performance optimization', 'Final review'] }
    ]
  },
  {
    id: 'CTR-002',
    title: 'E-Commerce Dashboard',
    description: 'Develop a comprehensive analytics dashboard for an e-commerce platform with charts, metrics, and real-time data visualization.',
    company: '0x92...A41B',
    companyName: 'TechVentures Inc.',
    student: '0x3b...7D44',
    studentName: 'Sarah Miller',
    category: 'Full Stack',
    totalAmount: 3200,
    lockedAmount: 3200,
    status: 'Funded',
    createdDate: '2026-07-01',
    deadline: '2026-08-15',
    milestones: [
      { id: 1, title: 'Database Schema & API', amount: 1200, deadline: '2026-07-20', status: 'In Progress', deliverables: ['PostgreSQL schema', 'REST API endpoints', 'Authentication'] },
      { id: 2, title: 'Dashboard UI', amount: 1200, deadline: '2026-08-05', status: 'Pending', deliverables: ['Charts', 'Data tables', 'Filters'] },
      { id: 3, title: 'Deployment', amount: 800, deadline: '2026-08-15', status: 'Pending', deliverables: ['CI/CD pipeline', 'Cloud deployment', 'Monitoring'] }
    ]
  },
  {
    id: 'CTR-003',
    title: 'Mobile App Prototype',
    description: 'Create a React Native prototype for a fitness tracking application with workout logging, progress charts, and social features.',
    company: '0x56...E8C3',
    companyName: 'FitTech Solutions',
    student: '0x7a...9F21',
    studentName: 'Alex Chen',
    category: 'Mobile Development',
    totalAmount: 2500,
    lockedAmount: 2500,
    status: 'Completed',
    createdDate: '2026-05-01',
    deadline: '2026-06-15',
    milestones: [
      { id: 1, title: 'Core Screens', amount: 1000, deadline: '2026-05-20', status: 'Completed', deliverables: ['Home screen', 'Workout screen', 'Profile screen'] },
      { id: 2, title: 'Backend Integration', amount: 1000, deadline: '2026-06-05', status: 'Completed', deliverables: ['API integration', 'Auth flow', 'Data sync'] },
      { id: 3, title: 'Polish & Testing', amount: 500, deadline: '2026-06-15', status: 'Completed', deliverables: ['Bug fixes', 'Performance', 'App store prep'] }
    ]
  },
  {
    id: 'CTR-004',
    title: 'Portfolio Website Redesign',
    description: 'Redesign a personal portfolio website with modern aesthetics, dark mode support, and project showcase.',
    company: '0xAF...12D9',
    companyName: 'Creative Agency Co.',
    student: '0x7a...9F21',
    studentName: 'Alex Chen',
    category: 'Web Design',
    totalAmount: 800,
    lockedAmount: 800,
    status: 'Disputed',
    createdDate: '2026-06-01',
    deadline: '2026-07-01',
    milestones: [
      { id: 1, title: 'Design Concepts', amount: 300, deadline: '2026-06-15', status: 'Completed', deliverables: ['3 design concepts', 'Moodboard', 'Typography'] },
      { id: 2, title: 'Development', amount: 500, deadline: '2026-07-01', status: 'Disputed', deliverables: ['HTML/CSS build', 'JavaScript interactions', 'CMS integration'] }
    ]
  }
];

export const mockSubmissions = [
  {
    id: 'SUB-001',
    contractId: 'CTR-001',
    milestoneId: 2,
    projectTitle: 'InternPay Landing Page',
    milestoneTitle: 'Frontend Implementation',
    student: '0x7a...9F21',
    studentName: 'Alex Chen',
    company: '0x92...A41B',
    companyName: 'TechVentures Inc.',
    submittedDate: '2026-07-14',
    status: 'Dispute Window',
    disputeDeadline: '2026-07-15T14:00:00Z',
    aiScore: 87,
    links: {
      github: 'https://github.com/alexchen/internpay-landing',
      figma: 'https://figma.com/file/internpay-design',
      liveDemo: 'https://internpay-demo.vercel.app',
      documentation: 'https://docs.internpay.dev',
      video: 'https://loom.com/share/internpay-walkthrough'
    },
    notes: 'Completed all required components. Responsive on all breakpoints. Added micro-animations for enhanced UX.',
    evaluation: {
      overallScore: 87,
      dimensions: [
        { name: 'Code Quality', score: 91, weight: 30, explanation: 'Clean, modular React code with proper component architecture. Good use of custom hooks and context patterns.' },
        { name: 'Design Quality', score: 84, weight: 25, explanation: 'Modern, polished UI that follows the provided Figma mockups closely. Minor spacing inconsistencies on tablet viewports.' },
        { name: 'Functionality', score: 88, weight: 25, explanation: 'All specified features are working correctly. Form validations, animations, and interactions are smooth.' },
        { name: 'Requirement Match', score: 85, weight: 20, explanation: 'Meets 17 of 20 requirements. Missing: dark mode toggle, sitemap page, and cookie consent banner.' }
      ],
      strengths: [
        'Excellent component reusability and code organization',
        'Smooth animations using Framer Motion',
        'Comprehensive responsive design for mobile and desktop',
        'Proper SEO meta tags and semantic HTML'
      ],
      weaknesses: [
        'Missing dark mode toggle feature',
        'Tablet viewport has minor alignment issues',
        'No cookie consent implementation',
        'Performance could be improved with lazy loading'
      ],
      reasoning: 'The implementation demonstrates strong technical skills with clean React architecture and polished UI. The code is well-organized with reusable components. While three minor requirements are missing (dark mode, sitemap, cookie consent), the overall delivery significantly exceeds the quality bar for this milestone.',
      recommendation: 'APPROVE'
    }
  },
  {
    id: 'SUB-002',
    contractId: 'CTR-003',
    milestoneId: 3,
    projectTitle: 'Mobile App Prototype',
    milestoneTitle: 'Polish & Testing',
    student: '0x7a...9F21',
    studentName: 'Alex Chen',
    company: '0x56...E8C3',
    companyName: 'FitTech Solutions',
    submittedDate: '2026-06-14',
    status: 'Released',
    disputeDeadline: '2026-06-15T14:00:00Z',
    aiScore: 93,
    links: {
      github: 'https://github.com/alexchen/fittech-app',
      liveDemo: 'https://expo.dev/@alexchen/fittech',
      documentation: 'https://docs.fittech-app.dev',
      video: 'https://loom.com/share/fittech-demo'
    },
    notes: 'All bugs fixed. App performance optimized. Ready for app store submission.',
    evaluation: {
      overallScore: 93,
      dimensions: [
        { name: 'Code Quality', score: 95, weight: 30, explanation: 'Exceptionally clean React Native code with TypeScript.' },
        { name: 'Design Quality', score: 90, weight: 25, explanation: 'Pixel-perfect implementation of all screens.' },
        { name: 'Functionality', score: 94, weight: 25, explanation: 'All features working flawlessly across iOS and Android.' },
        { name: 'Requirement Match', score: 92, weight: 20, explanation: 'All requirements met. Exceeded expectations on animations.' }
      ],
      strengths: ['TypeScript throughout', 'Excellent performance', 'Complete test coverage'],
      weaknesses: ['Could add more accessibility labels'],
      reasoning: 'Outstanding delivery. All requirements exceeded.',
      recommendation: 'APPROVE'
    }
  },
  {
    id: 'SUB-003',
    contractId: 'CTR-004',
    milestoneId: 2,
    projectTitle: 'Portfolio Website Redesign',
    milestoneTitle: 'Development',
    student: '0x7a...9F21',
    studentName: 'Alex Chen',
    company: '0xAF...12D9',
    companyName: 'Creative Agency Co.',
    submittedDate: '2026-06-28',
    status: 'Disputed',
    disputeDeadline: '2026-06-29T14:00:00Z',
    aiScore: 62,
    links: {
      github: 'https://github.com/alexchen/portfolio-redesign',
      liveDemo: 'https://portfolio-v2.vercel.app'
    },
    notes: 'Completed the core build. Some CMS integration still pending.',
    evaluation: {
      overallScore: 62,
      dimensions: [
        { name: 'Code Quality', score: 75, weight: 30, explanation: 'Reasonable code quality but lacks consistent patterns.' },
        { name: 'Design Quality', score: 70, weight: 25, explanation: 'Design partially matches mockups but missing key sections.' },
        { name: 'Functionality', score: 55, weight: 25, explanation: 'CMS integration incomplete. Contact form not functional.' },
        { name: 'Requirement Match', score: 48, weight: 20, explanation: 'Only 60% of requirements delivered. Missing CMS, blog, and contact.' }
      ],
      strengths: ['Clean HTML/CSS structure', 'Good responsive breakpoints'],
      weaknesses: ['CMS not integrated', 'Blog section missing', 'Contact form broken', 'Missing SEO implementation'],
      reasoning: 'The submission is incomplete. While the visual design foundation is solid, several critical deliverables are missing including CMS integration, blog functionality, and a working contact form.',
      recommendation: 'HUMAN_REVIEW'
    }
  }
];

export const mockDisputes = [
  {
    id: 'DSP-001',
    contractId: 'CTR-004',
    submissionId: 'SUB-003',
    projectTitle: 'Portfolio Website Redesign',
    category: 'Web Design',
    amount: 500,
    aiScore: 62,
    status: 'Under Review',
    priority: 'High',
    filedBy: 'company',
    filedByName: 'Creative Agency Co.',
    filedDate: '2026-06-29',
    deadline: '2026-07-06',
    reason: 'Incomplete Delivery',
    explanation: 'The submitted work is missing critical deliverables including CMS integration, blog section, and a working contact form. The AI evaluation confirmed that only 60% of requirements were met. We cannot accept this as a completed milestone.',
    evidence: [
      'https://figma.com/original-requirements',
      'https://docs.google.com/contract-specs',
      'https://screenrecord.com/missing-features'
    ],
    studentResponse: 'The CMS integration was delayed due to API access issues on the client side. I communicated this delay on June 20th. The blog and contact form were in progress but not yet deployed. I request partial payment for the work completed.',
    studentEvidence: [
      'https://github.com/alexchen/portfolio-redesign/commits',
      'https://slack-screenshot.com/delay-communication',
      'https://staging.portfolio-v2.vercel.app'
    ],
    judge: '0xD4...8E77',
    judgeName: 'Judge Martinez',
    decision: null
  }
];

export const mockPayments = [
  { id: 'PAY-001', contractId: 'CTR-003', milestone: 'Core Screens', amount: 1000, currency: 'ETH', status: 'Released', date: '2026-05-22', txHash: '0xa1b2...c3d4' },
  { id: 'PAY-002', contractId: 'CTR-003', milestone: 'Backend Integration', amount: 1000, currency: 'ETH', status: 'Released', date: '2026-06-07', txHash: '0xe5f6...g7h8' },
  { id: 'PAY-003', contractId: 'CTR-003', milestone: 'Polish & Testing', amount: 500, currency: 'ETH', status: 'Released', date: '2026-06-16', txHash: '0xi9j0...k1l2' },
  { id: 'PAY-004', contractId: 'CTR-001', milestone: 'UI/UX Design', amount: 300, currency: 'ETH', status: 'Released', date: '2026-06-27', txHash: '0xm3n4...o5p6' },
  { id: 'PAY-005', contractId: 'CTR-001', milestone: 'Frontend Implementation', amount: 800, currency: 'ETH', status: 'Dispute Window', date: '2026-07-14', txHash: null },
  { id: 'PAY-006', contractId: 'CTR-004', milestone: 'Design Concepts', amount: 300, currency: 'ETH', status: 'Released', date: '2026-06-17', txHash: '0xq7r8...s9t0' },
  { id: 'PAY-007', contractId: 'CTR-004', milestone: 'Development', amount: 500, currency: 'ETH', status: 'Disputed', date: '2026-06-29', txHash: null },
];

export const mockJudgeStats = {
  assignedDisputes: 3,
  activeDisputes: 1,
  completedDisputes: 47,
  accuracyRate: 94.2,
  reputationScore: 847,
  maxReputation: 1000,
  decisionHistory: [
    { id: 'DEC-001', project: 'API Gateway Project', decision: 'Approve Payment', date: '2026-06-20', amount: 2000, contested: false },
    { id: 'DEC-002', project: 'UI Component Library', decision: 'Partial Payment', date: '2026-06-10', amount: 1800, contested: false },
    { id: 'DEC-003', project: 'Database Migration Tool', decision: 'Reject and Refund', date: '2026-05-28', amount: 3500, contested: true },
    { id: 'DEC-004', project: 'Chat Application', decision: 'Approve Payment', date: '2026-05-15', amount: 1200, contested: false },
    { id: 'DEC-005', project: 'Analytics Dashboard', decision: 'Approve Payment', date: '2026-05-02', amount: 2800, contested: false },
  ]
};

export const mockCompanyStats = {
  totalLockedFunds: 5500,
  activeContracts: 2,
  pendingSubmissions: 1,
  activeDisputes: 1,
  releasedPayments: 4100,
  totalContracts: 4
};

export const mockStudentStats = {
  totalEarnings: 3100,
  pendingPayments: 1300,
  activeContracts: 2,
  completedContracts: 1,
  averageAiScore: 81
};
