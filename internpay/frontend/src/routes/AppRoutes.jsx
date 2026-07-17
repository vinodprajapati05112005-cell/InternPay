import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

import Home from '../pages/public/Home';
import HowItWorks from '../pages/public/HowItWorks';
import ForCompanies from '../pages/public/ForCompanies';
import ForFreelancers from '../pages/public/ForFreelancers';
import ForJudges from '../pages/public/ForJudges';
import Security from '../pages/public/Security';
import Documentation from '../pages/public/Documentation';
import DocSection from '../pages/public/DocSection';
import ApiDocs from '../pages/public/ApiDocs';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Privacy from '../pages/public/Privacy';
import Terms from '../pages/public/Terms';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ConnectWallet from '../pages/auth/ConnectWallet';
import SelectRole from '../pages/auth/SelectRole';
import CompanyDashboard from '../pages/company/CompanyDashboard';
import CompanyContracts from '../pages/company/CompanyContracts';
import CreateContract from '../pages/company/CreateContract';
import CompanyContractDetails from '../pages/company/CompanyContractDetails';
import FundContract from '../pages/company/FundContract';
import CompanySubmissions from '../pages/company/CompanySubmissions';
import CompanySubmissionDetails from '../pages/company/CompanySubmissionDetails';
import CompanyDisputes from '../pages/company/CompanyDisputes';
import CompanyDisputeDetails from '../pages/company/CompanyDisputeDetails';
import CompanyProfile from '../pages/company/CompanyProfile';
import CompanySettings from '../pages/company/CompanySettings';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentContracts from '../pages/student/StudentContracts';
import StudentContractDetails from '../pages/student/StudentContractDetails';
import SubmitWork from '../pages/student/SubmitWork';
import StudentSubmissions from '../pages/student/StudentSubmissions';
import StudentSubmissionDetails from '../pages/student/StudentSubmissionDetails';
import ReportSubmission from '../pages/student/ReportSubmission';
import StudentPayments from '../pages/student/StudentPayments';
import StudentProfile from '../pages/student/StudentProfile';
import StudentSettings from '../pages/student/StudentSettings';
import JudgeDashboard from '../pages/judge/JudgeDashboard';
import JudgeDisputes from '../pages/judge/JudgeDisputes';
import JudgeDisputeDetails from '../pages/judge/JudgeDisputeDetails';
import JudgeProfile from '../pages/judge/JudgeProfile';
import JudgeReputation from '../pages/judge/JudgeReputation';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/for-companies" element={<ForCompanies />} />
        <Route path="/for-freelancers" element={<ForFreelancers />} />
        <Route path="/for-judges" element={<ForJudges />} />
        <Route path="/security" element={<Security />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/documentation/:section" element={<DocSection />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/connect-wallet" element={<ConnectWallet />} />
        <Route path="/select-role" element={<SelectRole />} />
      </Route>

      {/* Dashboard Layout Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/contracts" element={<CompanyContracts />} />
        <Route path="/company/contracts/create" element={<CreateContract />} />
        <Route path="/company/contracts/:id" element={<CompanyContractDetails />} />
        <Route path="/company/contracts/:id/fund" element={<FundContract />} />
        <Route path="/company/submissions" element={<CompanySubmissions />} />
        <Route path="/company/submissions/:id" element={<CompanySubmissionDetails />} />
        <Route path="/company/disputes" element={<CompanyDisputes />} />
        <Route path="/company/disputes/:id" element={<CompanyDisputeDetails />} />
        <Route path="/company/profile" element={<CompanyProfile />} />
        <Route path="/company/settings" element={<CompanySettings />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/contracts" element={<StudentContracts />} />
        <Route path="/student/contracts/:id" element={<StudentContractDetails />} />
        <Route path="/student/contracts/:id/submit" element={<SubmitWork />} />
        <Route path="/student/submissions" element={<StudentSubmissions />} />
        <Route path="/student/submissions/:id" element={<StudentSubmissionDetails />} />
        <Route path="/student/submissions/:id/report" element={<ReportSubmission />} />
        <Route path="/student/payments" element={<StudentPayments />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/settings" element={<StudentSettings />} />
        <Route path="/judge/dashboard" element={<JudgeDashboard />} />
        <Route path="/judge/disputes" element={<JudgeDisputes />} />
        <Route path="/judge/disputes/:id" element={<JudgeDisputeDetails />} />
        <Route path="/judge/profile" element={<JudgeProfile />} />
        <Route path="/judge/reputation" element={<JudgeReputation />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
