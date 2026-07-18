import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Award,
  Star,
  GitBranch,
  Globe,
  Loader2,
  CheckCircle2,
  Save,
  BadgeCheck,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../services/api';
import { formatCurrency, humanizeEnum } from '../../utils/formatters';
import { getUserDisplayName } from '../../utils/navigation';

const StudentProfile = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState({
    institution_name: '',
    course_name: '',
    graduation_year: '',
    portfolio_url: '',
    bio: '',
    skills: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [profileData, dashboardData] = await Promise.all([
          studentApi.profile(),
          studentApi.dashboard(),
        ]);

        if (!cancelled) {
          setProfile(profileData || null);
          setDashboard(dashboardData || null);
          setForm({
            institution_name: profileData?.institution_name || '',
            course_name: profileData?.course_name || '',
            graduation_year: profileData?.graduation_year || '',
            portfolio_url: profileData?.portfolio_url || '',
            bio: profileData?.bio || '',
            skills: Array.isArray(profileData?.skills) ? profileData.skills.join(', ') : '',
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || 'Unable to load your profile.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const summaryCards = useMemo(() => [
    { label: 'Active Contracts', value: dashboard?.active_contracts || 0, icon: Briefcase, color: 'from-blue-500 to-indigo-600' },
    { label: 'Submissions', value: dashboard?.submitted_work || 0, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600' },
    { label: 'Approved', value: dashboard?.approved_submissions || 0, icon: Star, color: 'from-violet-500 to-purple-600' },
    { label: 'Pending Payments', value: formatCurrency(dashboard?.pending_payments || 0), icon: Award, color: 'from-rose-500 to-red-600' },
  ], [dashboard]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) {
      setError('');
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      await studentApi.updateProfile({
        institution_name: form.institution_name.trim(),
        course_name: form.course_name.trim(),
        graduation_year: form.graduation_year ? Number(form.graduation_year) : null,
        portfolio_url: form.portfolio_url.trim(),
        bio: form.bio.trim(),
        skills: form.skills
          ? form.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
          : [],
      });

      await refreshProfile();
      const [profileData, dashboardData] = await Promise.all([
        studentApi.profile(),
        studentApi.dashboard(),
      ]);
      setProfile(profileData || null);
      setDashboard(dashboardData || null);
      setSavedAt(new Date().toLocaleString());
    } catch (saveError) {
      setError(saveError?.message || 'Unable to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = getUserDisplayName(user);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Student Profile</h1>
          <p className="text-slate-500 mt-1">Manage your student information and public details.</p>
        </motion.div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {savedAt && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Profile saved successfully at {savedAt}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-blue-600" />
          <div className="px-6 md:px-8 pb-8 relative">
            <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center -mt-12 mb-4">
              <User className="w-12 h-12 text-slate-300" />
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">{displayName}</h2>
                <p className="text-indigo-600 font-medium flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {profile?.institution_name || 'Student'}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-600">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                    {profile?.course_name || 'Course not set'}
                  </span>
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-slate-400" />
                    {user?.email}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {humanizeEnum(profile?.verification_status)}
                  </span>
                </div>
              </div>
              <Link
                to="/student/settings"
                className="px-5 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-sm text-center"
              >
                Open Settings
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index }}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">Current Details</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-500">Institution</p>
                  <p className="font-semibold text-slate-900 mt-1">{profile?.institution_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Course</p>
                  <p className="font-semibold text-slate-900 mt-1">{profile?.course_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Graduation Year</p>
                  <p className="font-semibold text-slate-900 mt-1">{profile?.graduation_year || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Portfolio</p>
                  {profile?.portfolio_url ? (
                    <a href={profile.portfolio_url} target="_blank" rel="noreferrer" className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1">
                      <Globe className="w-4 h-4" />
                      Open portfolio
                    </a>
                  ) : (
                    <p className="font-semibold text-slate-900 mt-1">Not set</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {(profile?.skills || []).length > 0 ? (
                  profile.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No skills listed yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Edit Profile</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Institution Name</label>
                      <input
                        type="text"
                        value={form.institution_name}
                        onChange={(event) => handleChange('institution_name', event.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Course / Program</label>
                      <input
                        type="text"
                        value={form.course_name}
                        onChange={(event) => handleChange('course_name', event.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Graduation Year</label>
                      <input
                        type="number"
                        value={form.graduation_year}
                        onChange={(event) => handleChange('graduation_year', event.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Portfolio URL</label>
                      <input
                        type="url"
                        value={form.portfolio_url}
                        onChange={(event) => handleChange('portfolio_url', event.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Skills</label>
                    <input
                      type="text"
                      value={form.skills}
                      onChange={(event) => handleChange('skills', event.target.value)}
                      placeholder="React, Django, Tailwind CSS"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-1">Comma separated list of skills.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
                    <textarea
                      rows={4}
                      value={form.bio}
                      onChange={(event) => handleChange('bio', event.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <GitBranch className="w-4 h-4" />
                  Linked to {user?.role || 'student'} account
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link to="/student/contracts" className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                  <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Contracts</span>
                </Link>
                <Link to="/student/submissions" className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                  <CheckCircle2 className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Submissions</span>
                </Link>
                <Link to="/student/payments" className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                  <Award className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Payments</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
