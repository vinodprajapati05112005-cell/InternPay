import React from 'react';
import { mockStudentStats } from '../../data/mockData';
import { User, Mail, MapPin, Briefcase, Award, Star, GitBranch, Globe } from 'lucide-react';

export default function StudentProfile() {
  const profile = {
    name: 'Alex Chen',
    role: 'Frontend Developer',
    wallet: '0x7a89...9F21',
    email: 'alex.chen@example.com',
    location: 'San Francisco, CA',
    bio: 'Passionate frontend developer specializing in React and Web3 interfaces. I love building intuitive, pixel-perfect user experiences.',
    memberSince: 'Jan 2026',
    github: 'github.com/alexchen',
    portfolio: 'alexchen.dev'
  };

  const stats = mockStudentStats || {
    totalEarnings: 8450,
    contractsCompleted: 12,
    avgAiScore: 92
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
          <div className="px-6 md:px-8 pb-8 relative">
            <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center -mt-12 mb-4">
              <User className="w-12 h-12 text-slate-300" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{profile.name}</h1>
                <p className="text-indigo-600 font-medium">{profile.role}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-600">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-slate-400" /> {profile.location}</span>
                  <span className="flex items-center"><Mail className="w-4 h-4 mr-1 text-slate-400" /> {profile.email}</span>
                  <span className="flex items-center bg-slate-100 px-2 py-1 rounded font-mono text-xs">{profile.wallet}</span>
                </div>
              </div>
              <button className="px-5 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-sm">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">Performance</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-slate-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="font-bold text-slate-900">{stats.contractsCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-slate-600">
                    <Award className="w-4 h-4 mr-2" />
                    <span className="text-sm">Earnings</span>
                  </div>
                  <span className="font-bold text-slate-900">${stats.totalEarnings?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-slate-600">
                    <Star className="w-4 h-4 mr-2" />
                    <span className="text-sm">Avg AI Score</span>
                  </div>
                  <span className="font-bold text-emerald-600">{stats.avgAiScore}/100</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">Links</h2>
              <div className="space-y-3">
                <a href="#" className="flex items-center text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                  <GitBranch className="w-4 h-4 mr-3" />
                  {profile.github}
                </a>
                <a href="#" className="flex items-center text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                  <Globe className="w-4 h-4 mr-3" />
                  {profile.portfolio}
                </a>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
              <p className="text-slate-600 leading-relaxed">
                {profile.bio}
              </p>
              
              <h3 className="font-bold text-slate-900 mt-8 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Tailwind CSS', 'Web3.js', 'Solidity', 'Node.js', 'PenTool'].map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
