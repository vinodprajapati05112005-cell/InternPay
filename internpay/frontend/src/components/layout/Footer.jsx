import { Link } from 'react-router-dom';
import { GitBranch, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">I</div>
              <span className="font-bold text-xl tracking-tight text-foreground">InternPay</span>
            </Link>
            <p className="text-sm text-foreground/70 mb-6">
              Built with transparency. Powered by trust.
            </p>
            <div className="flex space-x-4 text-foreground/50">
              <a href="https://github.com/internpay" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><GitBranch size={20} /></a>
              <a href="https://twitter.com/internpay" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="https://linkedin.com/company/internpay" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
              <a href="mailto:hello@internpay.com" className="hover:text-primary transition-colors"><Mail size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li><Link to="/#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link to="/company/dashboard" className="hover:text-primary transition-colors">Company Dashboard</Link></li>
              <li><Link to="/student/dashboard" className="hover:text-primary transition-colors">Student Dashboard</Link></li>
              <li><Link to="/judge/dashboard" className="hover:text-primary transition-colors">Judge Dashboard</Link></li>
              <li><Link to="/ai-evaluation" className="hover:text-primary transition-colors">AI Evaluation</Link></li>
              <li><Link to="/disputes" className="hover:text-primary transition-colors">Disputes</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li><Link to="/documentation" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link to="/api-docs" className="hover:text-primary transition-colors">API Reference</Link></li>
              <li><Link to="/security" className="hover:text-primary transition-colors">Security</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Smart Contracts</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li><Link to="/about" className="hover:text-primary transition-colors">About InternPay</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-foreground/50">© {new Date().getFullYear()} InternPay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
