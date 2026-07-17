import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, GitBranch, PenTool, Globe, FileText, Video,
  MessageSquare, CheckSquare, Square, Send, Loader2,
  CheckCircle2, Sparkles, Code, Palette, Cpu, Target,
  FileSearch, AlertCircle
} from 'lucide-react';
import { mockContracts } from '../../data/mockData';

const SubmitWork = () => {
  const { id } = useParams();
  const contract = mockContracts.find(c => c.id === id);

  const [formData, setFormData] = useState({
    githubUrl: '',
    figmaUrl: '',
    liveDemoUrl: '',
    documentationUrl: '',
    videoUrl: '',
    notes: '',
  });

  const [checklist, setChecklist] = useState({
    requirementsReviewed: false,
    workCompleted: false,
    linksWorking: false,
    documentationReady: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  const processingSteps = [
    { label: 'Validating links...', icon: Globe, duration: 1000 },
    { label: 'Analyzing repository...', icon: Code, duration: 1500 },
    { label: 'Reviewing design...', icon: Palette, duration: 1000 },
    { label: 'Testing functionality...', icon: Cpu, duration: 1500 },
    { label: 'Matching requirements...', icon: Target, duration: 1000 },
    { label: 'Generating report...', icon: FileSearch, duration: 1000 },
  ];

  useEffect(() => {
    if (!isSubmitting || currentStep < 0) return;

    if (currentStep < processingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, processingSteps[currentStep].duration);
      return () => clearTimeout(timer);
    } else {
      setIsSubmitting(false);
      setIsComplete(true);
    }
  }, [isSubmitting, currentStep]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleChecklist = (field) => {
    setChecklist(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.githubUrl.trim()) newErrors.githubUrl = 'GitHub URL is required';
    if (!Object.values(checklist).every(Boolean)) newErrors.checklist = 'Please complete all checklist items';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setCurrentStep(0);
  };

  if (!contract) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Contract Not Found</h2>
          <Link to="/student/contracts" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Contracts
          </Link>
        </div>
      </div>
    );
  }

  // Success State
  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Work Submitted Successfully!</h2>
          <p className="text-slate-600 mb-6">
            AI evaluation report will be available shortly. You'll be notified once the evaluation is complete.
          </p>
          <div className="space-y-3">
            <Link
              to="/student/submissions/SUB-001/report"
              className="block w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
            >
              View Report
            </Link>
            <Link
              to={`/student/contracts/${id}`}
              className="block w-full px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
            >
              Back to Contract
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Processing State
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-lg w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-xl font-extrabold text-slate-900">AI Evaluation in Progress</h2>
            <p className="text-sm text-slate-500 mt-1">Analyzing your submission...</p>
          </div>

          <div className="space-y-3">
            {processingSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isDone = index < currentStep;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: index <= currentStep ? 1 : 0.4, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-blue-50 border border-blue-200' : isDone ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                  ) : (
                    <StepIcon className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-blue-700' : isDone ? 'text-emerald-700' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep + 1) / processingSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              />
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">
              Step {Math.min(currentStep + 1, processingSteps.length)} of {processingSteps.length}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Form State
  const urlFields = [
    { key: 'githubUrl', label: 'GitHub Repository URL', icon: GitBranch, placeholder: 'https://github.com/username/repo', required: true },
    { key: 'figmaUrl', label: 'PenTool Design URL', icon: PenTool, placeholder: 'https://figma.com/file/...', required: false },
    { key: 'liveDemoUrl', label: 'Live Demo URL', icon: Globe, placeholder: 'https://your-demo.vercel.app', required: false },
    { key: 'documentationUrl', label: 'Documentation URL', icon: FileText, placeholder: 'https://docs.your-project.dev', required: false },
    { key: 'videoUrl', label: 'Video Walkthrough URL', icon: Video, placeholder: 'https://loom.com/share/...', required: false },
  ];

  const checklistItems = [
    { key: 'requirementsReviewed', label: 'I have reviewed all requirements for this milestone' },
    { key: 'workCompleted', label: 'All deliverables are complete and functional' },
    { key: 'linksWorking', label: 'All submitted links are accessible and working' },
    { key: 'documentationReady', label: 'Documentation is up to date and comprehensive' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link to={`/student/contracts/${id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Contract
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold text-slate-900">Submit Work</h1>
        <p className="text-slate-500 mt-1">Submit your work for <span className="font-semibold text-slate-700">{contract.title}</span></p>
      </motion.div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        {/* Proof Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Proof of Work Links</h2>
          <p className="text-sm text-slate-500 mb-6">Provide links to your completed deliverables.</p>

          <div className="space-y-4">
            {urlFields.map(({ key, label, icon: Icon, placeholder, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                      errors[key] ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    } text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                  />
                </div>
                {errors[key] && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors[key]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Notes</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              placeholder="Describe your approach, any deviations from requirements, or additional context..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>
        </motion.div>

        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Submission Checklist</h2>
          <p className="text-sm text-slate-500 mb-4">Confirm you've completed all requirements before submitting.</p>

          <div className="space-y-3">
            {checklistItems.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleChecklist(key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  checklist[key] ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {checklist[key] ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <span className={`text-sm ${checklist[key] ? 'text-emerald-700 font-medium' : 'text-slate-600'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
          {errors.checklist && (
            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.checklist}
            </p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Submit Work for AI Evaluation
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default SubmitWork;
