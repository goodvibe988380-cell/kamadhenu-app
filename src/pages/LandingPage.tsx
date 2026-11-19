import React, { useCallback } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import StorySection from '@/components/landing/StorySection';
import CowStory from '@/components/landing/CowStory';
import MilkJourney from '@/components/landing/MilkJourney';
import JunnuStory from '@/components/landing/JunnuStory';
import ProductShowcase from '@/components/landing/ProductShowcase';
import PreparationGuide from '@/components/landing/PreparationGuide';
import QualitySection from '@/components/landing/QualitySection';
import CallToAction from '@/components/landing/CallToAction';
import ProprietorContact from '@/components/landing/ProprietorContact';
import Footer from '@/components/landing/Footer';
import '@/styles/landing.css';

interface LandingPageProps {
  onLoginClick: () => void;
  onDashboardClick?: () => void;
  isAuthenticated?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onLoginClick,
  onDashboardClick,
  isAuthenticated = false,
}) => {
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleExploreStory = useCallback(() => {
    scrollToSection('our-story');
  }, [scrollToSection]);

  const handleDiscoverProduct = useCallback(() => {
    scrollToSection('our-product');
  }, [scrollToSection]);

  return (
    <div className="kj-landing">
      <Navbar
        onLoginClick={onLoginClick}
        onDashboardClick={onDashboardClick}
        isAuthenticated={isAuthenticated}
      />
      <Hero
        onExploreStory={handleExploreStory}
        onDiscoverProduct={handleDiscoverProduct}
      />
      <StorySection />
      <CowStory />
      <MilkJourney />
      <JunnuStory />
      <ProductShowcase
        onLoginClick={isAuthenticated && onDashboardClick ? onDashboardClick : onLoginClick}
        isAuthenticated={isAuthenticated}
      />
      <PreparationGuide />
      <QualitySection />
      <CallToAction
        onExploreProduct={handleDiscoverProduct}
        onLoginClick={isAuthenticated && onDashboardClick ? onDashboardClick : onLoginClick}
        isAuthenticated={isAuthenticated}
      />
      <ProprietorContact />
      <Footer
        onLoginClick={isAuthenticated && onDashboardClick ? onDashboardClick : onLoginClick}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default LandingPage;
