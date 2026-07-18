import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  AlertCircle,
  ArrowRight,
  Shield,
  Check,
  Building2,
  GraduationCap,
  Scale,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleOptions = [
  {
    id: 'COMPANY',
    label: 'Company',
    icon: Building2,
    description: 'Create contracts and manage escrow.',
  },
  {
    id: 'STUDENT',
    label: 'Student',
    icon: GraduationCap,
    description: 'Complete work and receive payments.',
  },
  {
    id: 'JUDGE',
    label: 'Judge',
    icon: Scale,
    description: 'Resolve disputes and build reputation.',
  },
];

const roleFieldConfig = {
  COMPANY: [
    { key: 'company_name', label: 'Company Name', placeholder: 'Acme Studio', type: 'text', required: true },
    { key: 'company_website', label: 'Company Website', placeholder: 'https://company.com', type: 'url', required: false },
    { key: 'company_registration_number', label: 'Registration Number', placeholder: 'REG-12345', type: 'text', required: false },
    { key: 'company_industry', label: 'Industry', placeholder: 'Technology', type: 'text', required: false },
    { key: 'company_address', label: 'Company Address', placeholder: '123 Business Ave, City', type: 'text', required: false },
  ],
  STUDENT: [
    { key: 'institution_name', label: 'Institution Name', placeholder: 'University of Example', type: 'text', required: true },
    { key: 'course_name', label: 'Course / Program', placeholder: 'Computer Science', type: 'text', required: false },
    { key: 'graduation_year', label: 'Graduation Year', placeholder: '2027', type: 'number', required: false },
    { key: 'portfolio_url', label: 'Portfolio URL', placeholder: 'https://portfolio.com', type: 'url', required: false },
    { key: 'skills', label: 'Skills', placeholder: 'React, Django, UI Design', type: 'text', required: false, help: 'Comma separated list' },
    { key: 'bio', label: 'Short Bio', placeholder: 'Tell us a little about yourself...', type: 'textarea', required: false },
  ],
  JUDGE: [
    { key: 'judge_display_name', label: 'Display Name', placeholder: 'Judge Martinez', type: 'text', required: true },
    { key: 'specialization', label: 'Specialization', placeholder: 'Web Development', type: 'text', required: false },
    { key: 'years_experience', label: 'Years of Experience', placeholder: '5', type: 'number', required: false },
    { key: 'license_number', label: 'License Number', placeholder: 'LIC-98765', type: 'text', required: false },
    { key: 'bio', label: 'Short Bio', placeholder: 'Share your background and expertise...', type: 'textarea', required: false },
  ],
};

const initialForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  password: '',
  password_confirm: '',
  company_name: '',
  company_website: '',
  company_registration_number: '',
  company_industry: '',
  company_address: '',
  institution_name: '',
  course_name: '',
  graduation_year: '',
  portfolio_url: '',
  skills: '',
  bio: '',
  judge_display_name: '',
  specialization: '',
  years_experience: '',
  license_number: '',
};

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  const queryRole = searchParams.get('role');
  const [role, setRole] = useState(
    roleOptions.some((option) => option.id === String(queryRole || '').toUpperCase())
      ? String(queryRole).toUpperCase()
      : 'COMPANY',
  );

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!queryRole) {
      return;
    }

    const normalized = String(queryRole).toUpperCase();
    if (roleOptions.some((option) => option.id === normalized)) {
      setRole(normalized);
    }
  }, [queryRole]);

  const passwordChecks = useMemo(() => {
    return {
      length: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      number: /\d/.test(form.password),
    };
  }, [form.password]);

  const fieldConfigs = roleFieldConfig[role] || [];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError('');
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.first_name.trim()) {
      nextErrors.first_name = 'First name is required';
    }

    if (!form.last_name.trim()) {
      nextErrors.last_name = 'Last name is required';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }

    if (!form.password_confirm) {
      nextErrors.password_confirm = 'Please confirm your password';
    } else if (form.password !== form.password_confirm) {
      nextErrors.password_confirm = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      nextErrors.terms = 'You must agree to the Terms of Service';
    }

    if (role === 'COMPANY' && !form.company_name.trim()) {
      nextErrors.company_name = 'Company name is required';
    }

    if (role === 'STUDENT' && !form.institution_name.trim()) {
      nextErrors.institution_name = 'Institution name is required';
    }

    if (role === 'JUDGE' && !form.judge_display_name.trim()) {
      nextErrors.judge_display_name = 'Display name is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const mapServerErrors = (errorPayload) => {
    if (!errorPayload) {
      return {};
    }

    if (typeof errorPayload === 'string') {
      return { _form: errorPayload };
    }

    if (Array.isArray(errorPayload)) {
      return { _form: errorPayload[0] || 'Registration failed' };
    }

    const mapped = {};
    Object.entries(errorPayload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        mapped[key] = value[0];
      } else if (typeof value === 'string') {
        mapped[key] = value;
      }
    });
    return mapped;
  };

  const buildPayload = () => {
    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone_number: form.phone_number.trim(),
      password: form.password,
      password_confirm: form.password_confirm,
      role,
    };

    if (role === 'COMPANY') {
      payload.company_name = form.company_name.trim();
      payload.company_website = form.company_website.trim();
      payload.company_registration_number = form.company_registration_number.trim();
      payload.company_industry = form.company_industry.trim();
      payload.company_address = form.company_address.trim();
    }

    if (role === 'STUDENT') {
      payload.institution_name = form.institution_name.trim();
      payload.course_name = form.course_name.trim();
      payload.graduation_year = form.graduation_year ? Number(form.graduation_year) : null;
      payload.portfolio_url = form.portfolio_url.trim();
      payload.skills = form.skills
        ? form.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean)
        : [];
      payload.bio = form.bio.trim();
    }

    if (role === 'JUDGE') {
      payload.judge_display_name = form.judge_display_name.trim();
      payload.specialization = form.specialization.trim();
      payload.years_experience = form.years_experience ? Number(form.years_experience) : null;
      payload.license_number = form.license_number.trim();
      payload.bio = form.bio.trim();
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register(buildPayload());
      const emailParam = encodeURIComponent(form.email.trim());
      navigate(`/login?registered=1&email=${emailParam}&role=${role}`, { replace: true });
    } catch (error) {
      const mappedErrors = mapServerErrors(error?.errors);
      const formError = mappedErrors._form || error?.message || 'Unable to create your account right now.';

      setErrors((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(mappedErrors).filter(([key]) => key !== '_form'),
        ),
      }));
      setServerError(formError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const commonClass = `w-full ${
      field.type === 'textarea' ? 'px-4 py-3 min-h-[110px]' : 'pl-11 pr-4 py-3'
    } rounded-xl border ${
      errors[field.key] ? 'border-red-400 bg-red-50' : 'border-slate-200'
    } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`;

    if (field.type === 'textarea') {
      return (
        <textarea
          id={field.key}
          name={field.key}
          value={form[field.key]}
          onChange={handleChange}
          placeholder={field.placeholder}
          className={commonClass}
        />
      );
    }

    return (
      <div className="relative">
        {field.key === 'email' ? (
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        ) : field.key === 'password' || field.key === 'password_confirm' ? (
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        ) : (
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        <input
          id={field.key}
          name={field.key}
          type={
            field.key === 'password'
              ? showPassword
                ? 'text'
                : 'password'
              : field.key === 'password_confirm'
                ? showConfirm
                  ? 'text'
                  : 'password'
                : field.type
          }
          value={form[field.key]}
          onChange={handleChange}
          placeholder={field.placeholder}
          className={commonClass}
        />
        {field.key === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        {field.key === 'password_confirm' && (
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900">
              Intern<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pay</span>
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500">Set up your role and start using the platform</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const active = role === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    active
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-white' : 'bg-slate-100'}`}>
                      <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{option.label}</p>
                      <p className="text-xs text-slate-500">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {serverError && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                      errors.first_name ? 'border-red-400 bg-red-50' : 'border-slate-200'
                    } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                  />
                </div>
                {errors.first_name && <p className="mt-1.5 text-sm text-red-500">{errors.first_name}</p>}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                      errors.last_name ? 'border-red-400 bg-red-50' : 'border-slate-200'
                    } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                  />
                </div>
                {errors.last_name && <p className="mt-1.5 text-sm text-red-500">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                      errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'
                    } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>}

                {form.password && (
                  <div className="mt-2 space-y-1">
                    {[
                      { check: passwordChecks.length, label: 'At least 8 characters' },
                      { check: passwordChecks.uppercase, label: 'One uppercase letter' },
                      { check: passwordChecks.number, label: 'One number' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${item.check ? 'text-green-500' : 'text-slate-300'}`} />
                        <span className={item.check ? 'text-green-600' : 'text-slate-400'}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="password_confirm" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="password_confirm"
                    name="password_confirm"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.password_confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                      errors.password_confirm ? 'border-red-400 bg-red-50' : 'border-slate-200'
                    } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password_confirm && <p className="mt-1.5 text-sm text-red-500">{errors.password_confirm}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="text"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="+1 555 123 4567"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Profile Details</h2>
                <p className="text-sm text-slate-500">
                  We only ask for the fields your selected role needs right now.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {fieldConfigs.map((field) => (
                  <div key={field.key}>
                    <label htmlFor={field.key} className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderField(field)}
                    {field.help && <p className="mt-1 text-xs text-slate-400">{field.help}</p>}
                    {errors[field.key] && <p className="mt-1.5 text-sm text-red-500">{errors[field.key]}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(event) => {
                    setAgreedToTerms(event.target.checked);
                    if (errors.terms) {
                      setErrors((prev) => ({ ...prev, terms: '' }));
                    }
                  }}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-500">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && <p className="mt-1.5 text-sm text-red-500">{errors.terms}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center mt-6 text-slate-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1">
            Sign In
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
