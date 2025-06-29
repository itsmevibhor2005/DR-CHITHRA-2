import React, { useEffect } from 'react'
import HeroSection from '../components/Home/Hero'
import About from '../components/Home/About'
import Education from '../components/Home/Education'
import Awards from '../components/Home/Awards'
import ResearchInterests from '../components/Home/Research'
import Contact from '../components/Home/Contact'
import { useLocation } from 'react-router-dom'
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

const Home = () => {
  return (
    <div>
      <ScrollToTop />
      <HeroSection />
      <About />
      <ResearchInterests />
      <Education />
      <Awards />
      <Contact />
    </div>
  );
}

export default Home
