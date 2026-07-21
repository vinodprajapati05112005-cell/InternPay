import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  GitBranch,
  PenTool,
  Globe,
  FileText,
  Video,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  Code,
  Palette,
  Cpu,
  Target,
  AlertCircle,
} from 'lucide-react';
import { contractApi, submissionApi } from '../../services/api';
import { formatCurrency, formatDate, humanizeEnum } from '../../utils/formatters';

const SubmitWork = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('');
  const [formData, setFormData] = useState({
    github_url: '',
    figma_url: '',
    demo_url: '',
    documentation_url: '',
    video_url: '',
    additional_notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadContract = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const data = await contractApi.detail(id);
      setContract(data || null);
      const firstMilestone = data?.milestones?.find((milestone) => milestone.status !== 'APPROVED' && milestone.status !== 'CANCELLED');
      setSelectedMilestoneId(firstMilestone?.id || data?.milestones?.[0]?.id || '');
    } catch (loadError) {
      setErrors({ _form: loadError?.message || 'Unable to load the contract.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadContract();
  }, [id]);


  const selectedMilestone = useMemo(() => {
    return contract?.milestones?.find((milestone) => milestone.id === selectedMilestoneId) || null;
  }, [contract, selectedMilestoneId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!selectedMilestoneId) {
      nextErrors.milestone = 'Please choose a milestone';
    }
    if (!formData.github_url.trim()) {
      nextErrors.github_url = 'GitHub URL is required';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submission = await submissionApi.create({
        contract_id: id,
        milestone_id: selectedMilestoneId,
        github_url: formData.github_url.trim(),
        demo_url: formData.demo_url.trim(),
        figma_url: formData.figma_url.trim(),
        documentation_url: formData.documentation_url.trim(),
        video_url: formData.video_url.trim(),
        additional_notes: formData.additional_notes.trim(),
      });

      setSuccessMessage('Work submitted successfully. Redirecting to your AI report...');
      navigate(`/student/submissions/${submission.id}/report`, { replace: true });
    } catch (submitError) {
      setErrors({ _form: submitError?.message || 'Unable to submit your work right now.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-9 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-5 w-80 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
                <div className="space-y-3">
                  <div className="h-16 w-full bg-slate-100 rounded-xl animate-pulse" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-52 bg-slate-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-slate-100 rounded-xl animate-pulse" />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded-pulse" />
                <div className="h-4 w-3/4 bg-slate-100 rounded-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errors._form && !contract) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-rose-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Failed to Load Contract</h2>
          <p className="text-slate-500 mt-2 text-sm">{errors._form}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => void loadContract()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow"
            >
              Retry Loading
            </button>
            <Link
              to="/student/contracts"
              className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm transition-all"
            >
              Back to Contracts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Contract Not Found</h2>
          <p className="text-slate-500 mt-2 text-sm">We could not locate the requested contract details.</p>
          <Link to="/student/contracts" className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Contracts
          </Link>
        </div>
      </div>
    );
  }

  const milestoneOptions = contract.milestones || [];

  if (milestoneOptions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link to={`/student/contracts/${id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Contract
          </Link>
        </motion.div>

        <div className="max-w-2xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center"
          >
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-200">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Milestones Defined</h2>
            <p className="text-slate-500 mb-6 text-sm max-w-md mx-auto">
              No milestones are available for this contract yet. The company must add a milestone before you can submit work.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to={`/student/contracts/${id}`}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow transition-all"
              >
                View Contract Details
              </Link>
              <Link
                to="/student/contracts"
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm transition-all"
              >
                Back to My Contracts
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }


  const processingSteps = [
    { label: 'Validating links...', icon: Globe },
    { label: 'Submitting to backend...', icon: Send },
    { label: 'Triggering AI evaluation...', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to={`/student/contracts/${id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Contract
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Submit Work</h1>
        <p className="text-slate-500 mt-1 break-words whitespace-normal max-w-full">
          Submit your work for <span className="font-semibold text-slate-700 break-words">{contract.title}</span>
        </p>
      </motion.div>


      {successMessage && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      {errors._form && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Choose Milestone</h2>
            <p className="text-sm text-slate-500 mb-4">Select the milestone you want to submit for review.</p>
            <div className="space-y-3">
              {milestoneOptions.length > 0 ? (
                milestoneOptions.map((milestone) => (
                  <button
                    key={milestone.id}
                    type="button"
                    onClick={() => setSelectedMilestoneId(milestone.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedMilestoneId === milestone.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          Milestone {milestone.order}: {milestone.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {humanizeEnum(milestone.status)} · Due {formatDate(milestone.deadline)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{formatCurrency(milestone.amount)}</span>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-slate-500">No milestones are attached to this contract yet.</p>
              )}
            </div>
            {errors.milestone && <p className="mt-2 text-sm text-red-600">{errors.milestone}</p>}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Proof of Work Links</h2>
            <p className="text-sm text-slate-500 mb-6">Add the links your company can review.</p>

            <div className="space-y-4">
              {[
                { key: 'github_url', label: 'GitHub Repository URL', icon: GitBranch, placeholder: 'https://github.com/username/repo' },
                { key: 'figma_url', label: 'Design / Figma URL', icon: PenTool, placeholder: 'https://figma.com/file/...' },
                { key: 'demo_url', label: 'Live Demo URL', icon: Globe, placeholder: 'https://your-demo.vercel.app' },
                { key: 'documentation_url', label: 'Documentation URL', icon: FileText, placeholder: 'https://docs.your-project.dev' },
                { key: 'video_url', label: 'Video Walkthrough URL', icon: Video, placeholder: 'https://loom.com/share/...' },
              ].map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      value={formData[key]}
                      onChange={(event) => handleChange(key, event.target.value)}
                      placeholder={placeholder}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                        errors[key] ? 'border-red-300 bg-red-50' : 'border-slate-200'
                      } text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                    />
                  </div>
                  {errors[key] && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Notes</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                value={formData.additional_notes}
                onChange={(event) => handleChange('additional_notes', event.target.value)}
                rows={4}
                placeholder="Describe your approach, any caveats, or context the reviewer should know..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Submit Work for AI Evaluation
                </>
              )}
            </button>
          </motion.div>
        </form>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Contract Summary</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Contract</p>
                <p className="font-semibold text-slate-900 mt-1 break-words">{contract.title}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Company</p>
                <p className="font-semibold text-slate-900 mt-1">{contract.company_name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Total Amount</p>
                <p className="font-semibold text-slate-900 mt-1">{formatCurrency(contract.total_amount)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Deadline</p>
                <p className="font-semibold text-slate-900 mt-1">{formatDate(contract.deadline)}</p>
              </div>
            </div>
          </div>

          {selectedMilestone && (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="font-semibold mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2 text-indigo-300" />
                Selected Milestone
              </h3>
              <p className="text-lg font-bold">{selectedMilestone.title}</p>
              <p className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{selectedMilestone.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-300">Amount</span>
                <span className="font-semibold">{formatCurrency(selectedMilestone.amount)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">Status</span>
                <span className="font-semibold">{humanizeEnum(selectedMilestone.status)}</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Submission Checklist</h3>
            <div className="space-y-3 text-sm text-slate-600">
              {[
                'Repository and demo links are working',
                'The selected milestone matches the work submitted',
                'Additional notes mention any known caveats',
                'The submission is ready for AI evaluation',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-3">AI Review Flow</h3>
            <div className="space-y-2 text-sm text-slate-600">
              {processingSteps.map((step) => (
                <div key={step.label} className="flex items-center gap-2">
                  <step.icon className="w-4 h-4 text-blue-500" />
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitWork;
