import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { motion } from 'framer-motion';

const InternshipsPage = () => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('All');

    const categories = ['All', 'Software Development', 'Data Science', 'Cloud/DevOps', 'Research'];

    const internships = [
        {
            role: 'Frontend Engineer Intern',
            company: 'Swiggy',
            type: 'Product Unicorn',
            location: 'Bangalore (Hybrid)',
            duration: '3 Months',
            stipend: '₹35,000/mo',
            skills: ['React', 'Redux', 'Design Systems'],
            eligibility: 'B.Tech 3rd/4th Year',
            category: 'Software Development',
            link: 'https://www.swiggy.com/careers',
            color: 'border-orange-500/30 bg-orange-500/10'
        },
        {
            role: 'Backend Engineering Intern',
            company: 'PhonePe',
            type: 'FinTech Leader',
            location: 'Bangalore (Onsite)',
            duration: '6 Months',
            stipend: '₹50,000/mo',
            skills: ['Java', 'Distributed Systems', 'Kafka'],
            eligibility: 'Strong DSA & System Design',
            category: 'Software Development',
            link: 'https://www.phonepe.com/careers/',
            color: 'border-purple-500/30 bg-purple-500/10'
        },
        {
            role: 'Data Analyst Intern',
            company: 'CRED',
            type: 'FinTech Unicorn',
            location: 'Bangalore',
            duration: '3 Months',
            stipend: '₹40,000/mo',
            skills: ['SQL', 'Python', 'Business Intelligence'],
            eligibility: 'Analytics/Math Background',
            category: 'Data Science',
            link: 'https://careers.cred.club/',
            color: 'border-emerald-500/30 bg-emerald-500/10'
        },
        {
            role: 'AI Research Intern',
            company: 'Google DeepMind',
            type: 'Research Lab',
            location: 'Bangalore / Remote',
            duration: '6 Months',
            stipend: '₹80,000/mo',
            skills: ['PyTorch', 'Generative AI', 'LLMs'],
            eligibility: 'PhD/Research Track',
            category: 'Research',
            link: 'https://deepmind.google/discover/careers/',
            color: 'border-red-500/30 bg-red-500/10'
        },
        {
            role: 'Cloud Infrastructure Intern',
            company: 'Razorpay',
            type: 'FinTech',
            location: 'Bangalore',
            duration: '6 Months',
            stipend: '₹45,000/mo',
            skills: ['AWS', 'Kubernetes', 'Terraform'],
            eligibility: 'DevOps Interest',
            category: 'Cloud/DevOps',
            link: 'https://razorpay.com/jobs/',
            color: 'border-blue-500/30 bg-blue-500/10'
        },
        {
            role: 'SDE Intern',
            company: 'Flipkart',
            type: 'E-commerce',
            location: 'Bangalore',
            duration: '3 Months',
            stipend: '₹40,000/mo',
            skills: ['Java', 'Spring Boot', 'React'],
            eligibility: 'Pre-final Year Students',
            category: 'Software Development',
            link: 'https://www.flipkartcareers.com/',
            color: 'border-yellow-500/30 bg-yellow-500/10'
        }
    ];

    const filteredInternships = activeTab === 'All'
        ? internships
        : internships.filter(item => item.category === activeTab);

    return (
        <div className="min-h-screen theme-bg" data-theme={theme}>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 pt-24 pb-20">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-4">
                        Find Your Dream Internship
                    </h1>
                    <p className="text-lg theme-text-muted max-w-3xl mx-auto">
                        Curated opportunities in top startups, MNCs, and research labs.
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveTab(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === cat
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Internship List */}
                <div className="space-y-4">
                    {filteredInternships.map((internship, idx) => (
                        <motion.div
                            key={idx}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`theme-card p-6 rounded-2xl border ${internship.color} hover:bg-slate-800/50 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center`}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold theme-text">{internship.role}</h3>
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded theme-bg-secondary theme-text-secondary">
                                        {internship.type}
                                    </span>
                                </div>

                                <div className="text-sm font-medium text-emerald-400 mb-3">
                                    {internship.company} • {internship.location}
                                </div>

                                <div className="flex flex-wrap gap-4 text-xs theme-text-muted mb-4">
                                    <span className="flex items-center gap-1">
                                        🕒 {internship.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        💰 {internship.stipend}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        🎓 {internship.eligibility}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {internship.skills.map((skill, sidx) => (
                                        <span key={sidx} className="text-[10px] px-2 py-1 rounded theme-bg-secondary theme-text-secondary border theme-border">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full md:w-auto flex-shrink-0">
                                <a
                                    href={internship.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full md:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-center transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    Apply Now
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InternshipsPage;
