import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, MessageSquare, MapPin, Clock, Send, CheckCircle2,
  AlertCircle, ArrowRight, ExternalLink, HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 }
  })
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Mock submission delay
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@internpay.io', desc: 'For general inquiries' },
    { icon: MessageSquare, label: 'Discord', value: 'discord.gg/internpay', desc: 'Join our community' },
    { icon: MapPin, label: 'Location', value: 'Remote-first, Global', desc: 'We work from everywhere' },
    { icon: Clock, label: 'Response Time', value: '< 24 hours', desc: 'Business days' }
  ];

  const faqs = [
    {
      question: 'How do I create my first contract?',
      answer: 'Sign in with your wallet, navigate to the Company Dashboard, and click "Create Contract". Define your milestones, requirements, and deposit funds into escrow.'
    },
    {
      question: 'What happens if there\'s a dispute?',
      answer: 'Either party can file a dispute during the 24-hour window. An impartial judge reviews the contract, AI report, and evidence from both sides before making a binding decision.'
    },
    {
      question: 'Which wallets are supported?',
      answer: 'InternPay supports MetaMask, WalletConnect, Coinbase Wallet, and most EVM-compatible wallets.'
    },
    {
      question: 'Is my escrow deposit safe?',
      answer: 'Absolutely. Funds are locked in audited smart contracts on the blockchain. They can only be released through the defined contract conditions — no one has unilateral access.'
    }
  ];

  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6 border border-blue-200"
            >
              <Mail size={16} />
              <span>Get in Touch</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
            >
              We'd love to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                hear from you
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              Have questions about InternPay? Need help with your contract? Want to partner with us? Drop us a message.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Form */}
            <div className="lg:w-2/3">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200"
              >
                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Message sent successfully!</h3>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                      Thank you for reaching out. We'll get back to you within 24 hours on business days.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a message</h2>
                    <p className="text-slate-500 mb-8">Fill out the form below and we'll respond as soon as possible.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                            } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          />
                          {errors.name && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle size={14} /> {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                            } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          />
                          {errors.email && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle size={14} /> {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What's this about?"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.subject ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                          } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        />
                        {errors.subject && (
                          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.subject}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more about your question or feedback..."
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.message ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                          } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                        />
                        {errors.message && (
                          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-lg"
                      >
                        {submitting ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message <Send size={20} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:w-1/3 space-y-6">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeUp}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{info.label}</h4>
                        <p className="text-blue-600 font-medium text-sm">{info.value}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{info.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Quick Links */}
              <div className="bg-slate-900 p-6 rounded-2xl">
                <h4 className="text-white font-bold mb-4">Quick Links</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Documentation', to: '/documentation' },
                    { label: 'How It Works', to: '/how-it-works' },
                    { label: 'Security', to: '/security' },
                    { label: 'Privacy Policy', to: '/privacy' }
                  ].map((link, i) => (
                    <Link
                      key={i}
                      to={link.to}
                      className="flex items-center justify-between text-slate-300 hover:text-white transition-colors text-sm font-medium"
                    >
                      {link.label}
                      <ArrowRight size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-6 border border-indigo-200">
              <HelpCircle size={16} />
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100"
              >
                <h3 className="font-bold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
