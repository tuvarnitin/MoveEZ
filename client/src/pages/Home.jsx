import React from 'react'
import Hero from '../components/Hero'
import VehicleCategories from '../components/VehicleCategories'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const Home = ({setIsSidebarOpen}) => {
  return (
    <>
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />
    <Hero />
    <VehicleCategories />
    <Footer />
    </>
  )
}

export default Home