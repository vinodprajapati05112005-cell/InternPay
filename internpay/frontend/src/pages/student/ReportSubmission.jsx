import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockSubmissions } from '../../data/mockData';
import { ArrowLeft, CheckCircle, ShieldAlert, FileText, Check, X, AlertTriangle, Clock, ThumbsUp, Code, Layout, Settings, FileCheck } from 'lucide-react';

export default function ReportSubmission() {
  const { id } = useParams();
  const submission = mockSubmissions.find(s => s.id === id) || { 
    id, 
    projectName: 'Smart Contract Audit', 
    milestoneTitle: 'Final Report',
    date: '2026-07-15'
  };
  
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    alert('Dispute submitted successfully. A human judge will review your case.');
    setShowDisputeModal(false);
  };

  const dimensions = [
    { name: 'Code Quality', score: 91, weight: 30, icon: Code, desc: 'Cleanliness, structure, and best practices' },
    { name: 'Design Quality', score: 84, weight: 25, icon: Layout, desc: 'UI/UX implementation and responsiveness' },
    { name: 'Functionality', score: 88, weight: 25, icon: Settings, desc: 'Bug-free execution and performance' },
    { name: 'Requirement Match', score: 85, weight: 20, icon: FileCheck, desc: 'Adherence to milestone specifications' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter pb-20">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to={`/student/submissions/${id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Submission
        </Link>
        
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">AI Evaluation Report</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center"><FileText className="w-4 h-4 mr-1.5" /> {submission.projectName}</span>
                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5" /> {submission.milestoneTitle}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> Submitted: {submission.date || 'Today'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl border border-emerald-200 font-semibold">
              <Check className="w-5 h-5" />
              RECOMMENDATION: APPROVE
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Score - Dark Card */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-2xl p-8 shadow-xl text-white h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              
              <h2 className="text-lg font-medium text-slate-300 mb-6 z-10">Overall AI Score</h2>
              
              <div className="relative w-48 h-48 flex items-center justify-center z-10 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - 0.87)} className="text-indigo-500 transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold text-white tracking-tighter">87</span>
                  <span className="text-slate-400 font-medium">/100</span>
                </div>
              </div>
              
              <p className="text-indigo-200 font-medium z-10">Excellent Work</p>
            </div>
          </div>

          {/* Dimension Bars */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Evaluation Dimensions</h2>
            <div className="space-y-6">
              {dimensions.map((dim, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                        <dim.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">{dim.name}</span>
                        <span className="text-xs text-slate-500 ml-2">Weight: {dim.weight}%</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-700">{dim.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${dim.score >= 90 ? 'bg-emerald-500' : dim.score >= 80 ? 'bg-indigo-500' : 'bg-orange-500'}`} 
                      style={{ width: `${dim.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500">{dim.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <ThumbsUp className="w-5 h-5 mr-2 text-emerald-500" />
              Strengths
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-sm text-slate-700">
                <Check className="w-4 h-4 mr-2 text-emerald-500 mt-0.5 shrink-0" />
                Excellent component modularity and reusability in React components.
              </li>
              <li className="flex items-start text-sm text-slate-700">
                <Check className="w-4 h-4 mr-2 text-emerald-500 mt-0.5 shrink-0" />
                Strong adherence to the provided design system using Tailwind CSS.
              </li>
              <li className="flex items-start text-sm text-slate-700">
                <Check className="w-4 h-4 mr-2 text-emerald-500 mt-0.5 shrink-0" />
                State management is handled efficiently without unnecessary re-renders.
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-sm text-slate-700">
                <X className="w-4 h-4 mr-2 text-orange-500 mt-0.5 shrink-0" />
                Missing error boundary implementations for robust error handling.
              </li>
              <li className="flex items-start text-sm text-slate-700">
                <X className="w-4 h-4 mr-2 text-orange-500 mt-0.5 shrink-0" />
                Some mobile responsive edge cases on smaller screens (below 380px).
              </li>
            </ul>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">AI Reasoning Summary</h3>
          <p className="text-slate-700 leading-relaxed text-sm md:text-base">
            The submission successfully implements the core requirements outlined in the milestone brief. The architecture demonstrates a solid understanding of modern React patterns. While there are minor responsive issues and a lack of global error handling, these do not significantly impede the core functionality. The overall quality comfortably meets the threshold for approval. The code is well-commented and easy to follow, making it highly maintainable for future iterations.
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-indigo-900">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold">Dispute Window</p>
              <p className="text-sm text-indigo-700 font-mono font-medium">{formatTime(timeLeft)} remaining</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowDisputeModal(true)}
              className="flex-1 md:flex-none px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors shadow-sm"
            >
              File Dispute
            </button>
            <button 
              className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
              onClick={() => alert('Result accepted. Funds will be released shortly.')}
            >
              Accept Result
            </button>
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <ShieldAlert className="w-6 h-6 mr-2 text-red-500" />
                File a Dispute
              </h3>
              <button onClick={() => setShowDisputeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleDisputeSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Reason for dispute</label>
                <textarea 
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  placeholder="Explain why you disagree with the AI evaluation..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                ></textarea>
                <p className="text-xs text-slate-500 mt-2">Disputes will be reviewed by a human judge. This process may take up to 48 hours.</p>
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowDisputeModal(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 text-white font-medium hover:bg-red-700 rounded-xl transition-colors shadow-md"
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
