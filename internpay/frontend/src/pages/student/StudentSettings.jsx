import React, { useState } from 'react';
import { Save, Bell, Shield, User, Wallet } from 'lucide-react';

export default function StudentSettings() {
  const [isSaved, setIsSaved] = useState(false);
  
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600 mb-8">Manage your account preferences and notifications.</p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4">
              <nav className="space-y-1">
                <button className="w-full flex items-center px-3 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-medium transition-colors">
                  <User className="w-4 h-4 mr-3" />
                  Profile Details
                </button>
                <button className="w-full flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
                </button>
                <button className="w-full flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">
                  <Wallet className="w-4 h-4 mr-3" />
                  Wallet Connection
                </button>
                <button className="w-full flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">
                  <Shield className="w-4 h-4 mr-3" />
                  Security
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 md:p-8">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Profile Details</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Display Name</label>
                        <input 
                          type="text" 
                          defaultValue="Alex Chen"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                        <input 
                          type="email" 
                          defaultValue="alex.chen@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
                      <textarea 
                        rows={4}
                        defaultValue="Passionate frontend developer specializing in React and Web3 interfaces."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Email Notifications</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <p className="font-semibold text-slate-900">Milestone Updates</p>
                        <p className="text-sm text-slate-500">Get notified when milestones are approved or rejected.</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </div>
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <p className="font-semibold text-slate-900">Payment Releases</p>
                        <p className="text-sm text-slate-500">Get notified when funds are released to your wallet.</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex items-center justify-end">
                  {isSaved && (
                    <span className="text-emerald-600 font-medium text-sm mr-4 flex items-center">
                      <Save className="w-4 h-4 mr-1" /> Settings saved successfully
                    </span>
                  )}
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
