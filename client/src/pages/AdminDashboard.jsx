import React, { useEffect, useState } from 'react'
import { adminService } from '../services/admin.service'

import KeyPermormanceIndicator from "../components/KeyPermormanceIndicator"

import { GrUser, GrUserAdmin } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import { CiClock1 } from "react-icons/ci";
import { FiXCircle } from "react-icons/fi";

const AdminDashboard = () => {

  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchAdminData = async () => {
      const response = await adminService.fetchAdminData()
      setStats(response.stats)
    }
    fetchAdminData()
  }, [])
  return (
    <div className='min-h-screen bg-background'>
      <div className='sticky top-0 bg-background backdrop-blur-lg border-b z-40 border-zinc-700'>
        <div className='max-w-7xl mx-auto h-16 px-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <img src="logo.png" alt="Logo" className='w-30 bg-background' />
          </div>
          <div className='flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-white text-background'>
            <GrUserAdmin />
            <span className='font-semibold text-xs tracking-wide'>Admin</span>
          </div>
        </div>
      </div>
      <main className='max-w-7xl mx-auto px-6 py-12 space-y-16'>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
          <KeyPermormanceIndicator label="Total Partners" value={stats?.totalPartners} Icon={GrUser} variant="totalPartners"/>
          <KeyPermormanceIndicator label="Total Approved Partners" value={stats?.totalApprovedPartners} Icon={FaCheck} variant="approved" />
          <KeyPermormanceIndicator label="Total Pending Partners" value={stats?.totalPendingPartners} Icon={CiClock1} variant="pending"/>
          <KeyPermormanceIndicator label="Total Rejected Partners" value={stats?.totalRejectedPartners} Icon={FiXCircle} variant="rejected" />
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard