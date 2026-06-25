import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

import { AnimatePresence, motion } from "motion/react"

import { useSelector } from "react-redux"

import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

import { CiVideoOff } from 'react-icons/ci';
import { FaVideo, FaX } from 'react-icons/fa6';
import { MdMic, MdMicOff } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import { FiPhoneOff, FiXCircle } from 'react-icons/fi';

import Button from '../components/Button';

import { adminService } from "../services/admin.service"

const Zego = () => {

    const navigate = useNavigate()

    const { roomId } = useParams()

    const userData = useSelector(state => state.user.data)

    const [reason, setReason] = useState("")
    const [stream, setStream] = useState(null)
    const [joined, setJoined] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [isApproveLoading, setApproveIsLoading] = useState(false)
    const [isRejcetLoading, setRejcetIsLoading] = useState(false)

    const [isCameraOn, setIsCameraOn] = useState(true)
    const [isMicOn, setIsMicOn] = useState(true)

    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)

    const previewRef = useRef(null)
    const containerRef = useRef(null)

    const startCall = async () => {
        setIsLoading(true)
        try {

            if (!containerRef) return
            const appId = Number(import.meta.env.VITE_API_ZEGO_APP_ID)
            const serverSecret = import.meta.env.VITE_API_ZEGO_SERVER_SECRET

            const displayName = userData.role === "admin" ? "Admin" : `${userData.name} (${userData.email})`

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serverSecret, roomId.toString(), userData._id.toString(), displayName);

            const zp = ZegoUIKitPrebuilt.create(kitToken)

            zp.joinRoom({
                container: containerRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall,
                },
                showPreJoinView: false,
                onJoinRoom: () => {
                    setJoined(true);
                },
            });

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleCameraOn = () => {
        if (!stream) return
        stream.getVideoTracks().forEach(track => track.enabled = !isCameraOn);
        setIsCameraOn(prev => !prev)
    }
    const toggleMicOn = () => {
        if (!stream) return
        stream.getAudioTracks().forEach(track => track.enabled = !isMicOn);
        setIsMicOn(prev => !prev)
    }

    const handleApprove = async () => {
        setApproveIsLoading(true)
        try {
            const response = await adminService.videoKycComplete({
                roomId, action: "approved"
            })
            if (response.success) {
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setApproveIsLoading(false)
            setShowApproveModal(false)
        }
    }
    const handleReject = async () => {
        try {
            setRejcetIsLoading(true)
            const response = await adminService.videoKycComplete({
                roomId, action: "rejected", reason
            })
            if (response.success) {
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setRejcetIsLoading(false)
            setShowRejectModal(false)
        }
    }

    useEffect(() => {
        if (joined) return
        let localStream;
        const init = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                })
                setStream(localStream)
                if (previewRef.current) {
                    previewRef.current.srcObject = localStream
                }
            } catch (error) {
                console.log(error)
            }
        }
        init()
    }, [])

    return (
        <div className='min-h-screen bg-background text-white flex flex-col'>
            <div className='px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <Link to={"/"} className='ml-1'>
                    <img src="/logo.png" alt="MoveEZ Logo" width={80} />
                    <p className='text-xs text-gray-400'>{userData.role === "admin" ? "Admin Verification" : "Partner Video KYC"}</p>
                </Link>
                {
                    joined && (
                        <div className='flex flex-wrap gap-3 items-center'>
                            {
                                userData.role === "admin" && (
                                    <>
                                        <button
                                            onClick={() => setShowApproveModal(true)}
                                            className='bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer'>
                                            <FaCheckCircle />Approve
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer'>
                                            <FiXCircle /> Reject
                                        </button>
                                    </>
                                )
                            }
                            <button
                                onClick={() => navigate("/")}
                                className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer'>
                                <FiPhoneOff /> End Call
                            </button>
                        </div>
                    )
                }
            </div>

            <div className='flex-1 relative'>
                <div ref={containerRef} className={`absolute inset-0 ${joined ? "block" : "hidden"}`} />
                {
                    !joined && (
                        <div className='w-full flex items-center justify-center px-4 py-10'>
                            <div className='w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12  items-center'>
                                <div className='relative rounded-2xl overflow-hidden border border-white/10 bg-white/5'>
                                    <video ref={previewRef} autoPlay muted playsInline className='w-full h-72 sm:h-100 object-cover' />
                                    {
                                        !isCameraOn && (
                                            <div className='absolute inset-0 bg-background text-white flex items-center justify-center'>
                                                <CiVideoOff />
                                            </div>
                                        )
                                    }
                                </div>
                                <div className='space-y-8 text-center sm:text-left'>
                                    <h1 className='text-3xl sm:text-4xl font-bold'>
                                        Secure Video KYC
                                    </h1>
                                    <div className='flex justify-center lg:justify-start gap-6'>
                                        <button
                                            onClick={toggleCameraOn}
                                            className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isCameraOn ? "bg-white text-background" : "bg-white/10 border border-white/20"
                                                }`}
                                        >{isCameraOn ? <FaVideo /> : <CiVideoOff />}</button>

                                        <button
                                            onClick={toggleMicOn}
                                            className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isMicOn ? "bg-white text-background" : "bg-white/10 border border-white/20"
                                                }`}
                                        >{isMicOn ? <MdMic /> : <MdMicOff />}</button>
                                    </div>
                                    <Button
                                        text="Join Secure Call"
                                        onClick={startCall}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>

            <AnimatePresence>
                {
                    showApproveModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className='relative bg-white text-background w-full max-w-md rounded-2xl p-6 shadow-2xl'
                            >
                                <button className='absolute top-4 right-4 text-gray-400' onClick={() => setShowApproveModal(false)}><FaX /></button>
                                <h2 className='text-lg font-semibold mb-4'>Confirm Approval</h2>
                                <div className='flex items-center gap-4'>
                                    <Button
                                        onClick={() => setShowApproveModal(false)}
                                        text="Cancle"
                                    />
                                    <Button
                                        onClick={handleApprove}
                                        isLoading={isApproveLoading}
                                        text="Approve"
                                        fill={true}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
            <AnimatePresence>
                {
                    showRejectModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className='relative bg-white text-background w-full max-w-md rounded-2xl p-6 shadow-2xl'
                            >
                                <button className='absolute top-4 right-4 text-gray-400' onClick={() => setShowRejectModal(false)}><FaX /></button>
                                <h2 className='text-lg font-semibold mb-4' >Reject Partner</h2>
                                <textarea
                                    placeholder='Give rejection reason'
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className='w-full bg-white/10 border-white/20 rounded-xl p-3 mb-4 text-sm'
                                ></textarea>
                                <div className='flex items-center gap-4'>
                                    <Button
                                        onClick={() => setShowRejectModal(false)}
                                        text="Cancle"
                                    />
                                    <Button
                                        onClick={handleReject}
                                        isLoading={isApproveLoading}
                                        text="Reject"
                                        fill={true}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}

export default Zego