import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { AnimatePresence, motion } from "motion/react"

import { FaArrowLeft, FaCar, FaClockRotateLeft, FaFileCircleCheck, FaLandmark } from 'react-icons/fa6'
import { FiCheckCircle, FiShield, FiXCircle } from 'react-icons/fi'

import Card from '../components/Card'
import Button from '../components/Button'
import DocsPreview from '../components/DocsPreview'

import { adminService } from '../services/admin.service'

const AdminReviewPartner = () => {

    const [data, setData] = useState([])
    const [vehicleDetails, setVehicleDetails] = useState([])
    const [docs, setDocs] = useState([])
    const [bank, setBank] = useState([])

    const [showApproved, setShowApproved] = useState(false)
    const [showRejected, setShowRejected] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")

    const [isLoading, setIsLoading] = useState(true)
    const [approveLoading, setApproveLoading] = useState(false)
    const [rejectLoading, setRejectLoading] = useState(false)

    const navigate = useNavigate()

    const { id } = useParams()

    useEffect(() => {
        const fetchPartner = async () => {
            const response = await adminService.fetchPartnerData({ id })
            setIsLoading(false)
            setData(response.partner)
            setDocs(response.docs)
            setBank(response.bank)
            setVehicleDetails(response.vehicle)
        }
        fetchPartner()
    }, [])

    const handleApprovePartner = async (id) => {
        try {
            setApproveLoading(true)
            const response = await adminService.approvePartner({ id })
            if (response.success) {
                setShowApproved(false)
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setApproveLoading(false)
        }
    }
    const handleRejectPartner = async (id) => {
        try {
            setRejectLoading(true)
            const response = await adminService.rejectPartner({ id, rejectionReason })
            setShowRejected(false)
            navigate("/")
        } catch (error) {
            console.log(error)
        } finally {
            setRejectLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center text-xl bg-linear-to-br from-zinc-900 to-zinc-950 text-white'>
                Loading partner....
            </div>
        )
    }

    return (
        <div className='min-h-screen'>
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-zinc-700'>
                <div className='max-w-7xl mx-auto px-4 h-16  flex items-center gap-4'>
                    <button onClick={() => window.history.back()} className='w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-zinc-900 transition cursor-pointer'>
                        <FaArrowLeft />
                    </button>
                    <div className='flex-1'>
                        <div className='font-semibold text-lg'>{data.name}</div>
                        <div className='text-xs text-zinc-400'>{data.email}</div>
                    </div>
                    {
                        data.partnerStatus === "approved" ?
                            <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-green-100 text-green-700'>
                                <FiCheckCircle /> Approved
                            </div>
                            : data.partnerStatus === "rejected" ?
                                <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-red-100 text-red-700'>
                                    <FiXCircle /> Rejected
                                </div>
                                :
                                <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-yellow-100 text-yellow-700'>
                                    <FaClockRotateLeft /> Pending
                                </div>
                    }
                </div>
            </div>
            <main className='max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-10'>
                <div className='lg:col-span-2 space-y-8'>
                    <Card title="Vehicle Details" icon={FaCar}>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-400'>Vehicle Type </span>
                            <span className='font-semibold'>{vehicleDetails.type}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-400'>Vehicle Number</span>
                            <span className='font-semibold'>{vehicleDetails.number}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-400'>Vehicle Model</span>
                            <span className='font-semibold'>{vehicleDetails.model}</span>
                        </div>
                    </Card>
                    <Card title="Documents" icon={FaFileCircleCheck}>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                            <DocsPreview label="Aadhar" url={docs.aadharUrl} />
                            <DocsPreview label="Registration Certificate" url={docs.rcUrl} />
                            <DocsPreview label="Driving License" url={docs.licenseUrl} />
                        </div>
                    </Card>
                </div>
                <div className='space-y-8'>
                    <Card title="Bank Details" icon={FaLandmark}>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-400'>Account Holder Name </span>
                            <span className='font-semibold'>{bank.accountHolder}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-400'>Account Number </span>
                            <span className='font-semibold'>{bank.accountNumber}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-400'>Account Holder Name </span>
                            <span className='font-semibold'>{bank.ifscCode}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-400'>UPI ID</span>
                            <span className='font-semibold'>{bank.upiId || "N/A"}</span>
                        </div>
                    </Card>
                    {
                        data?.partnerStatus === "pending" && <Card title="Admin Check" icon={FiShield}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='bg-background rounded-2xl shadow-xl space-y-4 '
                            >
                                <p className='text-sm text-zinc-500'>
                                    Verify Documents carefully before approving
                                </p>
                                <div className='flex flex-col  gap-4'>
                                    <Button text="Approve" onClick={() => setShowApproved(true)} fill={true} className="border border-zinc-600" />
                                    <Button text="Reject" onClick={() => setShowRejected(true)} fill={false} className="border border-zinc-600" />
                                </div>
                            </motion.div>
                        </Card>
                    }
                </div>
            </main>


            <AnimatePresence>
                {
                    showApproved && <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 bg-background/50 backdrop-blur-sm flex items-center justify-center px-4'
                    >

                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className='bg-white rounded-3xl text-background p-6 w-full max-w-sm '
                        >
                            <h2 className='text-lg font-bold'>Approve Partner ?</h2>
                            <p className='text-sm text-gray-500 mt-2'>Confirm all informations has been verified.</p>
                            <div className='flex gap-3 mt-4'>
                                <Button text="Cancel" onClick={() => setShowApproved(false)} fill={false} className="border border-zinc-600" />
                                <Button text="Approve" onClick={() => handleApprovePartner(data._id)} fill={true} isLoading={approveLoading} className="border border-zinc-600" />
                            </div>
                        </motion.div>

                    </motion.div>
                }
            </AnimatePresence>

            <AnimatePresence>
                {
                    showRejected && <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 bg-background/50 backdrop-blur-sm flex items-center justify-center px-4'
                    >

                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className='bg-white rounded-3xl text-background p-6 w-full max-w-sm '
                        >
                            <h2 className='text-lg font-bold'>Reject Partner ?</h2>
                            <p className='text-sm text-gray-500 mt-2'>
                                <textarea
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    value={rejectionReason}
                                    placeholder='Enter rejection reason (required)'
                                    className='w-full mt-3 border rounded-xl p-3 text-sm'
                                ></textarea>
                            </p>
                            <div className='flex gap-3 mt-4'>
                                <Button text="Cancel" onClick={() => setShowRejected(false)} fill={false} className="border border-zinc-600" />
                                <Button text="Confirm" onClick={() => handleRejectPartner(data._id)} fill={true} isLoading={rejectLoading} className="border border-zinc-600" />
                            </div>
                        </motion.div>

                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}

export default AdminReviewPartner