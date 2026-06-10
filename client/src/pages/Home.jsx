import React from 'react'
import Hero from '../components/Hero'
import VehicleCategories from '../components/VehicleCategories'
import Footer from '../components/Footer'

const Home = ({ setIsAuthModalOpen ,isLogin}) => {
  return (
    <>
    <Hero />
    <VehicleCategories />
    <Footer />
    </>
  )
}

export default Home