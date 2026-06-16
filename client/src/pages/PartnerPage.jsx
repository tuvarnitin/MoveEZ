import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PartnerPage = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default PartnerPage