import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { motion } from 'framer-motion';

const CoursesPage = () => {
    const { theme } = useTheme();
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Programming', 'Web Dev', 'Data Science', 'Cloud', 'Interview Prep'];

    const courses = [
        {
            title: 'CS50: Introduction to Computer Science',
            platform: 'Harvard University / edX',
            level: 'Beginner',
            category: 'Programming',
            description: 'An entry-level course teaching you how to think algorithmically and solve problems efficiently.',
            skills: ['C', 'Python', 'SQL', 'Algorithms', 'Data Structures'],
            link: 'https://pll.harvard.edu/course/cs50-introduction-computer-science',
            color: 'border-red-500/30 bg-red-500/10'
        },
        {
            title: 'Full Stack Open',
            platform: 'University of Helsinki',
            level: 'Intermediate',
            category: 'Web Dev',
            description: 'Deep dive into modern web development with React, Redux, Node.js, MongoDB, GraphQL, and TypeScript.',
            skills: ['React', 'Node.js', 'GraphQL', 'TypeScript', 'CI/CD'],
            link: 'https://fullstackopen.com/en/',
            color: 'border-blue-500/30 bg-blue-500/10'
        },
        {
            title: 'Google Data Analytics Professional Certificate',
            platform: 'Coursera',
            level: 'Beginner',
            category: 'Data Science',
            description: 'Learn the practices and processes used by typical junior data analysts in their day-to-day job.',
            skills: ['Spreadsheets', 'SQL', 'R Programming', 'Tableau', 'Data Cleaning'],
            link: 'https://www.coursera.org/professional-certificates/google-data-analytics',
            color: 'border-yellow-500/30 bg-yellow-500/10'
        },
        {
            title: 'The Odin Project',
            platform: 'The Odin Project',
            level: 'Beginner to Advanced',
            category: 'Web Dev',
            description: 'A full stack curriculum is free and supported by a passionate open source community.',
            skills: ['HTML/CSS', 'JavaScript', 'React', 'Ruby on Rails', 'Git'],
            link: 'https://www.theodinproject.com/',
            color: 'border-amber-600/30 bg-amber-600/10'
        },
        {
            title: 'AWS Cloud Practitioner Essentials',
            platform: 'AWS Skill Builder',
            level: 'Beginner',
            category: 'Cloud',
            description: 'Learn the fundamentals of the AWS Cloud to build skills and confidence.',
            skills: ['Cloud Computing', 'AWS Services', 'Security', 'Architecture'],
            link: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
            color: 'border-orange-500/30 bg-orange-500/10'
        },
        {
            title: 'LeetCode Top Interview 150',
            platform: 'LeetCode',
            level: 'Intermediate',
            category: 'Interview Prep',
            description: 'Must-do list of 150 interview questions to prepare for top product-based companies.',
            skills: ['Problem Solving', 'Algorithms', 'Interview Patterns'],
            link: 'https://leetcode.com/studyplan/top-interview-150/',
            color: 'border-green-500/30 bg-green-500/10'
        },
        {
            title: 'System Design Primer',
            platform: 'GitHub',
            level: 'Advanced',
            category: 'Interview Prep',
            description: 'Learn how to design large-scale systems. Preparation for the system design interview.',
            skills: ['Scalability', 'Distributed Systems', 'Load Balancing', 'Caching'],
            link: 'https://github.com/donnemartin/system-design-primer',
            color: 'border-purple-500/30 bg-purple-500/10'
        },
        {
            title: 'Python for Everybody',
            platform: 'Coursera / University of Michigan',
            level: 'Beginner',
            category: 'Programming',
            description: 'This specialization builds on the success of the Python for Everybody course and will introduce fundamental programming concepts.',
            skills: ['Python', 'Data Structures', 'Web Data', 'Databases'],
            link: 'https://www.coursera.org/specializations/python',
            color: 'border-sky-500/30 bg-sky-500/10'
        }
    ];

    const filteredCourses = filter === 'All'
        ? courses
        : courses.filter(course => course.category === filter || (filter === 'Web Dev' && course.category === 'Web Dev'));

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
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-4">
                        Curated Learning Resources
                    </h1>
                    <p className="text-lg theme-text-muted max-w-3xl mx-auto">
                        Handpicked courses and roadmaps to accelerate your career in technology.
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, idx) => (
                        <motion.div
                            key={idx}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`theme-card p-6 rounded-2xl border ${course.color} hover:shadow-xl transition-all group`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                                    {course.platform}
                                </span>
                                <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-white/10">
                                    {course.level}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">
                                {course.title}
                            </h3>

                            <p className="text-sm theme-text-muted mb-4 line-clamp-3">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {course.skills.map((skill, sidx) => (
                                    <span key={sidx} className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <a
                                href={course.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium text-sm hover:from-indigo-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-indigo-500/25"
                            >
                                Start Learning
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;
