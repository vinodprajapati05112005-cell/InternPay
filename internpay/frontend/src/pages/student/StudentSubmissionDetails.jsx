import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockSubmissions } from '../../data/mockData';
import { ArrowLeft, CheckCircle2, Clock, FileText, Link as LinkIcon, AlertCircle, BarChart3, ChevronRight } from 'lucide-react';

export default function StudentSubmissionDetails() {
  const { id } = useParams();
  const submission = mockSubmissions.find(s => s.id === id) || mockSubmissions[0] || {
    id: id || '1',
    projectName: 'Frontend Development',
    milestoneTitle: 'Phase 1 Delivery',
    status: 'Pending Evaluation',
    aiScore: 87,
    notes: 'Implemented the core React components based on the PenTool design. All tests are passing.',
    links: ['https://github.com/alexchen/project-repo', 'https://deploy-preview.app']
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending Evaluation': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Disputed': return 'bg-red-100 text-red-700 border-red-200';
      case 'Needs Revision': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/student/submissions" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Submissions
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{submission.projectName}</h1>
            <p className="text-slate-500 mt-1">Milestone: {submission.milestoneTitle}</p>
          </div>
          <div className={`px-4 py-1.5 rounded-full border font-medium text-sm flex items-center ${getStatusColor(submission.status)}`}>
            {submission.status === 'Approved' ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
            {submission.status || 'Pending'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                Submission Notes
              </h2>
              <p className="text-slate-600 whitespace-pre-wrap">{submission.notes || 'No notes provided by the student.'}</p>
              
              <h3 className="text-sm font-semibold text-slate-900 mt-6 mb-3">Proof of Work Links</h3>
              <div className="space-y-3">
                {(submission.links || ['https://github.com/alexchen/project']).map((link, i) => (
                  <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-slate-700">
                    <LinkIcon className="w-4 h-4 mr-3 text-indigo-500" />
                    <span className="truncate text-sm">{link}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
                AI Evaluation
              </h2>
              
              {submission.aiScore ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Overall Score</span>
                    <span className="text-2xl font-extrabold text-indigo-600">{submission.aiScore}/100</span>
                  </div>
                  
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${submission.aiScore}%` }}></div>
                  </div>
                  
                  <Link 
                    to={`/student/submissions/${submission.id}/report`}
                    className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
                  >
                    View Full Report
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">Evaluation in progress</p>
                  <p className="text-sm text-slate-500 mt-1">Our AI is analyzing your code</p>
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="font-semibold mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-indigo-300" />
                What happens next?
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Once the AI evaluation is complete, you'll have a 24-hour window to review the results and raise any disputes before funds are released.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
