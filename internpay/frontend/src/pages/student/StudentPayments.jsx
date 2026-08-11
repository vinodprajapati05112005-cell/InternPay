import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowUpRight, Clock, CheckCircle2, ShieldAlert, ArrowRightCircle, RefreshCcw, Loader2 } from 'lucide-react';
import { studentApi } from '../../services/api';
import { formatTokenAmount, humanizeEnum } from '../../utils/formatters';

const PAYMENT_TRACKED_STATUSES = new Set([
  'FUNDED',
  'IN_PROGRESS',
  'SUBMITTED',
  'DISPUTED',
  'COMPLETED',
]);

const StudentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadPayments = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await studentApi.payments();
        if (!cancelled) {
          setPayments(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load payment history.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadPayments();

    return () => {
      cancelled = true;
    };
  }, []);

  const paymentEntries = useMemo(
    () => payments.filter((payment) => PAYMENT_TRACKED_STATUSES.has(String(payment.status || '').toUpperCase())),
    [payments],
  );

  const summary = useMemo(() => {
    const released = paymentEntries.reduce((sum, item) => sum + Number(item.released_amount || 0), 0);
    const pending = paymentEntries.reduce((sum, item) => sum + Number(item.pending_amount || 0), 0);
    const funded = paymentEntries.reduce((sum, item) => sum + Number(item.funded_amount || 0), 0);
    return {
      totalReleased: released,
      totalPending: pending,
      totalFunded: funded,
      totalContracts: paymentEntries.length,
    };
  }, [paymentEntries]);

  const getStatusBadge = (status) => {
    switch (String(status || '').toUpperCase()) {
      case 'FUNDED':
      case 'LOCKED':
      case 'LOCKED_IN_ESCROW':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ACTIVE':
      case 'IN_PROGRESS':
      case 'SUBMITTED':
      case 'EVALUATING':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED':
      case 'APPROVED':
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'DISPUTED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'REFUNDED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (String(status || '').toUpperCase()) {
      case 'COMPLETED':
      case 'APPROVED':
      case 'RESOLVED':
        return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'DISPUTED':
        return <ShieldAlert className="w-4 h-4 mr-1.5" />;
      case 'REFUNDED':
        return <RefreshCcw className="w-4 h-4 mr-1.5" />;
      case 'FUNDED':
        return <ArrowRightCircle className="w-4 h-4 mr-1.5" />;
      default:
        return <Clock className="w-4 h-4 mr-1.5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading payments...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Payments & Earnings</h1>
          <p className="text-slate-600">Track your escrow milestones and released funds.</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Wallet className="w-6 h-6" />
              </div>
              <h2 className="font-semibold text-emerald-50">Total Released</h2>
            </div>
            <div className="text-4xl font-extrabold">{formatTokenAmount(summary.totalReleased)}</div>
            <Link to="/student/contracts" className="mt-6 inline-flex px-4 py-2 bg-white text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-colors shadow-sm">
              Review Contracts
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="font-semibold text-slate-600">Pending Amount</h2>
            </div>
            <div className="text-4xl font-extrabold text-slate-900">{formatTokenAmount(summary.totalPending)}</div>
            <p className="mt-6 text-sm text-slate-500">Funds awaiting release or dispute resolution.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Contract Payment Summary</h3>
              <p className="text-sm text-slate-500 mt-1">{summary.totalContracts} contract{summary.totalContracts === 1 ? '' : 's'} tracked</p>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>Funded total: <span className="font-semibold text-slate-900">{formatTokenAmount(summary.totalFunded)}</span></p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                  <th className="p-4 pl-6">Contract</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Released</th>
                  <th className="p-4">Pending</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentEntries.map((payment) => (
                  <tr key={payment.contract_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-slate-900">{payment.contract_title}</div>
                      <div className="text-xs text-slate-500 mt-1 font-mono">{payment.contract_id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{formatTokenAmount(payment.total_amount)}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-emerald-700">{formatTokenAmount(payment.released_amount)}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-amber-700">{formatTokenAmount(payment.pending_amount)}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {humanizeEnum(payment.status)}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <Link to={`/student/contracts/${payment.contract_id}`} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        View contract
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {paymentEntries.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPayments;
