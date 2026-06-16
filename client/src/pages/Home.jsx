import React from 'react'
import Hero from '../components/Hero'
import VehicleCategories from '../components/VehicleCategories'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import AdminDashboard from './AdminDashboard'
import PartnerDashboard from './PartnerDashboard'

const Home = ({ setIsSidebarOpen }) => {

  const role = useSelector(state => state.user?.data?.role)

  return (
    <>
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />
      {
        role && role === "admin"
          ?
          <AdminDashboard />
          : (
            role === "partner"
              ?
              <PartnerDashboard />
              :
              <>
                <Hero />
                <VehicleCategories />
              </>
          )
      }
      <Footer />
    </>
  )
}

export default Home