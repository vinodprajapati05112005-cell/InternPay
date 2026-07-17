import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle2,
  FileText, Layers, Eye, X, DollarSign, Calendar
} from 'lucide-react';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Full Stack', 'Web Design', 'UI/UX Design', 'Data Science', 'DevOps', 'Blockchain', 'Other'];
const PLATFORM_FEE_RATE = 0.025;

const CreateContract = () => {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    category: '',
    studentWallet: '',
  });

  const [milestones, setMilestones] = useState([
    { id: 1, title: '', description: '', amount: '', deadline: '', deliverables: [''], requirements: '' }
  ]);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const totalAmount = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
  const platformFee = totalAmount * PLATFORM_FEE_RATE;
  const grandTotal = totalAmount + platformFee;

  const validateStep1 = () => {
    const errs = {};
    if (!projectData.title.trim()) errs.title = 'Project title is required';
    if (!projectData.description.trim()) errs.description = 'Description is required';
    if (!projectData.category) errs.category = 'Please select a category';
    if (!projectData.studentWallet.trim()) errs.studentWallet = 'Student wallet address is required';
    else if (!projectData.studentWallet.startsWith('0x')) errs.studentWallet = 'Must be a valid wallet address starting with 0x';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    milestones.forEach((m, i) => {
      if (!m.title.trim()) errs[`m${i}_title`] = `Milestone ${i + 1} title is required`;
      if (!m.amount || parseFloat(m.amount) <= 0) errs[`m${i}_amount`] = `Milestone ${i + 1} amount must be greater than 0`;
      if (!m.deadline) errs[`m${i}_deadline`] = `Milestone ${i + 1} deadline is required`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now(), title: '', description: '', amount: '', deadline: '', deliverables: [''], requirements: '' }]);
  };

  const removeMilestone = (id) => {
    if (milestones.length > 1) setMilestones(milestones.filter(m => m.id !== id));
  };

  const updateMilestone = (id, field, value) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addDeliverable = (milestoneId) => {
    setMilestones(milestones.map(m => m.id === milestoneId ? { ...m, deliverables: [...m.deliverables, ''] } : m));
  };

  const updateDeliverable = (milestoneId, index, value) => {
    setMilestones(milestones.map(m => {
      if (m.id !== milestoneId) return m;
      const newDel = [...m.deliverables];
      newDel[index] = value;
      return { ...m, deliverables: newDel };
    }));
  };

  const removeDeliverable = (milestoneId, index) => {
    setMilestones(milestones.map(m => {
      if (m.id !== milestoneId) return m;
      if (m.deliverables.length <= 1) return m;
      return { ...m, deliverables: m.deliverables.filter((_, i) => i !== index) };
    }));
  };

  const handleSubmit = () => {
    if (!termsAccepted) {
      setErrors({ terms: 'You must accept the terms' });
      return;
    }
    setShowSuccess(true);
  };

  const stepLabels = [
    { num: 1, label: 'Project Details', icon: FileText },
    { num: 2, label: 'Milestones', icon: Layers },
    { num: 3, label: 'Review & Confirm', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/company/contracts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Contracts
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900">Create New Contract</h1>
        <p className="text-slate-500 mt-1">Set up an escrow contract for your project</p>
      </motion.div>

      {/* Step Indicator */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-2 mb-8">
        {stepLabels.map((s, i) => (
          <React.Fragment key={s.num}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              step === s.num ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' :
              step > s.num ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-slate-400 border border-slate-200'
            }`}>
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.num}</span>
            </div>
            {i < stepLabels.length - 1 && <div className={`w-8 h-0.5 ${step > s.num ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Form Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-3xl mx-auto"
      >
        {/* Step 1: Project Details */}
        {step === 1 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-xl font-semibold text-slate-900">Project Details</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title *</label>
              <input
                type="text"
                value={projectData.title}
                onChange={e => setProjectData({ ...projectData, title: e.target.value })}
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
                onChange={e => setProjectData({ ...projectData, description: e.target.value })}
                placeholder="Describe the project scope, goals, and expectations..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
              <select
                value={projectData.category}
                onChange={e => setProjectData({ ...projectData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student Wallet Address *</label>
              <input
                type="text"
                value={projectData.studentWallet}
                onChange={e => setProjectData({ ...projectData, studentWallet: e.target.value })}
                placeholder="0x..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
              {errors.studentWallet && <p className="text-red-500 text-xs mt-1">{errors.studentWallet}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Milestones */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Milestones</h2>
                <span className="text-sm font-semibold text-slate-500">Total: ${totalAmount.toLocaleString()}</span>
              </div>

              <div className="space-y-6">
                {milestones.map((milestone, mi) => (
                  <div key={milestone.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800 text-sm">Milestone {mi + 1}</h3>
                      {milestones.length > 1 && (
                        <button onClick={() => removeMilestone(milestone.id)} className="text-red-400 hover:text-red-600 transition-colors">
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
                          onChange={e => updateMilestone(milestone.id, 'title', e.target.value)}
                          placeholder="e.g. UI/UX Design"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors[`m${mi}_title`] && <p className="text-red-500 text-xs mt-1">{errors[`m${mi}_title`]}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (USDC) *</label>
                        <input
                          type="number"
                          value={milestone.amount}
                          onChange={e => updateMilestone(milestone.id, 'amount', e.target.value)}
                          placeholder="500"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors[`m${mi}_amount`] && <p className="text-red-500 text-xs mt-1">{errors[`m${mi}_amount`]}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={milestone.description}
                        onChange={e => updateMilestone(milestone.id, 'description', e.target.value)}
                        placeholder="Describe what needs to be delivered..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Deadline *</label>
                        <input
                          type="date"
                          value={milestone.deadline}
                          onChange={e => updateMilestone(milestone.id, 'deadline', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors[`m${mi}_deadline`] && <p className="text-red-500 text-xs mt-1">{errors[`m${mi}_deadline`]}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Requirements</label>
                        <input
                          type="text"
                          value={milestone.requirements}
                          onChange={e => updateMilestone(milestone.id, 'requirements', e.target.value)}
                          placeholder="Key requirements..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Deliverables</label>
                      <div className="space-y-2">
                        {milestone.deliverables.map((d, di) => (
                          <div key={di} className="flex gap-2">
                            <input
                              type="text"
                              value={d}
                              onChange={e => updateDeliverable(milestone.id, di, e.target.value)}
                              placeholder={`Deliverable ${di + 1}`}
                              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {milestone.deliverables.length > 1 && (
                              <button onClick={() => removeDeliverable(milestone.id, di)} className="text-red-400 hover:text-red-600 px-1">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button onClick={() => addDeliverable(milestone.id)} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Add Deliverable
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addMilestone}
                className="mt-4 w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Milestone
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-5">Review Contract</h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h3 className="font-semibold text-slate-800 text-sm">Project Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <p><span className="text-slate-500">Title:</span> <span className="font-medium text-slate-900">{projectData.title || '—'}</span></p>
                    <p><span className="text-slate-500">Category:</span> <span className="font-medium text-slate-900">{projectData.category || '—'}</span></p>
                    <p className="sm:col-span-2"><span className="text-slate-500">Student:</span> <span className="font-mono font-medium text-slate-900">{projectData.studentWallet || '—'}</span></p>
                    <p className="sm:col-span-2"><span className="text-slate-500">Description:</span> <span className="font-medium text-slate-900">{projectData.description || '—'}</span></p>
                  </div>
                </div>

                {milestones.map((m, i) => (
                  <div key={m.id} className="p-4 bg-slate-50 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-slate-800 text-sm">Milestone {i + 1}: {m.title || 'Untitled'}</h3>
                      <span className="font-semibold text-slate-900 text-sm">${parseFloat(m.amount || 0).toLocaleString()}</span>
                    </div>
                    {m.description && <p className="text-xs text-slate-500">{m.description}</p>}
                    {m.deadline && <p className="text-xs text-slate-500">Deadline: {new Date(m.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
                    {m.deliverables.filter(Boolean).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {m.deliverables.filter(Boolean).map((d, di) => (
                          <span key={di} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{d}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Totals */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Contract Amount</span><span className="font-semibold text-slate-900">${totalAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Platform Fee (2.5%)</span><span className="font-semibold text-slate-900">${platformFee.toFixed(2)}</span></div>
                    <div className="border-t border-blue-200 pt-2 flex justify-between"><span className="font-semibold text-slate-900">Total</span><span className="font-extrabold text-lg text-blue-700">${grandTotal.toFixed(2)}</span></div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => { setTermsAccepted(e.target.checked); setErrors({}); }}
                    className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">
                    I agree to the <Link to="/terms" className="text-blue-600 hover:underline font-medium">Terms of Service</Link> and understand that funds will be locked in a smart contract escrow until milestones are completed and approved.
                  </span>
                </label>
                {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <button onClick={prevStep} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : <div />}

          {step < 3 ? (
            <button onClick={nextStep} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
              <CheckCircle2 className="w-4 h-4" /> Create Escrow Contract
            </button>
          )}
        </div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Contract Created!</h3>
              <p className="text-slate-500 mb-6">Your escrow contract has been successfully created. You can now fund it to lock the funds.</p>
              <div className="space-y-3">
                <Link to="/company/contracts/CTR-001/fund" className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all">
                  Fund Contract Now
                </Link>
                <Link to="/company/contracts" className="block w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-100 border border-slate-200 transition-colors">
                  View All Contracts
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateContract;
