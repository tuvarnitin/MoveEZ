import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminAuthChecker = () => {
    const role = useSelector(state => state.user?.data?.role)
    return role === "admin" ? <Outlet /> : <Navigate to="/" />
}

export default AdminAuthChecker