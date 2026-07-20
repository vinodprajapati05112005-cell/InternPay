import fs from 'fs';
import path from 'path';

const pages = [
  // Public
  { path: 'src/pages/public/Home.jsx', name: 'Home', route: '/', layout: 'MainLayout' },
  { path: 'src/pages/public/HowItWorks.jsx', name: 'HowItWorks', route: '/how-it-works', layout: 'MainLayout' },
  { path: 'src/pages/public/ForCompanies.jsx', name: 'ForCompanies', route: '/for-companies', layout: 'MainLayout' },
  { path: 'src/pages/public/ForFreelancers.jsx', name: 'ForFreelancers', route: '/for-freelancers', layout: 'MainLayout' },
  { path: 'src/pages/public/ForJudges.jsx', name: 'ForJudges', route: '/for-judges', layout: 'MainLayout' },
  { path: 'src/pages/public/Security.jsx', name: 'Security', route: '/security', layout: 'MainLayout' },
  { path: 'src/pages/public/Documentation.jsx', name: 'Documentation', route: '/documentation', layout: 'MainLayout' },
  { path: 'src/pages/public/DocSection.jsx', name: 'DocSection', route: '/documentation/:section', layout: 'MainLayout' },
  { path: 'src/pages/public/ApiDocs.jsx', name: 'ApiDocs', route: '/api-docs', layout: 'MainLayout' },
  { path: 'src/pages/public/About.jsx', name: 'About', route: '/about', layout: 'MainLayout' },
  { path: 'src/pages/public/Contact.jsx', name: 'Contact', route: '/contact', layout: 'MainLayout' },
  { path: 'src/pages/public/Privacy.jsx', name: 'Privacy', route: '/privacy', layout: 'MainLayout' },
  { path: 'src/pages/public/Terms.jsx', name: 'Terms', route: '/terms', layout: 'MainLayout' },
  
  // Auth
  { path: 'src/pages/auth/Login.jsx', name: 'Login', route: '/login', layout: 'MainLayout' },
  { path: 'src/pages/auth/Register.jsx', name: 'Register', route: '/register', layout: 'MainLayout' },
  { path: 'src/pages/auth/ConnectWallet.jsx', name: 'ConnectWallet', route: '/connect-wallet', layout: 'MainLayout' },
  { path: 'src/pages/auth/SelectRole.jsx', name: 'SelectRole', route: '/select-role', layout: 'MainLayout' },

  // Company
  { path: 'src/pages/company/CompanyDashboard.jsx', name: 'CompanyDashboard', route: '/company/dashboard', layout: 'DashboardLayout' },
  { path: 'src/pages/company/CompanyContracts.jsx', name: 'CompanyContracts', route: '/company/contracts', layout: 'DashboardLayout' },
  { path: 'src/pages/company/CreateContract.jsx', name: 'CreateContract', route: '/company/contracts/create', layout: 'DashboardLayout' },
  { path: 'src/pages/company/CompanyContractDetails.jsx', name: 'CompanyContractDetails', route: '/company/contracts/:id', layout: 'DashboardLayout' },
  { path: 'src/pages/company/FundContract.jsx', name: 'FundContract', route: '/company/contracts/:id/fund', layout: 'DashboardLayout' },
  { path: 'src/pages/company/CompanySubmissions.jsx', name: 'CompanySubmissions', route: '/company/submissions', layout: 'DashboardLayout' },
  { path: 'src/pages/company/CompanySubmissionDetails.jsx', name: 'CompanySubmissionDetails', route: '/company/submissions/:id', layout: 'DashboardLayout' },
  { path: 'src/pages/company/CompanyDisputes.jsx', name: 'CompanyDisputes', route: '/company/disputes', layout: 'DashboardLayout' },
  { path: 'src/pages/company/CompanyDisputeDetails.jsx', name: 'CompanyDisputeDetails', route: '/company/disputes/:id', layout: 'DashboardLayout' },
  { path: 'src/pages/company/CompanyProfile.jsx', name: 'CompanyProfile', route: '/company/profile', layout: 'DashboardLayout' },
  { path: 'src/pages/company/CompanySettings.jsx', name: 'CompanySettings', route: '/company/settings', layout: 'DashboardLayout' },

  // Student
  { path: 'src/pages/student/StudentDashboard.jsx', name: 'StudentDashboard', route: '/student/dashboard', layout: 'DashboardLayout' },
  { path: 'src/pages/student/StudentContracts.jsx', name: 'StudentContracts', route: '/student/contracts', layout: 'DashboardLayout' },
  { path: 'src/pages/student/StudentContractDetails.jsx', name: 'StudentContractDetails', route: '/student/contracts/:id', layout: 'DashboardLayout' },
  { path: 'src/pages/student/SubmitWork.jsx', name: 'SubmitWork', route: '/student/contracts/:id/submit', layout: 'DashboardLayout' },
  { path: 'src/pages/student/StudentSubmissions.jsx', name: 'StudentSubmissions', route: '/student/submissions', layout: 'DashboardLayout' },
  { path: 'src/pages/student/StudentSubmissionDetails.jsx', name: 'StudentSubmissionDetails', route: '/student/submissions/:id', layout: 'DashboardLayout' },
  { path: 'src/pages/student/ReportSubmission.jsx', name: 'ReportSubmission', route: '/student/submissions/:id/report', layout: 'DashboardLayout' },
  { path: 'src/pages/student/StudentPayments.jsx', name: 'StudentPayments', route: '/student/payments', layout: 'DashboardLayout' },
  { path: 'src/pages/student/StudentProfile.jsx', name: 'StudentProfile', route: '/student/profile', layout: 'DashboardLayout' },
  { path: 'src/pages/student/StudentSettings.jsx', name: 'StudentSettings', route: '/student/settings', layout: 'DashboardLayout' },

  // Judge
  { path: 'src/pages/judge/JudgeDashboard.jsx', name: 'JudgeDashboard', route: '/judge/dashboard', layout: 'DashboardLayout' },
  { path: 'src/pages/judge/JudgeDisputes.jsx', name: 'JudgeDisputes', route: '/judge/disputes', layout: 'DashboardLayout' },
  { path: 'src/pages/judge/JudgeDisputeDetails.jsx', name: 'JudgeDisputeDetails', route: '/judge/disputes/:id', layout: 'DashboardLayout' },
  { path: 'src/pages/judge/JudgeProfile.jsx', name: 'JudgeProfile', route: '/judge/profile', layout: 'DashboardLayout' },
  { path: 'src/pages/judge/JudgeReputation.jsx', name: 'JudgeReputation', route: '/judge/reputation', layout: 'DashboardLayout' }
];

let imports = `import React from 'react';\nimport { Routes, Route } from 'react-router-dom';\n\n// Layouts\nimport MainLayout from '../layouts/MainLayout';\nimport DashboardLayout from '../layouts/DashboardLayout';\n\n`;

pages.forEach(page => {
  const relPath = page.path.replace('src/', '../').replace('.jsx', '');
  imports += `import ${page.name} from '${relPath}';\n`;
});

let routesStr = `\nconst AppRoutes = () => {\n  return (\n    <Routes>\n`;

// Group by layout
const mainLayoutPages = pages.filter(p => p.layout === 'MainLayout');
const dashboardLayoutPages = pages.filter(p => p.layout === 'DashboardLayout');

routesStr += `      {/* Main Layout Routes */}\n      <Route element={<MainLayout />}>\n`;
mainLayoutPages.forEach(p => {
  routesStr += `        <Route path="${p.route}" element={<${p.name} />} />\n`;
});
routesStr += `      </Route>\n\n`;

routesStr += `      {/* Dashboard Layout Routes */}\n      <Route element={<DashboardLayout />}>\n`;
dashboardLayoutPages.forEach(p => {
  routesStr += `        <Route path="${p.route}" element={<${p.name} />} />\n`;
});
routesStr += `      </Route>\n`;

routesStr += `    </Routes>\n  );\n};\n\nexport default AppRoutes;\n`;

fs.mkdirSync(path.resolve('src/routes'), { recursive: true });
fs.writeFileSync(path.resolve('src/routes/AppRoutes.jsx'), imports + routesStr);
console.log('Successfully generated AppRoutes.jsx');
