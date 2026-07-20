import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="w-full bg-white border-b border-slate-200 py-4 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
            InternPay
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6 items-center">
            <Link to="/how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">How It Works</Link>
            <Link to="/for-companies" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">For Companies</Link>
            <Link to="/for-freelancers" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">For Freelancers</Link>
            <Link to="/for-judges" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">For Judges</Link>
            <Link to="/security" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">Security</Link>
            <Link to="/documentation" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm">Documentation</Link>
          </nav>
          
          <div className="hidden lg:flex gap-4 items-center">
            <Link to="/connect-wallet" className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors text-sm">
              Connect Wallet
            </Link>
            <Link to="/select-role" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all text-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 py-4 px-4 shadow-lg flex flex-col gap-4">
            <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">How It Works</Link>
            <Link to="/for-companies" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">For Companies</Link>
            <Link to="/for-freelancers" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">For Freelancers</Link>
            <Link to="/for-judges" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">For Judges</Link>
            <Link to="/security" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">Security</Link>
            <Link to="/documentation" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">Documentation</Link>
            <hr className="border-slate-100 my-2" />
            <Link to="/connect-wallet" onClick={() => setMobileMenuOpen(false)} className="text-center px-4 py-3 text-slate-700 border border-slate-300 rounded-lg font-medium">
              Connect Wallet
            </Link>
            <Link to="/select-role" onClick={() => setMobileMenuOpen(false)} className="text-center px-5 py-3 bg-blue-600 text-white font-medium rounded-lg">
              Get Started
            </Link>
          </div>
        )}
      </header>
      
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      
      <footer className="bg-slate-900 text-slate-300 py-16 mt-auto border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight mb-4 inline-block">
              InternPay
            </Link>
            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              The blockchain-powered escrow platform for freelance work and internships. Work completed. Payment protected.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="sr-only">Twitter</span>
                {/* Twitter Icon placeholder */}
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="sr-only">GitHub</span>
                {/* GitHub Icon placeholder */}
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="sr-only">LinkedIn</span>
                {/* LinkedIn Icon placeholder */}
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link></li>
              <li><Link to="/company/dashboard" className="hover:text-blue-400 transition-colors">Company Dashboard</Link></li>
              <li><Link to="/student/dashboard" className="hover:text-blue-400 transition-colors">Student Dashboard</Link></li>
              <li><Link to="/judge/dashboard" className="hover:text-blue-400 transition-colors">Judge Dashboard</Link></li>
              <li><Link to="/documentation/ai-evaluation" className="hover:text-blue-400 transition-colors">AI Evaluation</Link></li>
              <li><Link to="/documentation/disputes" className="hover:text-blue-400 transition-colors">Disputes</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/documentation" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
              <li><Link to="/documentation/smart-contracts" className="hover:text-blue-400 transition-colors">Smart Contracts</Link></li>
              <li><Link to="/api-docs" className="hover:text-blue-400 transition-colors">API Documentation</Link></li>
              <li><Link to="/security" className="hover:text-blue-400 transition-colors">Security</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} InternPay. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <span>Blockchain Escrow Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
