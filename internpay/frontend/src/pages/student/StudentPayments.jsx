import React from 'react';
import { mockPayments } from '../../data/mockData';
import { Wallet, ArrowUpRight, Clock, CheckCircle2, ShieldAlert, ArrowRightCircle, RefreshCcw } from 'lucide-react';

export default function StudentPayments() {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Funds Locked': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Evaluation Pending': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Dispute Window Active': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Released': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Refunded': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Disputed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Released': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'Disputed': return <ShieldAlert className="w-4 h-4 mr-1.5" />;
      case 'Refunded': return <RefreshCcw className="w-4 h-4 mr-1.5" />;
      case 'Approved': return <ArrowRightCircle className="w-4 h-4 mr-1.5" />;
      default: return <Clock className="w-4 h-4 mr-1.5" />;
    }
  };

  const paymentList = mockPayments || [];
  
  const totalEarnings = paymentList
    .filter(p => p.status === 'Released')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingEarnings = paymentList
    .filter(p => p.status !== 'Released' && p.status !== 'Refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Payments & Earnings</h1>
          <p className="text-slate-600">Track your escrow milestones and released funds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Wallet className="w-6 h-6" />
              </div>
              <h2 className="font-semibold text-emerald-50">Total Available</h2>
            </div>
            <div className="text-4xl font-extrabold">${totalEarnings.toLocaleString()} <span className="text-lg font-medium text-emerald-200">USDC</span></div>
            <button className="mt-6 px-4 py-2 bg-white text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-colors shadow-sm w-full md:w-auto">
              Withdraw Funds
            </button>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="font-semibold text-slate-600">Locked in Escrow</h2>
            </div>
            <div className="text-4xl font-extrabold text-slate-900">${pendingEarnings.toLocaleString()} <span className="text-lg font-medium text-slate-400">USDC</span></div>
            <p className="mt-6 text-sm text-slate-500">Funds awaiting AI evaluation or dispute resolution.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                  <th className="p-4 pl-6">Contract / Milestone</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 pr-6">Tx Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentList.map((payment, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-slate-900">{payment.contractName || payment.contract || 'Project Milestone'}</div>
                      <div className="text-xs text-slate-500 mt-1">{payment.milestone || 'Milestone Delivery'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">${payment.amount}</div>
                      <div className="text-xs text-slate-500">USDC</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{payment.date}</td>
                    <td className="p-4 pr-6">
                      <a href="#" className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-mono">
                        {payment.txHash ? `${payment.txHash.substring(0, 6)}...${payment.txHash.substring(payment.txHash.length - 4)}` : '0x12...34ab'}
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </a>
                    </td>
                  </tr>
                ))}
                {paymentList.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No transactions found.
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
}
