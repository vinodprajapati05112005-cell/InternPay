import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckSquare, Scale, Settings, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRoleLabel, getUserDisplayName, getUserInitial } from '../utils/navigation';
import NotificationDropdown from '../components/NotificationDropdown';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Determine role based on URL path to render appropriate sidebar
  const getRole = () => {
    if (location.pathname.startsWith('/company')) return 'company';
    if (location.pathname.startsWith('/student')) return 'student';
    if (location.pathname.startsWith('/judge')) return 'judge';
    return (user?.role || 'COMPANY').toLowerCase();
  };

  const role = getRole();
  const displayName = getUserDisplayName(user);
  const roleLabel = getRoleLabel(user?.role || role);
  const initials = getUserInitial(user);

  const navItems = {
    company: [
      { name: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
      { name: 'Contracts', path: '/company/contracts', icon: FileText },
      { name: 'Submissions', path: '/company/submissions', icon: CheckSquare },
      { name: 'Disputes', path: '/company/disputes', icon: Scale },
      { name: 'Profile', path: '/company/profile', icon: User },
      { name: 'Settings', path: '/company/settings', icon: Settings },
    ],
    student: [
      { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'My Contracts', path: '/student/contracts', icon: FileText },
      { name: 'My Submissions', path: '/student/submissions', icon: CheckSquare },
      { name: 'Payments', path: '/student/payments', icon: FileText },
      { name: 'Profile', path: '/student/profile', icon: User },
      { name: 'Settings', path: '/student/settings', icon: Settings },
    ],
    judge: [
      { name: 'Dashboard', path: '/judge/dashboard', icon: LayoutDashboard },
      { name: 'Disputes', path: '/judge/disputes', icon: Scale },
      { name: 'Reputation', path: '/judge/reputation', icon: Settings },
      { name: 'Profile', path: '/judge/profile', icon: User },
    ]
  };

  const currentNav = navItems[role];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">InternPay</Link>
          <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {currentNav.map((item) => {
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== `/${role}/dashboard`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-60"
          >
            <LogOut size={18} />
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-30">
          <button 
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              {displayName}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
