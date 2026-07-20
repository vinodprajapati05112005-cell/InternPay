import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">I</div>
              <span className="font-bold text-xl tracking-tight text-foreground">InternPay</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#how-it-works" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">How It Works</Link>
            <Link to="/#companies" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">For Companies</Link>
            <Link to="/#freelancers" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">For Freelancers</Link>
            <Link to="/#judges" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">For Judges</Link>
            <Link to="/security" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Security</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Log In</Link>
            <Link to="/register" className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover shadow-soft transition-all">Get Started</Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button className="text-foreground p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
