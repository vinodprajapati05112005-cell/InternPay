import fs from 'fs';
import path from 'path';

const pages = [
  // Public
  { path: 'src/pages/public/Home.jsx', name: 'Home' },
  { path: 'src/pages/public/HowItWorks.jsx', name: 'HowItWorks' },
  { path: 'src/pages/public/ForCompanies.jsx', name: 'ForCompanies' },
  { path: 'src/pages/public/ForFreelancers.jsx', name: 'ForFreelancers' },
  { path: 'src/pages/public/ForJudges.jsx', name: 'ForJudges' },
  { path: 'src/pages/public/Security.jsx', name: 'Security' },
  { path: 'src/pages/public/Documentation.jsx', name: 'Documentation' },
  { path: 'src/pages/public/DocSection.jsx', name: 'DocSection' },
  { path: 'src/pages/public/ApiDocs.jsx', name: 'ApiDocs' },
  { path: 'src/pages/public/About.jsx', name: 'About' },
  { path: 'src/pages/public/Contact.jsx', name: 'Contact' },
  { path: 'src/pages/public/Privacy.jsx', name: 'Privacy' },
  { path: 'src/pages/public/Terms.jsx', name: 'Terms' },
  
  // Auth
  { path: 'src/pages/auth/Login.jsx', name: 'Login' },
  { path: 'src/pages/auth/Register.jsx', name: 'Register' },
  { path: 'src/pages/auth/ConnectWallet.jsx', name: 'ConnectWallet' },
  { path: 'src/pages/auth/SelectRole.jsx', name: 'SelectRole' },

  // Company
  { path: 'src/pages/company/CompanyDashboard.jsx', name: 'CompanyDashboard' },
  { path: 'src/pages/company/CompanyContracts.jsx', name: 'CompanyContracts' },
  { path: 'src/pages/company/CreateContract.jsx', name: 'CreateContract' },
  { path: 'src/pages/company/CompanyContractDetails.jsx', name: 'CompanyContractDetails' },
  { path: 'src/pages/company/FundContract.jsx', name: 'FundContract' },
  { path: 'src/pages/company/CompanySubmissions.jsx', name: 'CompanySubmissions' },
  { path: 'src/pages/company/CompanySubmissionDetails.jsx', name: 'CompanySubmissionDetails' },
  { path: 'src/pages/company/CompanyDisputes.jsx', name: 'CompanyDisputes' },
  { path: 'src/pages/company/CompanyDisputeDetails.jsx', name: 'CompanyDisputeDetails' },
  { path: 'src/pages/company/CompanyProfile.jsx', name: 'CompanyProfile' },
  { path: 'src/pages/company/CompanySettings.jsx', name: 'CompanySettings' },

  // Student
  { path: 'src/pages/student/StudentDashboard.jsx', name: 'StudentDashboard' },
  { path: 'src/pages/student/StudentContracts.jsx', name: 'StudentContracts' },
  { path: 'src/pages/student/StudentContractDetails.jsx', name: 'StudentContractDetails' },
  { path: 'src/pages/student/SubmitWork.jsx', name: 'SubmitWork' },
  { path: 'src/pages/student/StudentSubmissions.jsx', name: 'StudentSubmissions' },
  { path: 'src/pages/student/StudentSubmissionDetails.jsx', name: 'StudentSubmissionDetails' },
  { path: 'src/pages/student/ReportSubmission.jsx', name: 'ReportSubmission' },
  { path: 'src/pages/student/StudentPayments.jsx', name: 'StudentPayments' },
  { path: 'src/pages/student/StudentProfile.jsx', name: 'StudentProfile' },
  { path: 'src/pages/student/StudentSettings.jsx', name: 'StudentSettings' },

  // Judge
  { path: 'src/pages/judge/JudgeDashboard.jsx', name: 'JudgeDashboard' },
  { path: 'src/pages/judge/JudgeDisputes.jsx', name: 'JudgeDisputes' },
  { path: 'src/pages/judge/JudgeDisputeDetails.jsx', name: 'JudgeDisputeDetails' },
  { path: 'src/pages/judge/JudgeProfile.jsx', name: 'JudgeProfile' },
  { path: 'src/pages/judge/JudgeReputation.jsx', name: 'JudgeReputation' }
];

const template = (name) => `import React from 'react';

const ${name} = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">${name}</h1>
      <p className="text-gray-600">This is a mock page for ${name}.</p>
    </div>
  );
};

export default ${name};
`;

pages.forEach(page => {
  const fullPath = path.resolve(page.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, template(page.name));
});

console.log('Successfully generated page components');
