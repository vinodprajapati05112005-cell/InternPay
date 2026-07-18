import React, { useEffect, useMemo, useState } from 'react';
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
  Loader2,
  Bot,
  DollarSign,
  Calendar,
  FileText,
} from 'lucide-react';
import { disputeApi, judgeApi } from '../../services/api';
import { compactHash, formatCurrency, formatDateTime, humanizeEnum } from '../../utils/formatters';

const statusStyles = {
  OPEN: 'bg-blue-100 text-blue-700',
  ASSIGNED: 'bg-amber-100 text-amber-700',
  UNDER_REVIEW: 'bg-indigo-100 text-indigo-700',
  PARTIALLY_RESOLVED: 'bg-purple-100 text-purple-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  CLOSED: 'bg-slate-100 text-slate-700',
  EXPIRED: 'bg-slate-100 text-slate-700',
};

const statusIcons = {
  OPEN: AlertTriangle,
  ASSIGNED: Clock,
  UNDER_REVIEW: Bot,
  PARTIALLY_RESOLVED: Clock,
  RESOLVED: CheckCircle2,
  REJECTED: AlertTriangle,
  CLOSED: CheckCircle2,
  EXPIRED: Clock,
};

const JudgeDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [disputeData, dashboardData] = await Promise.all([
          disputeApi.list(),
          judgeApi.dashboard(),
        ]);

        if (!cancelled) {
          setDisputes(Array.isArray(disputeData) ? disputeData : []);
          setDashboard(dashboardData || null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load disputes.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return disputes.filter((dispute) => {
      const status = String(dispute.status || '').toUpperCase();
      const matchesSearch =
        !term ||
        [dispute.contract_title, dispute.project_title, dispute.milestone_title, dispute.company_name, dispute.student_name, dispute.filed_by_name, dispute.reason, dispute.id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      const matchesStatus = filterStatus === 'ALL' || status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [disputes, filterStatus, searchTerm]);

  const stats = useMemo(() => {
    const total = disputes.length;
    const resolved = disputes.filter((item) => ['RESOLVED', 'PARTIALLY_RESOLVED', 'CLOSED'].includes(String(item.status).toUpperCase())).length;
    const open = disputes.filter((item) => ['OPEN', 'ASSIGNED', 'UNDER_REVIEW'].includes(String(item.status).toUpperCase())).length;
    const averageAmount = total ? disputes.reduce((sum, item) => sum + Number(item.disputed_amount || 0), 0) / total : 0;
    return { total, resolved, open, averageAmount };
  }, [disputes]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading disputes...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <Link to="/judge/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Dispute Cases</h1>
        <p className="mt-2 text-slate-500 text-lg">Review and resolve the disputes assigned to you.</p>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Cases', value: stats.total, icon: FileText },
          { label: 'Open Cases', value: stats.open, icon: AlertTriangle },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2 },
          { label: 'Avg Amount', value: formatCurrency(stats.averageAmount), icon: DollarSign },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
              <stat.icon className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search disputes by project, company, or ID..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
                className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="PARTIALLY_RESOLVED">Partially Resolved</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((dispute, index) => {
            const status = String(dispute.status || '').toUpperCase();
            const StatusIcon = statusIcons[status] || Clock;

            return (
              <motion.div
                key={dispute.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-slate-400">{compactHash(dispute.id)}</span>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${statusStyles[status] || 'bg-slate-100 text-slate-600'}`}>
                        <StatusIcon className="w-3 h-3" />
                        {humanizeEnum(status)}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {humanizeEnum(dispute.reason)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{dispute.project_title || dispute.contract_title}</h3>
                    <p className="text-sm text-slate-500 mb-3">
                      Filed by {dispute.filed_by_name} - {dispute.company_name}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        {dispute.milestone_title || 'Milestone'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        {formatCurrency(dispute.disputed_amount)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5" />
                        AI Score: {dispute.ai_score ?? '--'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Filed: {formatDateTime(dispute.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(dispute.disputed_amount)}</p>
                      <p className="text-xs text-slate-400">ID {compactHash(dispute.id, 4, 4)}</p>
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

                {dispute.decision && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">Decision: </span>
                      {humanizeEnum(dispute.decision)}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <Scale className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-semibold text-slate-900">No disputes found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JudgeDisputes;
