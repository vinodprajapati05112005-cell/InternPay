import { ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light/50 text-primary font-medium text-sm border border-primary/10">
            <Zap size={16} />
            <span>Smart contract escrow is live</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Complete the work.<br/>
            <span className="text-primary">Get paid without chasing.</span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            InternPay combines AI verification, blockchain escrow, and human dispute resolution to make freelance and internship payments fair, transparent, and automatic.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link to="/register" className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-soft transition-all flex items-center justify-center gap-2">
              Start a Contract <ArrowRight size={18} />
            </Link>
            <Link to="/#how-it-works" className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-foreground border border-border font-medium hover:bg-surface-muted transition-all flex items-center justify-center">
              Explore How It Works
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full flex justify-center lg:justify-end relative">
          {/* Abstract Hero Visual Placeholder */}
          <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-primary/10 shadow-soft overflow-hidden flex items-center justify-center">
             <div className="absolute top-10 left-10 p-4 bg-white rounded-2xl shadow-card flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground"><ShieldCheck size={20} /></div>
                <div>
                  <p className="text-xs text-foreground/50 font-medium uppercase tracking-wider">Status</p>
                  <p className="text-sm font-bold text-foreground">Escrow Protected</p>
                </div>
             </div>
             
             <div className="absolute bottom-10 right-10 p-4 bg-white rounded-2xl shadow-card flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground"><Lock size={20} /></div>
                <div>
                  <p className="text-xs text-foreground/50 font-medium uppercase tracking-wider">Funds</p>
                  <p className="text-sm font-bold text-foreground">Locked Securely</p>
                </div>
             </div>

             <div className="w-48 h-48 rounded-full border-4 border-dashed border-primary/30 flex items-center justify-center relative animate-[spin_30s_linear_infinite]">
                <div className="w-32 h-32 bg-primary rounded-full blur-2xl opacity-20 absolute"></div>
                <div className="w-24 h-24 bg-white rounded-full shadow-card flex items-center justify-center text-primary font-bold text-2xl z-10">AI</div>
             </div>
          </div>
        </div>
      </section>
      
      {/* More sections will go here... */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Built for trust between people who don't know each other.</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto mb-12">Payment ghosting should not be normal. InternPay secures your funds on-chain.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
