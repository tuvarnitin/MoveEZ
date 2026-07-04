import React from 'react'
import { useEffect } from 'react'
import { getSocket } from '../socket.io/socketIo'
import { useSelector } from 'react-redux'

const useUpdateGeoLoc = (userId) => {
    useEffect(() => {
        if (!userId || !navigator.geolocation) return
        const socket = getSocket()
        socket.emit("init", { userId })
    }, [userId])
    return null
}

export default useUpdateGeoLoc