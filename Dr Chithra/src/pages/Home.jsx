import React from 'react'
import HeroSection from '../components/Home/Hero'
import About from '../components/Home/About'
import Education from '../components/Home/Education'
import Awards from '../components/Home/Awards'
import ResearchInterests from '../components/Home/Research'
import Contact from '../components/Home/Contact'

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <About/>
      <ResearchInterests/>
      <Education/>
      <Awards/>
      <Contact/>
    </div>
  )
}

export default Home
