import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle, ArrowRight, Calendar, DollarSign, Brain,
  Clock, Shield, Tag
} from 'lucide-react';
import { mockDisputes } from '../../data/mockData';

const statusColors = {
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending': 'bg-blue-50 text-blue-700 border-blue-200',
  'Dismissed': 'bg-slate-50 text-slate-600 border-slate-200',
};

const priorityColors = {
  'High': 'bg-rose-50 text-rose-700 border-rose-200',
  'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
  'Low': 'bg-blue-50 text-blue-700 border-blue-200',
};

const getScoreColor = (score) => {
  if (score >= 85) return 'text-emerald-600 bg-emerald-50';
  if (score >= 70) return 'text-amber-600 bg-amber-50';
  return 'text-rose-600 bg-rose-50';
};

const CompanyDisputes = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
          Disputes
        </h1>
        <p className="text-slate-500 mt-1">{mockDisputes.length} active dispute{mockDisputes.length !== 1 ? 's' : ''}</p>
      </motion.div>

      {/* Dispute Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockDisputes.map((dispute, i) => (
          <motion.div
            key={dispute.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{dispute.projectTitle}</h3>
                <p className="text-sm text-slate-500">{dispute.id} · {dispute.reason}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusColors[dispute.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {dispute.status}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${priorityColors[dispute.priority] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {dispute.priority} Priority
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Tag className="w-3.5 h-3.5" />
                <span>{dispute.category}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <DollarSign className="w-3.5 h-3.5" />
                <span>${dispute.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Brain className="w-3.5 h-3.5 text-slate-400" />
                <span className={`font-semibold px-1.5 py-0.5 rounded-md text-xs ${getScoreColor(dispute.aiScore)}`}>
                  {dispute.aiScore}/100
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(dispute.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <Link
              to={`/company/disputes/${dispute.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        ))}
      </div>

      {mockDisputes.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No disputes</h3>
          <p className="text-slate-500 mt-1">All submissions have been approved without disputes.</p>
        </motion.div>
      )}
    </div>
  );
};

export default CompanyDisputes;
