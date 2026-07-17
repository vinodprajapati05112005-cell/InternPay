import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scale,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Eye,
  ArrowLeft,
  Bot,
  DollarSign,
  Tag,
  Calendar,
} from 'lucide-react';
import { mockDisputes } from '../../data/mockData';

const additionalDisputes = [
  {
    id: 'DSP-002',
    contractId: 'CTR-005',
    submissionId: 'SUB-004',
    projectTitle: 'API Gateway Project',
    category: 'Web Development',
    amount: 2000,
    aiScore: 71,
    status: 'Pending Assignment',
    priority: 'Medium',
    filedBy: 'company',
    filedByName: 'CloudTech Labs',
    filedDate: '2026-07-10',
    deadline: '2026-07-17',
    reason: 'Quality Issues',
    explanation: 'The API implementation has several security vulnerabilities and does not meet performance benchmarks.',
    evidence: [],
    studentResponse: 'I followed the specifications provided. Performance testing was not part of the original scope.',
    studentEvidence: [],
    judge: null,
    judgeName: null,
    decision: null,
  },
  {
    id: 'DSP-003',
    contractId: 'CTR-006',
    submissionId: 'SUB-005',
    projectTitle: 'UI Component Library',
    category: 'Design',
    amount: 1800,
    aiScore: 78,
    status: 'Resolved',
    priority: 'Low',
    filedBy: 'company',
    filedByName: 'DesignWorks Studio',
    filedDate: '2026-06-15',
    deadline: '2026-06-22',
    reason: 'Missing Components',
    explanation: 'Several components from the design system were not delivered.',
    evidence: [],
    studentResponse: 'All contracted components have been delivered. The additional components requested were out of scope.',
    studentEvidence: [],
    judge: '0xD4...8E77',
    judgeName: 'Judge Martinez',
    decision: 'Partial Payment - $1,200',
  },
];

const allDisputes = [...mockDisputes, ...additionalDisputes];

const priorityStyles = {
  High: 'bg-red-100 text-red-700 border border-red-200',
  Medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Low: 'bg-green-100 text-green-700 border border-green-200',
};

const statusStyles = {
  'Under Review': 'bg-blue-100 text-blue-700',
  'Pending Assignment': 'bg-amber-100 text-amber-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
};

const statusIcons = {
  'Under Review': AlertTriangle,
  'Pending Assignment': Clock,
  Resolved: CheckCircle2,
};

const JudgeDisputes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const filtered = allDisputes.filter((d) => {
    const matchesSearch =
      d.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || d.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link
          to="/judge/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Dispute Cases
        </h1>
        <p className="mt-2 text-slate-500 text-lg">
          Review and resolve assigned dispute cases.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search disputes by project or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Under Review">Under Review</option>
                <option value="Pending Assignment">Pending Assignment</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Dispute Cards */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((dispute, i) => {
            const StatusIcon = statusIcons[dispute.status] || Clock;
            return (
              <motion.div
                key={dispute.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-slate-400">
                        {dispute.id}
                      </span>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${priorityStyles[dispute.priority]}`}
                      >
                        {dispute.priority} Priority
                      </span>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${statusStyles[dispute.status] || 'bg-slate-100 text-slate-600'}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {dispute.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {dispute.projectTitle}
                    </h3>
                    <p className="text-sm text-slate-500 mb-3">
                      Filed by {dispute.filedByName} · {dispute.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        {dispute.category}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        ${dispute.amount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5" />
                        AI Score: {dispute.aiScore}/100
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Deadline: {dispute.deadline}
                      </span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-slate-900">
                        ${dispute.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">
                        Filed {dispute.filedDate}
                      </p>
                    </div>
                    <Link
                      to={`/judge/disputes/${dispute.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Review Case
                    </Link>
                  </div>
                </div>

                {/* Decision (if resolved) */}
                {dispute.decision && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">Decision: </span>
                      {dispute.decision}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center"
          >
            <Scale className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-semibold text-slate-900">No disputes found</p>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search or filters.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JudgeDisputes;
