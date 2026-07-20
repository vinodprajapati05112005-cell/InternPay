import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  DollarSign,
  Brain,
  Clock,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { disputeApi } from '../../services/api';
import { formatCurrency, formatDate, humanizeEnum } from '../../utils/formatters';

const statusColors = {
  OPEN: 'bg-amber-50 text-amber-700 border-amber-200',
  ASSIGNED: 'bg-blue-50 text-blue-700 border-blue-200',
  UNDER_REVIEW: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  PARTIALLY_RESOLVED: 'bg-violet-50 text-violet-700 border-violet-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
};

const CompanyDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadDisputes = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await disputeApi.list();
        if (!cancelled) {
          setDisputes(Array.isArray(data) ? data : []);
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

    void loadDisputes();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeCount = useMemo(() => disputes.filter((dispute) => ['OPEN', 'ASSIGNED', 'UNDER_REVIEW'].includes(dispute.status)).length, [disputes]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
          Disputes
        </h1>
        <p className="text-slate-500 mt-1">{activeCount} active dispute{activeCount === 1 ? '' : 's'}</p>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="grid place-items-center min-h-[40vh] text-slate-500">
          Loading disputes...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disputes.map((dispute, index) => (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{dispute.project_title || dispute.contract_title || 'Dispute'}</h3>
                  <p className="text-sm text-slate-500">{dispute.id} · {dispute.reason ? humanizeEnum(dispute.reason) : 'No reason provided'}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusColors[dispute.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {humanizeEnum(dispute.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{formatCurrency(dispute.disputed_amount || 0)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Brain className="w-3.5 h-3.5" />
                  <span>{dispute.ai_score !== null && dispute.ai_score !== undefined ? `${dispute.ai_score}/100` : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(dispute.created_at)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{dispute.dispute_deadline ? formatDate(dispute.dispute_deadline) : 'No deadline'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  Filed by <span className="font-semibold text-slate-700">{dispute.filed_by_name || 'Unknown'}</span>
                </p>
                <Link
                  to={`/company/disputes/${dispute.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {dispute.decision && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">Decision:</span> {humanizeEnum(dispute.decision)}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && disputes.length === 0 && (
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
