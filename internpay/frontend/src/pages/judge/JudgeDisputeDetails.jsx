import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Scale,
  FileText,
  GitBranch,
  PenTool,
  Globe,
  BookOpen,
  Video,
  Bot,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  User,
  Building2,
  Calendar,
  ExternalLink,
  Shield,
  MessageSquare,
  Link as LinkIcon,
  X,
  Gavel,
  Target,
  Loader2,
} from 'lucide-react';
import { contractApi, disputeApi, submissionApi } from '../../services/api';
import { compactHash, formatDateTime, formatTokenAmount, humanizeEnum } from '../../utils/formatters';

const decisionButtons = [
  {
    value: 'RELEASE_PAYMENT',
    label: 'Approve Payment',
    description: 'Release the milestone amount to the student.',
    icon: CheckCircle2,
    tone: 'emerald',
  },
  {
    value: 'REFUND_COMPANY',
    label: 'Reject and Refund',
    description: 'Refund the contract amount to the company.',
    icon: XCircle,
    tone: 'red',
  },
  {
    value: 'PARTIAL_PAYMENT',
    label: 'Partial Payment',
    description: 'Split the disputed milestone with a custom percentage.',
    icon: DollarSign,
    tone: 'amber',
  },
];

const decisionToneStyles = {
  emerald: {
    active: 'border-emerald-500 bg-emerald-50',
    icon: 'text-emerald-600',
    title: 'text-emerald-800',
  },
  red: {
    active: 'border-red-500 bg-red-50',
    icon: 'text-red-600',
    title: 'text-red-800',
  },
  amber: {
    active: 'border-amber-500 bg-amber-50',
    icon: 'text-amber-600',
    title: 'text-amber-800',
  },
};

const JudgeDisputeDetails = () => {
  const { id } = useParams();
  const [dispute, setDispute] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [decisionType, setDecisionType] = useState('');
  const [splitPercentage, setSplitPercentage] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');

      try {
        const disputeData = await disputeApi.detail(id);
        const [submissionData, contractData] = await Promise.all([
          disputeData?.submission ? submissionApi.detail(disputeData.submission).catch(() => null) : Promise.resolve(null),
          disputeData?.contract ? contractApi.detail(disputeData.contract).catch(() => null) : Promise.resolve(null),
        ]);

        if (!cancelled) {
          setDispute(disputeData || null);
          setSubmission(submissionData || null);
          setContract(contractData || null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load the dispute.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const report = submission?.ai_report || null;

  const submissionLinks = useMemo(() => {
    const links = submission?.links || {};
    return [
      { label: 'GitHub Repository', url: links.github, icon: GitBranch },
      { label: 'Design / Figma', url: links.figma, icon: PenTool },
      { label: 'Live Demo', url: links.demo, icon: Globe },
      { label: 'Documentation', url: links.documentation, icon: BookOpen },
      { label: 'Video Walkthrough', url: links.video, icon: Video },
    ].filter((item) => item.url);
  }, [submission]);

  const timelineEvents = useMemo(() => {
    if (!dispute) {
      return [];
    }

    return [
      { label: 'Contract Created', date: formatDateTime(contract?.created_at), active: false },
      { label: 'Work Submitted', date: formatDateTime(submission?.submitted_at), active: false },
      { label: 'AI Evaluation', date: formatDateTime(submission?.evaluated_at), active: false },
      { label: 'Dispute Filed', date: formatDateTime(dispute.created_at), active: true },
      { label: dispute.resolved_at ? 'Resolved' : 'Under Review', date: formatDateTime(dispute.resolved_at || dispute.updated_at), active: Boolean(dispute.resolved_at) },
    ];
  }, [contract, dispute, submission]);

  const disputeStatus = String(dispute?.status || '').toUpperCase();
  const canResolve = Boolean(dispute && !dispute.resolved_at);
  const disputedAmount = Number(dispute?.disputed_amount || submission?.milestone?.amount || 0);

  const statusStyles = {
    OPEN: 'bg-blue-100 text-blue-700',
    ASSIGNED: 'bg-amber-100 text-amber-700',
    UNDER_REVIEW: 'bg-indigo-100 text-indigo-700',
    PARTIALLY_RESOLVED: 'bg-purple-100 text-purple-700',
    RESOLVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700',
    CLOSED: 'bg-slate-100 text-slate-700',
    EXPIRED: 'bg-slate-100 text-slate-700',
  };

  const handleSubmitDecision = async () => {
    if (!decisionType || !reasoning.trim()) {
      setError('Please select a decision and provide reasoning.');
      return;
    }

    if (decisionType === 'PARTIAL_PAYMENT' && (!splitPercentage || Number(splitPercentage) <= 0 || Number(splitPercentage) >= 100)) {
      setError('Enter a valid split percentage between 1 and 99.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload = {
        decision: decisionType,
        reasoning: reasoning.trim(),
      };

      if (decisionType === 'PARTIAL_PAYMENT') {
        payload.split_percentage = Number(splitPercentage);
      }

      const updated = await disputeApi.resolve(id, payload);
      setDispute(updated || null);
      setConfirmation(updated || {
        decision: decisionType,
        reasoning: reasoning.trim(),
        split_percentage: splitPercentage ? Number(splitPercentage) : null,
      });
      setShowConfirmation(true);
    } catch (saveError) {
      setError(saveError?.message || 'Unable to submit the decision.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading dispute...
        </div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
        <Link to="/judge/disputes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Disputes
        </Link>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <Scale className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Dispute {id}</h2>
          <p className="text-slate-500 mb-6">{error || 'Detailed dispute information is not available for this case.'}</p>
          <Link
            to="/judge/disputes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Disputes
          </Link>
        </div>
      </div>
    );
  }

  const aiEval = report;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <Link to="/judge/disputes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Disputes
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{dispute.project_title || dispute.contract_title}</h1>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700">{humanizeEnum(dispute.reason)}</span>
            </div>
            <p className="text-slate-500">Case {compactHash(dispute.id)} - Filed {formatDateTime(dispute.created_at)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold px-4 py-2 rounded-full ${statusStyles[disputeStatus] || 'bg-slate-100 text-slate-700'}`}>
              {humanizeEnum(disputeStatus)}
            </span>
            <span className="text-2xl font-extrabold text-slate-900">{formatTokenAmount(disputedAmount)}</span>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Project Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Contract Title</label>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{dispute.contract_title}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Milestone</label>
                    <p className="text-sm text-slate-700 mt-1">{dispute.milestone_title}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Disputed Amount</label>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{formatTokenAmount(disputedAmount)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Student</label>
                      <p className="text-sm text-slate-700 mt-1">{dispute.student_name || submission?.student_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Company</label>
                      <p className="text-sm text-slate-700 mt-1">{dispute.company_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Deadline</label>
                      <p className="text-sm text-slate-700 mt-1">{formatDateTime(dispute.dispute_deadline)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {contract?.milestones?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-xl">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Contract Requirements</h2>
              </div>
              <div className="p-6 space-y-4">
                {contract.milestones.map((milestone) => (
                  <div key={milestone.id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm">
                        Milestone {milestone.order}: {milestone.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">{formatTokenAmount(milestone.amount)}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {humanizeEnum(milestone.status)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 whitespace-pre-wrap">{milestone.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {submission && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="bg-violet-50 p-2 rounded-xl">
                  <LinkIcon className="w-5 h-5 text-violet-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Student Submission</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {submissionLinks.length > 0 ? (
                    submissionLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                      >
                        <link.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700 truncate">{link.label}</p>
                          <p className="text-xs text-slate-400 truncate">{link.url}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No proof links were attached to this submission.</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Additional Notes</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{submission.additional_notes || 'No notes provided.'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Submission ID</p>
                    <p className="text-sm text-slate-700 font-mono">{compactHash(submission.id)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {aiEval && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-50 p-2 rounded-xl">
                    <Bot className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">AI Evaluation Report</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">{aiEval.overall_score}</span>
                  <span className="text-sm text-slate-400">/100</span>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Score Dimensions</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Code', score: aiEval.code_score, weight: 30 },
                      { name: 'Design', score: aiEval.design_score, weight: 25 },
                      { name: 'Requirements', score: aiEval.requirement_score, weight: 20 },
                      { name: 'Functionality', score: aiEval.functionality_score, weight: 25 },
                    ].map((dim) => (
                      <div key={dim.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-700">{dim.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Weight: {dim.weight}%</span>
                            <span className="text-sm font-bold text-slate-900">{dim.score}</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${dim.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-sm font-semibold text-emerald-800">Strengths</h4>
                    </div>
                    <ul className="space-y-2">
                      {(aiEval.strengths || []).map((item, index) => (
                        <li key={index} className="text-sm text-emerald-700 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h4 className="text-sm font-semibold text-red-800">Weaknesses</h4>
                    </div>
                    <ul className="space-y-2">
                      {(aiEval.weaknesses || []).map((item, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">AI Reasoning</h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{aiEval.explanation || 'No explanation provided.'}</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Company Claim</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Dispute Reason</label>
                <p className="text-sm font-semibold text-slate-900 mt-1">{humanizeEnum(dispute.reason)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Explanation</label>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap">{dispute.description}</p>
              </div>
              {Array.isArray(dispute.evidence) && dispute.evidence.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Evidence Links</label>
                  <div className="mt-2 space-y-2">
                    {dispute.evidence.map((item, index) => {
                      const url = item?.url || item?.path || item?.name || '';
                      return (
                        <a
                          key={index}
                          href={url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {item?.name || item?.description || url || `Evidence ${index + 1}`}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="bg-emerald-50 p-2 rounded-xl">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Student Response</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Response</label>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap">{submission.additional_notes || 'No response provided by the student.'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-slate-100 p-2 rounded-xl">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Timeline</h2>
            </div>
            <div className="space-y-0">
              {timelineEvents.map((event, index) => (
                <div key={event.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${event.active ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-emerald-500'}`} />
                    {index < timelineEvents.length - 1 && <div className="w-0.5 h-12 bg-slate-200" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium text-slate-900">{event.label}</p>
                    <p className="text-xs text-slate-400">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Gavel className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Make Decision</h2>
            </div>

            {canResolve ? (
              <>
                <div className="space-y-3 mb-5">
                  {decisionButtons.map((item) => {
                    const Icon = item.icon;
                    const active = decisionType === item.value;
                    const toneStyles = decisionToneStyles[item.tone] || decisionToneStyles.emerald;
                    return (
                      <button
                        key={item.value}
                        onClick={() => {
                          setDecisionType(item.value);
                          setError('');
                        }}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                          active ? toneStyles.active : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? toneStyles.icon : 'text-slate-400'}`} />
                        <div>
                          <p className={`text-sm font-semibold ${active ? toneStyles.title : 'text-slate-700'}`}>{item.label}</p>
                          <p className="text-xs text-slate-400">{item.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {decisionType === 'PARTIAL_PAYMENT' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Split Percentage to Student</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                      <input
                        type="number"
                        value={splitPercentage}
                        onChange={(event) => setSplitPercentage(event.target.value)}
                        placeholder="1 - 99"
                        min="1"
                        max="99"
                        className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Decision Reasoning <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reasoning}
                    onChange={(event) => setReasoning(event.target.value)}
                    rows={4}
                    placeholder="Explain your reasoning for this decision..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmitDecision}
                  disabled={isSaving}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  Submit Decision
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-emerald-800">Decision Recorded</h3>
                  </div>
                  <p className="text-sm text-emerald-700">This dispute was resolved on {formatDateTime(dispute.resolved_at)}.</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Decision</span>
                    <span className="font-semibold text-slate-900">{humanizeEnum(dispute.decision)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Resolution Amount</span>
                    <span className="font-semibold text-slate-900">{formatTokenAmount(dispute.resolution_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Judge Reward</span>
                    <span className="font-semibold text-slate-900">{formatTokenAmount(dispute.judge_reward)}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Decision Recorded</h3>
              <p className="text-slate-500 mb-6">Your decision has been submitted successfully.</p>
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2 border border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Decision</span>
                  <span className="font-semibold text-slate-900">{humanizeEnum(confirmation?.decision || decisionType)}</span>
                </div>
                {confirmation?.split_percentage ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Split</span>
                    <span className="font-semibold text-slate-900">{confirmation.split_percentage}%</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Case</span>
                  <span className="font-semibold text-slate-900">{compactHash(dispute.id)}</span>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-full py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JudgeDisputeDetails;
