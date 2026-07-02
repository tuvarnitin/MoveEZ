import React from 'react'

import { motion } from "motion/react"

import { FiCheckCircle,CiUser,FaArrowRight } from '../../assets/icons/index.js'

import { useNavigate } from 'react-router-dom'

import { adminService } from "../../services/admin.service.js"

const ContentList = ({ data, type }) => {
    const navigate = useNavigate()
    const startVideoKyc = async (id) => {
        try {
            const result = await adminService.startVideoKyc({id})
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    if (data.length == 0) {
        return <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-background rounded-2xl py-16 text-center border border-dashed border-gray-200 shadow-sm'
        >
            <div className='w-12 h-12 rounded-xl bg-green-100 opacity-80 flex items-center justify-center mx-auto mb-4'>
                <FiCheckCircle size={20} className='text-green-900' />
            </div>
            <p className='font-bold text-gray-400 text-base'>All Caught Up!</p>
            <p className='text-xs text-gray-400 mt-1'>No pending reviews right now</p>
        </motion.div>
    }

    return (
        <div className='space-y-3'>
            <div className='flex items-center justify-between px-3 mb-1'>
                <p className='text-xs font-semibold uppercase tracking-widest text-gray-400'>
                    {
                        type === "partner" ?
                            "Partner Reviews"
                            : type === "kyc" ?
                                "Pending Video KYC"
                                :
                                "Vehicle Reviews"
                    }
                </p>
                <p className='text-xs text-gray-400'>{data.length} Items</p>
            </div>
            {
                data.map((item, index) => {
                    const name = item.name || item.owner.name
                    const email = item.email || item.owner.email
                    return <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -3, boxShadow: "0 2px 20px rgba(255,255,255,0.05)" }}
                        style={{
                            boxShadow: "0 10px 50px rgba(255,255,255,0.03)"
                        }}

                        className='bg-background text-white shadow inset-shadow-2xs shadow-zinc-600 border-gray-900 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 transition-shadow'
                    >
                        <div className='flex itemce gap-3 min-w-0'>
                            <div className='w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-purple-100 text-purple-800'>{name.charAt(0) ?? <CiUser />}</div>
                            <div className='min-w-0'>
                                <p className='font-bold text-sm text-gray-200 truncate'>{name}</p>
                                <p className='text-xs text-gray-400 truncate'>{email}</p>
                            </div>
                        </div>
                        <div className='shrink-0'>
                            {
                                item.videoKycStatus === "pending"
                                    ?
                                    (
                                        <motion.button
                                            onClick={()=>startVideoKyc(item._id)}
                                            whileTap={{ scale: 0.96 }}
                                            className='flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-600 hover:text-white text-background  text-sm font-semibold transition-colors cursor-pointer'
                                        >
                                            Start Video Kyc <FaArrowRight />
                                        </motion.button>
                                    )
                                    : item.videoKycStatus === "in_progress" ?
                                        (
                                            <motion.button
                                                onClick={() => navigate(`/video-kyc/${item.videoKycRoomId.toString()}`) }
                                                whileTap={{ scale: 0.96 }}
                                                className='flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-600 hover:text-white text-background  text-sm font-semibold transition-colors cursor-pointer'
                                            >
                                                Join Call<FaArrowRight />
                                            </motion.button>
                                        )
                                        :
                                        (
                                            item.status === "pending" ? 
                                                <motion.button
                                                    onClick={() => navigate(`/admin/reviews/vehicle/${item._id}`)}
                                                    whileTap={{ scale: 0.96 }}
                                                    className='flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-600 hover:text-white text-background  text-sm font-semibold transition-colors cursor-pointer'
                                                >
                                                    Review <FaArrowRight />
                                                </motion.button>
                                                : <motion.button
                                                    onClick={() => navigate(`/admin/reviews/partner/${item.id}`)}
                                                    whileTap={{ scale: 0.96 }}
                                                    className='flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-600 hover:text-white text-background  text-sm font-semibold transition-colors cursor-pointer'
                                                >
                                                    Review <FaArrowRight />
                                                </motion.button>
                                        )
                            }

                        </div>
                    </motion.div>
                })
            }
        </div>
    )
}

export default ContentList