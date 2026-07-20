import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  DollarSign,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { studentApi } from '../../services/api';
import { daysUntil, formatCurrency, formatDate, humanizeEnum } from '../../utils/formatters';

const statusColors = {
  ACTIVE: 'bg-blue-100 text-blue-700',
  FUNDED: 'bg-emerald-100 text-emerald-700',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
  SUBMITTED: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-green-100 text-green-700',
  DISPUTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-slate-100 text-slate-700',
};

const StudentContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    let cancelled = false;

    const loadContracts = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await studentApi.contracts();
        if (!cancelled) {
          setContracts(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load contracts.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadContracts();

    return () => {
      cancelled = true;
    };
  }, []);

  const statuses = ['ALL', 'ACTIVE', 'FUNDED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'DISPUTED', 'CANCELLED'];

  const filteredContracts = useMemo(() => {
    return statusFilter === 'ALL'
      ? contracts
      : contracts.filter((contract) => contract.status === statusFilter);
  }, [contracts, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">My Contracts</h1>
        <p className="text-slate-500 mt-1">Manage and track all of your active work.</p>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-500" />
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status === 'ALL' ? 'All' : humanizeEnum(status)}
            </button>
          ))}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid place-items-center min-h-[40vh] text-slate-500">
          Loading contracts...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredContracts.map((contract, index) => {
            const completedMilestones = contract.completed_milestones || 0;
            const totalMilestones = contract.milestone_count || 0;
            const progress = contract.progress_percent || 0;
            const daysLeft = daysUntil(contract.deadline);

            return (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  to={`/student/contracts/${contract.id}`}
                  className="block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-slate-400">{contract.id}</span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[contract.status] || 'bg-slate-100 text-slate-700'}`}>
                            {humanizeEnum(contract.status)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {contract.title}
                        </h3>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors mt-1" />
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {contract.company_name || 'Company'}
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                        {contract.milestone_count || 0} milestones
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <span className="text-2xl font-extrabold text-slate-900">
                        {formatCurrency(contract.total_amount || 0)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                        <span>Milestone Progress</span>
                        <span className="font-medium">{completedMilestones}/{totalMilestones}</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className={daysLeft !== null && daysLeft <= 7 ? 'text-amber-600 font-medium' : 'text-slate-500'}>
                          {daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days left` : 'Overdue') : 'No deadline set'}
                        </span>
                      </div>
                      <span className="text-sm text-blue-600 font-medium group-hover:underline">
                        View Contract →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoading && filteredContracts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No contracts found</h3>
          <p className="text-slate-500 mt-1">No contracts match the selected filter.</p>
        </motion.div>
      )}
    </div>
  );
};

export default StudentContracts;
