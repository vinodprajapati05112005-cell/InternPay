import React from 'react';
import { Link } from 'react-router-dom';
import {
  Target, Heart, Shield, Lightbulb, Users, Globe,
  ArrowRight, CheckCircle2, Zap, Scale, BrainCircuit,
  Sparkles, TrendingUp, Award
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

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Trust Through Technology',
      description: 'We replace blind trust with verifiable, transparent systems. Smart contracts and AI evaluation ensure every transaction is fair.'
    },
    {
      icon: Scale,
      title: 'Fairness for Everyone',
      description: 'Companies get verified deliverables. Freelancers get guaranteed payment. Judges earn for fair decisions. Everyone wins.'
    },
    {
      icon: Lightbulb,
      title: 'Radical Transparency',
      description: 'Every evaluation score, every escrow transaction, every dispute decision is visible and verifiable on the blockchain.'
    },
    {
      icon: Heart,
      title: 'Community First',
      description: 'We\'re building a platform where reputation is earned through real work, not manipulated reviews or hidden algorithms.'
    }
  ];

  const milestones = [
    { year: '2025', title: 'The Idea', description: 'Identified the trust gap in freelance work after seeing too many payment disputes and ghosted contracts.' },
    { year: '2025', title: 'Smart Contract Development', description: 'Built and audited the escrow smart contracts with milestone-based payment release.' },
    { year: '2026', title: 'AI Evaluation Engine', description: 'Developed the AI-powered work verification system that evaluates code, design, and deliverables.' },
    { year: '2026', title: 'Platform Launch', description: 'Launched InternPay with full escrow, AI evaluation, and dispute resolution capabilities.' }
  ];

  const teamMembers = [
    { name: 'Vinod Prajapati', role: 'Founder & Lead Developer', specialty: 'Blockchain, Full-Stack Development' },
    { name: 'AI Engine Team', role: 'Core AI Development', specialty: 'Machine Learning, NLP, Code Analysis' },
    { name: 'Smart Contract Team', role: 'Blockchain Engineering', specialty: 'Solidity, Security Auditing' },
    { name: 'Community & Growth', role: 'Ecosystem Development', specialty: 'Partnerships, Judge Network' }
  ];

  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6 border border-blue-200"
            >
              <Sparkles size={16} />
              <span>About InternPay</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
            >
              Rebuilding trust in{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                freelance work.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              InternPay is a blockchain-powered escrow platform that guarantees payment for completed work and verified deliverables for companies. We're eliminating the trust problem in freelancing.
            </motion.p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                The problem we're solving
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                The freelance economy is worth over $1.5 trillion, yet both parties face the same fundamental problem: trust. Freelancers complete work and never get paid. Companies pay upfront and receive subpar deliverables. Traditional dispute resolution is too expensive for most contracts.
              </p>
              <div className="space-y-4">
                {[
                  { stat: '58%', desc: 'of freelancers have experienced non-payment' },
                  { stat: '43%', desc: 'of companies received work that didn\'t meet requirements' },
                  { stat: '$5,000+', desc: 'average cost of traditional dispute resolution' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 shrink-0 w-20 text-right">
                      {item.stat}
                    </span>
                    <span className="text-slate-300">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">Our Solution</h3>
                <div className="space-y-4">
                  {[
                    { icon: BrainCircuit, text: 'AI-powered work verification eliminates subjective disputes' },
                    { icon: Shield, text: 'Blockchain escrow guarantees payment for completed work' },
                    { icon: Scale, text: 'Human judges resolve edge cases fairly and affordably' },
                    { icon: TrendingUp, text: 'On-chain reputation creates accountability for everyone' },
                    { icon: Zap, text: 'Automated payments reduce friction and delays' }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center gap-4 text-slate-300">
                        <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                          <Icon size={20} />
                        </div>
                        <span className="font-medium">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-blue-50 p-10 rounded-2xl border border-blue-100"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To create a world where freelancers are always paid for quality work, and companies always receive what they contracted for. We use blockchain technology and AI to replace blind trust with verifiable proof.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              variants={fadeUp}
              className="bg-indigo-50 p-10 rounded-2xl border border-indigo-100"
            >
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To become the global standard for secure freelance payments. A platform where reputation is earned through real, verified work — and where every contract is backed by transparent, immutable proof.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              What we believe in
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow text-center"
                >
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 mx-auto">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey / Milestones */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Our journey
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
            <div className="space-y-10">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-md z-10 text-xs font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex-1">
                    <div className="text-xs font-semibold text-blue-600 mb-1">{milestone.year}</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{milestone.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              The team behind InternPay
            </h2>
            <p className="text-lg text-slate-600">
              A passionate team of builders, engineers, and designers who believe in a fairer freelance economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 text-sm font-semibold mb-2">{member.role}</p>
                <p className="text-slate-500 text-xs">{member.specialty}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white border-t border-slate-200 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Join us in building a fairer future
            </h2>
            <p className="text-xl text-slate-600 mb-10">
              Whether you're a company, freelancer, or judge — InternPay is built for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/select-role"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center text-lg"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
