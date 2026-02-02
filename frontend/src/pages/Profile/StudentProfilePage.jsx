import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { fetchParsedResume } from '../../api/aiApi.js';
import { uploadProfilePhoto, deleteProfilePhoto, getFullProfile, updateBasicProfile, updateEducation, updateSkills, updateCertifications, updateInternships, updateSocials } from '../../api/userApi.js';
import { motion, AnimatePresence } from 'framer-motion';

const StudentProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);
  
  // Photo modal states
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Edit profile modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    careerGoal: '',
    year: '',
    branch: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // Edit education modal states
  const [showEditEducation, setShowEditEducation] = useState(false);
  const [editEducationData, setEditEducationData] = useState({
    university: '',
    degree: '',
    startYear: '',
    endYear: '',
    cgpa: ''
  });
  const [editEducationLoading, setEditEducationLoading] = useState(false);
  const [editEducationError, setEditEducationError] = useState(null);

  // Edit skills modal states
  const [showEditSkills, setShowEditSkills] = useState(false);
  const [editSkillsData, setEditSkillsData] = useState('');
  const [editSkillsLoading, setEditSkillsLoading] = useState(false);
  const [editSkillsError, setEditSkillsError] = useState(null);

  // Edit certifications modal states
  const [showEditCertifications, setShowEditCertifications] = useState(false);
  const [editCertificationsData, setEditCertificationsData] = useState([]);
  const [editCertificationsLoading, setEditCertificationsLoading] = useState(false);
  const [editCertificationsError, setEditCertificationsError] = useState(null);

  // Edit internships modal states
  const [showEditInternships, setShowEditInternships] = useState(false);
  const [editInternshipsData, setEditInternshipsData] = useState([]);
  const [editInternshipsLoading, setEditInternshipsLoading] = useState(false);
  const [editInternshipsError, setEditInternshipsError] = useState(null);

  // Edit socials modal states
  const [showEditSocials, setShowEditSocials] = useState(false);
  const [editSocialsData, setEditSocialsData] = useState({
    github: '',
    linkedin: '',
    portfolio: '',
    resume: ''
  });
  const [editSocialsLoading, setEditSocialsLoading] = useState(false);
  const [editSocialsError, setEditSocialsError] = useState(null);

  // Fetch profile data on mount
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch profile data
        const profileRes = await getFullProfile();
        
        // Merge with default static data
        const defaultData = {
          profile: {
            name: user?.name || 'Student Name',
            email: user?.email || 'student@example.com',
            photoUrl: user?.profile?.photoUrl || null,
            year: 'Final Year',
            branch: 'Computer Science',
            careerGoal: 'Full Stack Developer'
          },
          education: {
            university: 'XYZ University',
            degree: 'B.Tech Computer Science',
            startYear: 2020,
            endYear: 2024,
            cgpa: '8.5'
          },
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'SQL'],
          gamification: {
            xp: 2450,
            level: 7,
            streakDays: 15
          },
          certifications: profileRes.data?.certifications || [
            { name: 'React Certification', organization: 'Udemy', year: 2023, credentialUrl: 'https://udemy.com' },
            { name: 'AWS Solutions Architect', organization: 'Amazon', year: 2023, credentialUrl: 'https://aws.amazon.com' }
          ],
          internships: profileRes.data?.internships || [
            { role: 'Frontend Developer Intern', company: 'Tech Startup', duration: 'Jun 2023 - Aug 2023', skillsGained: ['React', 'Tailwind'], matchScore: 85 },
            { role: 'Full Stack Developer Intern', company: 'Web Agency', duration: 'Jan 2024 - Mar 2024', skillsGained: ['MERN', 'REST API'], matchScore: 90 }
          ],
          socials: profileRes.data?.socials || {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            portfolio: 'https://portfolio.com',
            resume: 'https://resume.com'
          },
          profileCompletion: 85
        };

        // Merge API response with defaults
        const mergedData = {
          ...defaultData,
          ...profileRes.data,
          profile: { ...defaultData.profile, ...profileRes.data?.profile },
          education: { ...defaultData.education, ...profileRes.data?.education },
          gamification: { ...defaultData.gamification, ...profileRes.data?.gamification },
          certifications: profileRes.data?.certifications || defaultData.certifications,
          internships: profileRes.data?.internships || defaultData.internships,
          socials: { ...defaultData.socials, ...profileRes.data?.socials }
        };

        setProfileData(mergedData);

        // Fetch analytics data (optional)
        try {
          setAnalyticsData(mergedData);
        } catch {
          // Analytics optional
        }

        // Fetch resume data
        try {
          const resumeRes = await fetchParsedResume();
          setResumeData(resumeRes.data);
        } catch {
          // Resume optional
        }

        setError(null);
      } catch (err) {
        // If API fails, use default data
        const defaultData = {
          profile: {
            name: user?.name || 'Student Name',
            email: user?.email || 'student@example.com',
            year: 'Final Year',
            branch: 'Computer Science',
            careerGoal: 'Full Stack Developer'
          },
          education: {
            university: 'XYZ University',
            degree: 'B.Tech Computer Science',
            startYear: 2020,
            endYear: 2024,
            cgpa: '8.5'
          },
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'SQL'],
          certifications: [
            { name: 'React Certification', organization: 'Udemy', year: 2023, credentialUrl: 'https://udemy.com' },
            { name: 'AWS Solutions Architect', organization: 'Amazon', year: 2023, credentialUrl: 'https://aws.amazon.com' }
          ],
          internships: [
            { role: 'Frontend Developer Intern', company: 'Tech Startup', duration: 'Jun 2023 - Aug 2023', skillsGained: ['React', 'Tailwind'], matchScore: 85 },
            { role: 'Full Stack Developer Intern', company: 'Web Agency', duration: 'Jan 2024 - Mar 2024', skillsGained: ['MERN', 'REST API'], matchScore: 90 }
          ],
          socials: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            portfolio: 'https://portfolio.com',
            resume: 'https://resume.com'
          },
          gamification: {
            xp: 2450,
            level: 7,
            streakDays: 15
          },
          profileCompletion: 85
        };
        setProfileData(defaultData);
        console.error('Using default data - API error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('http')) return photoUrl;
    // Use VITE_API_URL from environment, default to localhost:5001
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const backendUrl = apiUrl.replace('/api', '');
    return `${backendUrl}${photoUrl}`;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);
      
      await uploadProfilePhoto(formData);
      await refreshUser();
      
      setShowPhotoModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) return;
    
    setUploading(true);
    try {
      await deleteProfilePhoto();
      await refreshUser();
      setShowPhotoModal(false);
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Failed to delete photo');
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setShowPhotoModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
  };

  const openEditModal = () => {
    setEditFormData({
      careerGoal: profile.careerGoal || '',
      year: profile.year || '',
      branch: profile.branch || ''
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditFormData({ careerGoal: '', year: '', branch: '' });
    setEditError(null);
  };

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async () => {
    if (!editFormData.year || !editFormData.branch) {
      setEditError('Year and Branch are required');
      return;
    }

    setEditLoading(true);
    try {
      await updateBasicProfile(editFormData);
      
      // Reload profile data
      const profileRes = await getFullProfile();
      setProfileData(profileRes.data);
      closeEditModal();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  // Education handlers
  const openEditEducation = () => {
    setEditEducationData({
      university: education.university || '',
      degree: education.degree || '',
      startYear: education.startYear || '',
      endYear: education.endYear || '',
      cgpa: education.cgpa || ''
    });
    setEditEducationError(null);
    setShowEditEducation(true);
  };

  const closeEditEducation = () => {
    setShowEditEducation(false);
    setEditEducationData({ university: '', degree: '', startYear: '', endYear: '', cgpa: '' });
    setEditEducationError(null);
  };

  const handleEducationChange = (field, value) => {
    setEditEducationData(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationSubmit = async () => {
    if (!editEducationData.university || !editEducationData.degree) {
      setEditEducationError('University and Degree are required');
      return;
    }
    setEditEducationLoading(true);
    try {
      await updateEducation(editEducationData);
      const profileRes = await getFullProfile();
      setProfileData(prevData => ({
        ...prevData,
        ...profileRes.data,
        profile: { ...prevData.profile, ...profileRes.data?.profile },
        education: profileRes.data?.education || prevData.education,
        gamification: { ...prevData.gamification, ...profileRes.data?.gamification },
        skills: profileRes.data?.skills || prevData.skills,
        certifications: profileRes.data?.certifications || prevData.certifications,
        internships: profileRes.data?.internships || prevData.internships,
        socials: { ...prevData.socials, ...profileRes.data?.socials }
      }));
      closeEditEducation();
    } catch (err) {
      setEditEducationError(err.response?.data?.message || 'Failed to update education');
    } finally {
      setEditEducationLoading(false);
    }
  };

  // Skills handlers
  const openEditSkills = () => {
    setEditSkillsData(Array.isArray(skills) ? skills.map(s => typeof s === 'string' ? s : s.name).join(', ') : '');
    setEditSkillsError(null);
    setShowEditSkills(true);
  };

  const closeEditSkills = () => {
    setShowEditSkills(false);
    setEditSkillsData('');
    setEditSkillsError(null);
  };

  const handleSkillsSubmit = async () => {
    if (!editSkillsData.trim()) {
      setEditSkillsError('Skills cannot be empty');
      return;
    }
    const skillsArray = editSkillsData.split(',').map(s => s.trim()).filter(s => s);
    setEditSkillsLoading(true);
    try {
      await updateSkills({ skills: skillsArray });
      const profileRes = await getFullProfile();
      
      // Merge the fetched data with existing profile data to maintain structure
      setProfileData(prevData => ({
        ...prevData,
        ...profileRes.data,
        profile: { ...prevData.profile, ...profileRes.data?.profile },
        education: { ...prevData.education, ...profileRes.data?.education },
        gamification: { ...prevData.gamification, ...profileRes.data?.gamification },
        skills: profileRes.data?.skills || prevData.skills,
        certifications: profileRes.data?.certifications || prevData.certifications,
        internships: profileRes.data?.internships || prevData.internships,
        socials: { ...prevData.socials, ...profileRes.data?.socials }
      }));
      closeEditSkills();
    } catch (err) {
      setEditSkillsError(err.response?.data?.message || 'Failed to update skills');
    } finally {
      setEditSkillsLoading(false);
    }
  };

  // Certifications handlers
  const openEditCertifications = () => {
    setEditCertificationsData(Array.isArray(certifications) ? certifications : []);
    setEditCertificationsError(null);
    setShowEditCertifications(true);
  };

  const closeEditCertifications = () => {
    setShowEditCertifications(false);
    setEditCertificationsData([]);
    setEditCertificationsError(null);
  };

  const handleCertificationsSubmit = async () => {
    setEditCertificationsLoading(true);
    try {
      await updateCertifications({ certifications: editCertificationsData });
      const profileRes = await getFullProfile();
      setProfileData(prevData => ({
        ...prevData,
        ...profileRes.data,
        profile: { ...prevData.profile, ...profileRes.data?.profile },
        education: { ...prevData.education, ...profileRes.data?.education },
        gamification: { ...prevData.gamification, ...profileRes.data?.gamification },
        skills: profileRes.data?.skills || prevData.skills,
        certifications: profileRes.data?.certifications || prevData.certifications,
        internships: profileRes.data?.internships || prevData.internships,
        socials: { ...prevData.socials, ...profileRes.data?.socials }
      }));
      closeEditCertifications();
    } catch (err) {
      setEditCertificationsError(err.response?.data?.message || 'Failed to update certifications');
    } finally {
      setEditCertificationsLoading(false);
    }
  };

  // Internships handlers
  const openEditInternships = () => {
    setEditInternshipsData(Array.isArray(internships) ? internships : []);
    setEditInternshipsError(null);
    setShowEditInternships(true);
  };

  const closeEditInternships = () => {
    setShowEditInternships(false);
    setEditInternshipsData([]);
    setEditInternshipsError(null);
  };

  const handleInternshipsSubmit = async () => {
    setEditInternshipsLoading(true);
    try {
      await updateInternships({ internships: editInternshipsData });
      const profileRes = await getFullProfile();
      setProfileData(prevData => ({
        ...prevData,
        ...profileRes.data,
        profile: { ...prevData.profile, ...profileRes.data?.profile },
        education: { ...prevData.education, ...profileRes.data?.education },
        gamification: { ...prevData.gamification, ...profileRes.data?.gamification },
        skills: profileRes.data?.skills || prevData.skills,
        certifications: profileRes.data?.certifications || prevData.certifications,
        internships: profileRes.data?.internships || prevData.internships,
        socials: { ...prevData.socials, ...profileRes.data?.socials }
      }));
      closeEditInternships();
    } catch (err) {
      setEditInternshipsError(err.response?.data?.message || 'Failed to update internships');
    } finally {
      setEditInternshipsLoading(false);
    }
  };

  // Socials handlers
  const openEditSocials = () => {
    setEditSocialsData({
      github: socials.github || '',
      linkedin: socials.linkedin || '',
      portfolio: socials.portfolio || '',
      resume: socials.resume || ''
    });
    setEditSocialsError(null);
    setShowEditSocials(true);
  };

  const closeEditSocials = () => {
    setShowEditSocials(false);
    setEditSocialsData({ github: '', linkedin: '', portfolio: '', resume: '' });
    setEditSocialsError(null);
  };

  const handleSocialsChange = (field, value) => {
    setEditSocialsData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialsSubmit = async () => {
    setEditSocialsLoading(true);
    try {
      await updateSocials(editSocialsData);
      const profileRes = await getFullProfile();
      setProfileData(prevData => ({
        ...prevData,
        ...profileRes.data,
        profile: { ...prevData.profile, ...profileRes.data?.profile },
        education: { ...prevData.education, ...profileRes.data?.education },
        gamification: { ...prevData.gamification, ...profileRes.data?.gamification },
        skills: profileRes.data?.skills || prevData.skills,
        certifications: profileRes.data?.certifications || prevData.certifications,
        internships: profileRes.data?.internships || prevData.internships,
        socials: { ...prevData.socials, ...profileRes.data?.socials }
      }));
      closeEditSocials();
    } catch (err) {
      setEditSocialsError(err.response?.data?.message || 'Failed to update socials');
    } finally {
      setEditSocialsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg" data-theme={theme}>
        <Navbar showProfileIcon={true} showNavLinks={false} />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"
          />
        </div>
      </div>
    );
  }

  const profile = profileData?.profile || {};
  const education = profileData?.education || {};
  const skills = profileData?.skills || [];
  const certifications = profileData?.certifications || [];
  const internships = profileData?.internships || [];
  const socials = profileData?.socials || {};
  const gam = profileData?.gamification || {};
  
  const photoUrl = getPhotoUrl(profile.photoUrl);
  const completionPercent = profileData?.profileCompletion || 0;

  return (
    <div className="min-h-screen theme-bg" data-theme={theme}>
      <Navbar showProfileIcon={true} showNavLinks={false} />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-10 space-y-8">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Top: Avatar + Basic Info + XP Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 md:flex-row"
        >
          <div className="flex flex-1 items-center gap-5 theme-card p-6">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-green-100 to-blue-100 shadow-2xl">
                {photoUrl ? (
                  <img src={photoUrl} alt={user?.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-black bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 text-white">
                    {user?.name?.[0] || 'S'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setShowPhotoModal(true)}
                    className="text-white text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
                  >
                    📷 Change
                  </button>
                </div>
              </div>
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 border-4 border-white shadow-lg">
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
              </div>
              <button
                onClick={() => setShowPhotoModal(true)}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-black theme-text mb-1">{user?.name}</h1>
              <p className="text-sm theme-text-muted">{user?.email}</p>
              <p className="mt-2 text-xs theme-text-secondary inline-flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-green-100 text-green-700 font-semibold">{profile.year || 'Year N/A'}</span>
                <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 font-semibold">{profile.branch || 'Branch N/A'}</span>
              </p>
              {profile.careerGoal && (
                <p className="mt-2 text-sm font-semibold text-blue-600">🎯 Goal: {profile.careerGoal}</p>
              )}
              <button
                onClick={openEditModal}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>
          <div className="grid flex-1 gap-4 theme-card p-6 md:grid-cols-3">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">XP Points</p>
              <p className="text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{gam.xp ?? 0}</p>
              <p className="text-xs theme-text-muted mt-2">Level {gam.level ?? 1}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Streak Fire</p>
              <p className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{gam.streakDays ?? 0}</p>
              <p className="text-xs theme-text-muted mt-2">days in a row</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Profile Complete</p>
              <p className="text-3xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{completionPercent}%</p>
              <div className="mt-3 h-2.5 w-full rounded-full bg-gray-100 shadow-inner overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Education Details */}
        {education && Object.keys(education).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl theme-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black theme-text">🎓 Education</h2>
              <button
                onClick={openEditEducation}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all"
              >
                ✏️ Edit
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">University</p>
                <p className="text-lg font-semibold theme-text">{education.university || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Degree</p>
                <p className="text-lg font-semibold theme-text">{education.degree || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Duration</p>
                <p className="text-lg font-semibold theme-text">{education.startYear && education.endYear ? `${education.startYear} - ${education.endYear}` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">CGPA / Percentage</p>
                <p className="text-lg font-semibold text-green-600">{education.cgpa || 'N/A'}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skills & Analytics */}
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 rounded-2xl theme-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-black theme-text">Technical Skills</p>
              <button
                onClick={openEditSkills}
                className="px-2 py-1 text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded hover:shadow-lg transition-all"
              >
                ✏️
              </button>
            </div>
            <div className="space-y-4">
              {skills.length > 0 ? (
                skills.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold theme-text">{typeof skill === 'string' ? skill : skill.name}</span>
                      <span className="text-sm font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">{typeof skill === 'string' ? '50' : skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${typeof skill === 'string' ? 50 : skill.level}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + idx * 0.05 }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No skills added yet</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 rounded-2xl theme-card p-6"
          >
            <p className="text-sm font-black theme-text">Career Analytics</p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold theme-text">Career Readiness</span>
                  <span className="text-lg font-bold text-green-600">{analyticsData?.careerReadiness || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${analyticsData?.careerReadiness || 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold theme-text">Skill Strength</span>
                  <span className="text-lg font-bold text-blue-600">{analyticsData?.skillStrength || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${analyticsData?.skillStrength || 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold theme-text">Interest Alignment</span>
                  <span className="text-lg font-bold text-purple-600">{analyticsData?.interestAlignment || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${analyticsData?.interestAlignment || 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold theme-text">Resume Score</span>
                  <span className="text-lg font-bold text-orange-600">{analyticsData?.resumeScore || profile.resumeScore || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${(analyticsData?.resumeScore || profile.resumeScore || 0)}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl theme-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black theme-text">📜 Certifications & Courses</h2>
              <button
                onClick={openEditCertifications}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all"
              >
                ✏️ Edit
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {certifications.map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-4 hover:shadow-md transition-shadow"
                >
                  <p className="font-bold text-gray-800">{cert.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{cert.organization}</p>
                  <p className="text-xs text-gray-500 mt-2">{cert.year}</p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-semibold text-blue-600 hover:underline mt-2"
                    >
                      View Credential →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Internships & Experience */}
        {internships.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl theme-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black theme-text">💼 Internships & Experience</h2>
              <button
                onClick={openEditInternships}
                className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all"
              >
                ✏️ Edit
              </button>
            </div>
            <div className="space-y-4">
              {internships.map((internship, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-black text-gray-800">{internship.role}</p>
                      <p className="text-sm text-gray-600 mt-1">{internship.company}</p>
                      <p className="text-xs text-gray-500 mt-2">{internship.duration}</p>
                      {internship.skillsGained && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {internship.skillsGained.map((skill, sidx) => (
                            <span key={sidx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {internship.matchScore && (
                      <div className="text-right">
                        <p className="text-2xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{internship.matchScore}%</p>
                        <p className="text-xs text-gray-500">Match Score</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Social Links */}
        {Object.keys(socials).some(key => socials[key]) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl theme-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black theme-text">🔗 Social & Portfolio Links</h2>
              <button
                onClick={openEditSocials}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all hover:scale-105"
              >
                ✏️ Edit Links
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {socials.github && (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group"
                >
                  <a 
                    href={socials.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex flex-col h-full items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white hover:shadow-2xl transition-all group-hover:from-gray-700 group-hover:to-gray-800"
                  >
                    <span className="text-4xl">🐙</span>
                    <span className="font-bold text-center">GitHub</span>
                    <span className="text-xs text-gray-300 text-center line-clamp-2 group-hover:line-clamp-none overflow-hidden">
                      {socials.github.replace('https://', '').replace('http://', '')}
                    </span>
                  </a>
                </motion.div>
              )}
              {socials.linkedin && (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group"
                >
                  <a 
                    href={socials.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex flex-col h-full items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:shadow-2xl transition-all group-hover:from-blue-500 group-hover:to-blue-600"
                  >
                    <span className="text-4xl">💼</span>
                    <span className="font-bold text-center">LinkedIn</span>
                    <span className="text-xs text-blue-100 text-center line-clamp-2 group-hover:line-clamp-none overflow-hidden">
                      {socials.linkedin.replace('https://', '').replace('http://', '')}
                    </span>
                  </a>
                </motion.div>
              )}
              {socials.portfolio && (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group"
                >
                  <a 
                    href={socials.portfolio} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex flex-col h-full items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 text-white hover:shadow-2xl transition-all group-hover:from-purple-500 group-hover:to-purple-600"
                  >
                    <span className="text-4xl">🌐</span>
                    <span className="font-bold text-center">Portfolio</span>
                    <span className="text-xs text-purple-100 text-center line-clamp-2 group-hover:line-clamp-none overflow-hidden">
                      {socials.portfolio.replace('https://', '').replace('http://', '')}
                    </span>
                  </a>
                </motion.div>
              )}
              {socials.resume && (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group"
                >
                  <a 
                    href={socials.resume} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex flex-col h-full items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white hover:shadow-2xl transition-all group-hover:from-red-500 group-hover:to-red-600"
                  >
                    <span className="text-4xl">📄</span>
                    <span className="font-bold text-center">Resume</span>
                    <span className="text-xs text-red-100 text-center line-clamp-2 group-hover:line-clamp-none overflow-hidden">
                      {socials.resume.replace('https://', '').replace('http://', '')}
                    </span>
                  </a>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Achievements */}
        {gam.badges && gam.badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl theme-card p-6"
          >
            <h2 className="text-xl font-black theme-text mb-6">🏆 Achievements & Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gam.badges.map((badge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 p-4 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-2">🎖️</div>
                  <div className="text-sm font-bold text-gray-800">{badge}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Activity & Growth Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl theme-card p-6"
        >
          <h2 className="text-xl font-black theme-text mb-6">📈 Activity & Growth</h2>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500"
            >
              <span className="text-3xl">📚</span>
              <div className="flex-1">
                <p className="font-bold text-gray-800">Added 6 Technical Skills</p>
                <p className="text-xs text-gray-600">React, Node.js, MongoDB, Python, JavaScript, SQL</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">Today</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500"
            >
              <span className="text-3xl">💼</span>
              <div className="flex-1">
                <p className="font-bold text-gray-800">Completed 2 Internships</p>
                <p className="text-xs text-gray-600">Frontend Developer & Full Stack Developer roles</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">3 days ago</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500"
            >
              <span className="text-3xl">🏅</span>
              <div className="flex-1">
                <p className="font-bold text-gray-800">Earned AWS Solutions Architect Certification</p>
                <p className="text-xs text-gray-600">Credential verified and added to profile</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">1 week ago</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500"
            >
              <span className="text-3xl">🎯</span>
              <div className="flex-1">
                <p className="font-bold text-gray-800">Career Readiness Score Increased to 82%</p>
                <p className="text-xs text-gray-600">Based on your profile completeness and experience</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">2 weeks ago</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Profile Completeness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl theme-card p-6"
        >
          <h2 className="text-xl font-black theme-text mb-6">✅ Profile Completeness</h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold theme-text">{completionPercent}% Complete</span>
              <span className="text-sm text-gray-500 font-semibold">
                {completionPercent >= 90 ? '🌟 Excellent!' : completionPercent >= 70 ? '✨ Good' : completionPercent >= 50 ? '👍 Fair' : '⚠️ Needs Work'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '👤', label: 'Basic Info', completed: true, items: ['Name', 'Email', 'Photo'] },
              { icon: '🎓', label: 'Education', completed: true, items: ['University', 'Degree', 'CGPA'] },
              { icon: '💻', label: 'Skills', completed: true, items: ['6 skills added'] },
              { icon: '📜', label: 'Certifications', completed: true, items: ['2 certifications'] },
              { icon: '💼', label: 'Internships', completed: true, items: ['2 internships'] },
              { icon: '🔗', label: 'Social Links', completed: true, items: ['GitHub', 'LinkedIn'] },
              { icon: '🎯', label: 'Career Goal', completed: true, items: ['Full Stack Developer'] },
              { icon: '📊', label: 'Analytics', completed: false, items: ['Pending AI assessment'] }
            ].map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.85 + idx * 0.05 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  section.completed
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{section.icon}</span>
                    <span className="font-bold text-gray-800">{section.label}</span>
                  </div>
                  {section.completed ? (
                    <span className="text-green-600 font-bold text-xl">✓</span>
                  ) : (
                    <span className="text-gray-400 font-bold text-xl">○</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {section.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        section.completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {completionPercent < 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500"
            >
              <p className="font-bold text-gray-800 mb-2">🎯 Next Steps to Complete Your Profile:</p>
              {completionPercent < 100 && (
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  {completionPercent < 90 && <li>• Wait for AI Career Assessment to complete analytics</li>}
                  <li>• Keep your social links updated with latest URLs</li>
                  <li>• Add more relevant skills and certifications</li>
                  <li>• Update your profile photo for better visibility</li>
                </ul>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Photo Upload Modal */}
      <AnimatePresence>
        {showPhotoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">📷 Update Profile Photo</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Preview Circle */}
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-spin" style={{ animationDuration: '3s' }}></div>
                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white dark:border-slate-700 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-600 dark:to-slate-700 shadow-lg">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                      ) : photoUrl ? (
                        <img src={photoUrl} alt="Current" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-6xl font-black bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white">
                          {user?.name?.[0]?.toUpperCase() || 'S'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {uploadError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200 text-sm font-medium">
                    ⚠️ {uploadError}
                  </div>
                )}

                {/* File Input (Hidden) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Choose profile photo"
                />

                {/* File Selection Status */}
                {selectedFile && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-200 font-medium">
                      ✓ Selected: <span className="font-semibold">{selectedFile.name}</span>
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700/50">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📁 Choose Photo
                </button>

                {selectedFile && (
                  <button
                    onClick={handlePhotoUpload}
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <span>Upload Photo</span>
                      </>
                    )}
                  </button>
                )}

                {profile.photoUrl && (
                  <button
                    onClick={handlePhotoDelete}
                    disabled={uploading}
                    className="w-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 font-semibold py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🗑️ Remove Current Photo
                  </button>
                )}

                <button
                  onClick={closeModal}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={closeEditModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                  <button
                    onClick={closeEditModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {editError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {editError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🎯 Career Goal
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., AI/ML Engineer, Data Scientist"
                      value={editFormData.careerGoal}
                      onChange={(e) => handleEditChange('careerGoal', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      📚 Year *
                    </label>
                    <select
                      value={editFormData.year}
                      onChange={(e) => handleEditChange('year', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🔬 Branch *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Computer Science, Electronics"
                      value={editFormData.branch}
                      onChange={(e) => handleEditChange('branch', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700/50 rounded-b-2xl">
                  <button
                    onClick={closeEditModal}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    disabled={editLoading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {editLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>✓</span>
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Edit Education Modal */}
      <AnimatePresence>
        {showEditEducation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={closeEditEducation}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Education</h2>
                  <button onClick={closeEditEducation} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {editEducationError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{editEducationError}</div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">University</label>
                    <input
                      type="text"
                      value={editEducationData.university}
                      onChange={(e) => handleEducationChange('university', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Degree</label>
                    <input
                      type="text"
                      value={editEducationData.degree}
                      onChange={(e) => handleEducationChange('degree', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Year</label>
                      <input
                        type="number"
                        value={editEducationData.startYear}
                        onChange={(e) => handleEducationChange('startYear', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Year</label>
                      <input
                        type="number"
                        value={editEducationData.endYear}
                        onChange={(e) => handleEducationChange('endYear', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CGPA / Percentage</label>
                    <input
                      type="text"
                      value={editEducationData.cgpa}
                      onChange={(e) => handleEducationChange('cgpa', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={closeEditEducation} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all">Cancel</button>
                  <button onClick={handleEducationSubmit} disabled={editEducationLoading} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {editEducationLoading ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>Saving...</> : <>✓ Save</>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Edit Skills Modal */}
      <AnimatePresence>
        {showEditSkills && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={closeEditSkills}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Skills</h2>
                  <button onClick={closeEditSkills} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {editSkillsError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{editSkillsError}</div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Skills (comma-separated)</label>
                    <textarea
                      value={editSkillsData}
                      onChange={(e) => setEditSkillsData(e.target.value)}
                      placeholder="e.g., Python, JavaScript, React, Node.js"
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={closeEditSkills} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all">Cancel</button>
                  <button onClick={handleSkillsSubmit} disabled={editSkillsLoading} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {editSkillsLoading ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>Saving...</> : <>✓ Save</>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Edit Socials Modal */}
      <AnimatePresence>
        {showEditSocials && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={closeEditSocials}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Social Links</h2>
                  <button onClick={closeEditSocials} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {editSocialsError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{editSocialsError}</div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🐙 GitHub URL</label>
                    <input type="url" value={editSocialsData.github} onChange={(e) => handleSocialsChange('github', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💼 LinkedIn URL</label>
                    <input type="url" value={editSocialsData.linkedin} onChange={(e) => handleSocialsChange('linkedin', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🌐 Portfolio URL</label>
                    <input type="url" value={editSocialsData.portfolio} onChange={(e) => handleSocialsChange('portfolio', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📄 Resume URL</label>
                    <input type="url" value={editSocialsData.resume} onChange={(e) => handleSocialsChange('resume', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={closeEditSocials} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all">Cancel</button>
                  <button onClick={handleSocialsSubmit} disabled={editSocialsLoading} className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {editSocialsLoading ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>Saving...</> : <>✓ Save</>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default StudentProfilePage;
