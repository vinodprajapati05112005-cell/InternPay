import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  Layers,
  Eye,
  X,
  DollarSign,
  Calendar,
  Loader2,
  Shield,
} from 'lucide-react';
import { contractApi } from '../../services/api';
import { formatTokenAmount, formatDate, humanizeEnum } from '../../utils/formatters';

const CreateContract = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdContract, setCreatedContract] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    requirements: '',
    deadline: '',
    student_id: '',
    judge_id: '',
    notes: '',
  });

  const [milestones, setMilestones] = useState([
    { id: 1, title: '', description: '', amount: '', deadline: '' },
  ]);

  const totalAmount = useMemo(
    () => milestones.reduce((sum, milestone) => sum + (Number(milestone.amount) || 0), 0),
    [milestones],
  );

  const requirementsList = useMemo(
    () => projectData.requirements.split(/\n|,/).map((item) => item.trim()).filter(Boolean),
    [projectData.requirements],
  );

  const validateStep1 = () => {
    const nextErrors = {};
    if (!projectData.title.trim()) nextErrors.title = 'Project title is required';
    if (!projectData.description.trim()) nextErrors.description = 'Description is required';
    if (!projectData.deadline) nextErrors.deadline = 'Project deadline is required';
    if (!requirementsList.length) nextErrors.requirements = 'Add at least one requirement';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};
    milestones.forEach((milestone, index) => {
      if (!milestone.title.trim()) nextErrors[`m${index}_title`] = `Milestone ${index + 1} title is required`;
      if (!milestone.description.trim()) nextErrors[`m${index}_description`] = `Milestone ${index + 1} description is required`;
      if (!milestone.amount || Number(milestone.amount) <= 0) nextErrors[`m${index}_amount`] = `Milestone ${index + 1} amount must be greater than 0`;
      if (!milestone.deadline) nextErrors[`m${index}_deadline`] = `Milestone ${index + 1} deadline is required`;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((current) => current + 1);
  };

  const prevStep = () => setStep((current) => current - 1);

  const addMilestone = () => {
    setMilestones((current) => [
      ...current,
      { id: Date.now(), title: '', description: '', amount: '', deadline: '' },
    ]);
  };

  const removeMilestone = (milestoneId) => {
    setMilestones((current) => (current.length > 1 ? current.filter((milestone) => milestone.id !== milestoneId) : current));
  };

  const updateMilestone = (milestoneId, field, value) => {
    setMilestones((current) => current.map((milestone) => (milestone.id === milestoneId ? { ...milestone, [field]: value } : milestone)));
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      setErrors({ terms: 'You must accept the terms' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        title: projectData.title.trim(),
        description: projectData.description.trim(),
        requirements: requirementsList,
        deadline: new Date(projectData.deadline).toISOString(),
        currency: 'ETH',
        total_amount: totalAmount,
        notes: projectData.notes.trim(),
        student_id: projectData.student_id.trim() || null,
        judge_id: projectData.judge_id.trim() || null,
        milestones: milestones.map((milestone, index) => ({
          title: milestone.title.trim(),
          description: milestone.description.trim(),
          amount: Number(milestone.amount),
          deadline: new Date(milestone.deadline).toISOString(),
          order: index + 1,
        })),
      };

      const result = await contractApi.create(payload);
      setCreatedContract(result);
      setShowSuccess(true);
    } catch (saveError) {
      setErrors({ _form: saveError?.message || 'Unable to create the contract.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    { num: 1, label: 'Project Details', icon: FileText },
    { num: 2, label: 'Milestones', icon: Layers },
    { num: 3, label: 'Review', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/company/contracts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Contracts
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900">Create New Contract</h1>
        <p className="text-slate-500 mt-1">Set up an escrow contract for your project.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {stepLabels.map((item, index) => (
          <React.Fragment key={item.num}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${step === item.num ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : step > item.num ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-slate-400 border border-slate-200'}`}>
              {step > item.num ? <CheckCircle2 className="w-4 h-4" /> : <item.icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.num}</span>
            </div>
            {index < stepLabels.length - 1 && <div className={`w-8 h-0.5 ${step > item.num ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
          </React.Fragment>
        ))}
      </motion.div>

      {errors._form && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
        {step === 1 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-xl font-semibold text-slate-900">Project Details</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title *</label>
              <input
                type="text"
                value={projectData.title}
                onChange={(event) => setProjectData({ ...projectData, title: event.target.value })}
                placeholder="e.g. InternPay Landing Page"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
              <textarea
                rows={4}
                value={projectData.description}
                onChange={(event) => setProjectData({ ...projectData, description: event.target.value })}
                placeholder="Describe the project scope, goals, and expectations..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Requirements *</label>
              <textarea
                rows={3}
                value={projectData.requirements}
                onChange={(event) => setProjectData({ ...projectData, requirements: event.target.value })}
                placeholder="One requirement per line, or separated by commas"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {errors.requirements && <p className="text-red-500 text-xs mt-1">{errors.requirements}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Deadline *</label>
                <input
                  type="datetime-local"
                  value={projectData.deadline}
                  onChange={(event) => setProjectData({ ...projectData, deadline: event.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Total Amount</label>
                <div className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900">
                  {formatTokenAmount(totalAmount)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student UUID (optional)</label>
                <input
                  type="text"
                  value={projectData.student_id}
                  onChange={(event) => setProjectData({ ...projectData, student_id: event.target.value })}
                  placeholder="Student UUID"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judge UUID (optional)</label>
                <input
                  type="text"
                  value={projectData.judge_id}
                  onChange={(event) => setProjectData({ ...projectData, judge_id: event.target.value })}
                  placeholder="Judge UUID"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes</label>
              <textarea
                rows={3}
                value={projectData.notes}
                onChange={(event) => setProjectData({ ...projectData, notes: event.target.value })}
                placeholder="Optional notes for the contract"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Milestones</h2>
                <span className="text-sm font-semibold text-slate-500">Total: {formatTokenAmount(totalAmount)}</span>
              </div>

              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800 text-sm">Milestone {index + 1}</h3>
                      {milestones.length > 1 && (
                        <button type="button" onClick={() => removeMilestone(milestone.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(event) => updateMilestone(milestone.id, 'title', event.target.value)}
                          placeholder="e.g. UI/UX Design"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors[`m${index}_title`] && <p className="text-red-500 text-xs mt-1">{errors[`m${index}_title`]}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (ETH) *</label>
                        <input
                          type="number"
                          step="0.000001"
                          inputMode="decimal"
                          value={milestone.amount}
                          onChange={(event) => updateMilestone(milestone.id, 'amount', event.target.value)}
                          placeholder="0.001"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors[`m${index}_amount`] && <p className="text-red-500 text-xs mt-1">{errors[`m${index}_amount`]}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Description *</label>
                      <textarea
                        rows={3}
                        value={milestone.description}
                        onChange={(event) => updateMilestone(milestone.id, 'description', event.target.value)}
                        placeholder="Describe what needs to be delivered..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      {errors[`m${index}_description`] && <p className="text-red-500 text-xs mt-1">{errors[`m${index}_description`]}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Deadline *</label>
                      <input
                        type="datetime-local"
                        value={milestone.deadline}
                        onChange={(event) => updateMilestone(milestone.id, 'deadline', event.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors[`m${index}_deadline`] && <p className="text-red-500 text-xs mt-1">{errors[`m${index}_deadline`]}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addMilestone}
                className="mt-4 w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Milestone
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-5">Review Contract</h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h3 className="font-semibold text-slate-800 text-sm">Project Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <p><span className="text-slate-500">Title:</span> <span className="font-medium text-slate-900">{projectData.title || '—'}</span></p>
                    <p><span className="text-slate-500">Deadline:</span> <span className="font-medium text-slate-900">{projectData.deadline ? formatDate(projectData.deadline) : '—'}</span></p>
                    <p className="sm:col-span-2"><span className="text-slate-500">Student UUID:</span> <span className="font-mono font-medium text-slate-900">{projectData.student_id || '—'}</span></p>
                    <p className="sm:col-span-2"><span className="text-slate-500">Judge UUID:</span> <span className="font-mono font-medium text-slate-900">{projectData.judge_id || '—'}</span></p>
                    <p className="sm:col-span-2"><span className="text-slate-500">Description:</span> <span className="font-medium text-slate-900">{projectData.description || '—'}</span></p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <h3 className="font-semibold text-slate-800 text-sm">Requirements</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {requirementsList.length > 0 ? requirementsList.map((item) => (
                      <span key={item} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                        {item}
                      </span>
                    )) : <span className="text-xs text-slate-500">No requirements provided.</span>}
                  </div>
                </div>

                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="p-4 bg-slate-50 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-slate-800 text-sm">Milestone {index + 1}: {milestone.title || 'Untitled'}</h3>
                      <span className="font-semibold text-slate-900 text-sm">{formatTokenAmount(Number(milestone.amount || 0))}</span>
                    </div>
                    <p className="text-xs text-slate-500 whitespace-pre-wrap">{milestone.description || 'No description provided.'}</p>
                    <p className="text-xs text-slate-500">Deadline: {milestone.deadline ? formatDate(milestone.deadline) : '—'}</p>
                  </div>
                ))}

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Contract Amount</span><span className="font-semibold text-slate-900">{formatTokenAmount(totalAmount)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Milestones</span><span className="font-semibold text-slate-900">{milestones.length}</span></div>
                    <div className="border-t border-blue-200 pt-2 flex justify-between"><span className="font-semibold text-slate-900">Currency</span><span className="font-extrabold text-lg text-blue-700">ETH</span></div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => {
                      setTermsAccepted(event.target.checked);
                      setErrors({});
                    }}
                    className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">
                    I agree to the <Link to="/terms" className="text-blue-600 hover:underline font-medium">Terms of Service</Link> and understand that funds will be locked in escrow until milestones are completed and approved.
                  </span>
                </label>
                {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          ) : <div />}

          {step < 3 ? (
            <button type="button" onClick={nextStep} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Create Escrow Contract
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Contract Created!</h3>
              <p className="text-slate-500 mb-6">Your escrow contract has been created successfully.</p>
              <div className="space-y-3">
                {createdContract?.id && (
                  <Link to={`/company/contracts/${createdContract.id}`} className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all">
                    View Contract Details
                  </Link>
                )}
                {createdContract?.id && (
                  <Link to={`/company/contracts/${createdContract.id}/fund`} className="block w-full py-3 bg-white text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 border border-slate-200 transition-colors">
                    Fund Contract Now
                  </Link>
                )}
                <button onClick={() => setShowSuccess(false)} className="block w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-100 border border-slate-200 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateContract;
