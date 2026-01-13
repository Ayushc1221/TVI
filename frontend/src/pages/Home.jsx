import React from 'react';

// Layout Components
import { Navbar, Footer } from '../components/layout';

// Section Components
import {
  HeroSection,
  USPsSection,
  AboutSection,
  ServicesSection,
  IndustriesSection,
  VerificationSection,
  FAQSection,
  ContactSection,
} from '../components/sections';


const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <HeroSection />
        <USPsSection />
        <AboutSection />
        <ServicesSection />
        <IndustriesSection />
        <VerificationSection />
        <FAQSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
