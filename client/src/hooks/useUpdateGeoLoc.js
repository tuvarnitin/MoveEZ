import React from 'react'
import { useEffect } from 'react'
import { getSocket } from '../socket.io/socketIo'
import { useSelector } from 'react-redux'
import { useRef } from 'react'

const useUpdateGeoLoc = (userId) => {

    const socketRef = useRef()

    useEffect(() => {
        if (!userId || !navigator.geolocation) return
        socketRef.current = getSocket()
        socketRef.current.emit("init", { userId })

        const watch = navigator.geolocation.watchPosition(({coords})=>{
            socketRef.current.emit("update-location",{
                userId,
                lat:coords.latitude,
                lon:coords.longitude,
            },(err)=>{
                console.log(err)
            },{
                enableHighAccuracy:true,
                maximumAge:3000
            })
        })
        return ()=>{
            navigator.geolocation.clearWatch(watch)
        }
    }, [userId])
    return null
}

export default useUpdateGeoLoc