import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Lock, UploadCloud, BrainCircuit, Scale, CheckCircle2, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      color: 'blue',
      title: '1. Company creates contract',
      description: 'The company drafts a smart contract specifying project requirements, deliverables, milestones, and deadlines.'
    },
    {
      icon: Lock,
      color: 'indigo',
      title: '2. Company locks funds',
      description: 'The company deposits USDC into the blockchain escrow. The funds are locked securely, giving the freelancer a guarantee of payment.'
    },
    {
      icon: UploadCloud,
      color: 'sky',
      title: '3. Student submits work',
      description: 'The freelancer or student completes the milestone and submits proof of work (GitHub repo, PenTool link, live demo, documentation).'
    },
    {
      icon: BrainCircuit,
      color: 'purple',
      title: '4. AI evaluates submission',
      description: 'Our proprietary AI model analyzes the submitted work against the original contract requirements, generating a transparent score across multiple dimensions.'
    },
    {
      icon: Scale,
      color: 'orange',
      title: '5. 24-hour dispute window',
      description: 'Both parties review the AI evaluation report. A 24-hour window opens where either party can raise a dispute if they disagree with the evaluation.'
    },
    {
      icon: CheckCircle2,
      color: 'emerald',
      title: '6. Payment is released or dispute is resolved',
      description: 'If no dispute is raised, the smart contract automatically releases the funds to the freelancer. If disputed, an impartial human judge reviews the evidence and makes a binding decision.'
    }
  ];

  return (
    <div className="w-full bg-white font-sans py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">How InternPay Works</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A transparent, automated, and secure workflow that protects both companies and freelancers.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Icon */}
                  <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-${step.color}-100 flex items-center justify-center text-${step.color}-600 shadow-md z-10`}>
                    <Icon size={28} />
                  </div>
                  
                  {/* Content */}
                  <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-24 text-center bg-blue-50 rounded-3xl p-12 border border-blue-100">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to experience secure contracts?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/select-role" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
              Start a Contract <ArrowRight size={20} />
            </Link>
            <Link to="/documentation/ai-evaluation" className="px-8 py-4 bg-white hover:bg-slate-50 text-blue-700 font-semibold rounded-xl border border-blue-200 transition-all">
              Learn about AI Evaluation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
