import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, ArrowRight, Calendar, User,
  DollarSign, Search, Filter
} from 'lucide-react';
import { mockContracts } from '../../data/mockData';

const statusTabs = ['All', 'Active', 'Funded', 'In Progress', 'Completed', 'Disputed'];

const statusColors = {
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'Funded': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Completed': 'bg-violet-50 text-violet-700 border-violet-200',
  'Disputed': 'bg-rose-50 text-rose-700 border-rose-200',
};

const CompanyContracts = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContracts = mockContracts.filter(c => {
    const matchesTab = activeTab === 'All'
      || activeTab === 'Active' ? (activeTab !== 'Active' || c.status === 'In Progress' || c.status === 'Funded') : c.status === activeTab;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase())
      || c.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Active') return (c.status === 'In Progress' || c.status === 'Funded') && matchesSearch;
    return c.status === activeTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Contracts</h1>
          <p className="text-slate-500 mt-1">{mockContracts.length} total contracts</p>
        </div>
        <Link
          to="/company/contracts/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Create Contract
        </Link>
      </motion.div>

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {statusTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Contract Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredContracts.map((contract, i) => {
            const completedMilestones = contract.milestones.filter(m => m.status === 'Completed').length;
            const progress = (completedMilestones / contract.milestones.length) * 100;

            return (
              <motion.div
                key={contract.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 truncate">{contract.title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{contract.description}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${statusColors[contract.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {contract.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {contract.studentName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> ${contract.totalAmount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(contract.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Milestone Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500 font-medium">Milestones</span>
                    <span className="text-xs font-semibold text-slate-700">{completedMilestones}/{contract.milestones.length}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    />
                  </div>
                </div>

                <Link
                  to={`/company/contracts/${contract.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  View Contract <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredContracts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No contracts found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your filters or search query.</p>
        </motion.div>
      )}
    </div>
  );
};

export default CompanyContracts;
