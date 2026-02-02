import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import HeroSection from '../../components/landing/HeroSection.jsx';
import OfferingsSection from '../../components/landing/OfferingsSection.jsx';
import StatsSection from '../../components/landing/StatsSection.jsx';
import TestimonialsSection from '../../components/landing/TestimonialsSection.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import '../../styles/landing.css';

const LandingPage = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Scroll to top when landing page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-root" data-theme={theme}>
      <Navbar />
      <main className="landing-main">
        <HeroSection />
        <OfferingsSection />
        <StatsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
