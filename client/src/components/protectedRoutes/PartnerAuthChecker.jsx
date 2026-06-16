import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PartnerAuthChecker = () => {
    const role = useSelector(state => state.user?.data?.role)
    return role === "partner" ? <Outlet /> : <Navigate to="/" />
}

export default PartnerAuthChecker