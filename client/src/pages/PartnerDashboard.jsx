import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { motion } from "motion/react"
import { FaCheck, FaClockRotateLeft } from 'react-icons/fa6';
import { PiLockersBold } from 'react-icons/pi';
import { GiLockedBox } from 'react-icons/gi';
import { CiLock } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import RejectionCard from '../components/RejectionCard';
import Button from '../components/Button';
import StatusCard from '../components/StatusCard';

const STEPS = [
    { id: 1, title: "Vehicle", route: "/partner/become-partner" },
    { id: 2, title: "Document", route: "/partner/become-partner/upload-documents" },
    { id: 3, title: "Bank", route: "/partner/become-partner/bank-details" },
    { id: 4, title: "Review" },
    { id: 5, title: "Video KYC" },
    { id: 6, title: "Pricing" },
    { id: 7, title: "Final Review" },
    { id: 8, title: "Live" },
]

const TOTAL_STEPS = STEPS.length;

const PartnerDashboard = () => {
    const navigate = useNavigate()

    const step = useSelector(state => state.user?.data?.onboardingStep)
    const [activeStep, setActiveStep] = useState(step)
    const userData = useSelector(state => state.user?.data)

    console.log(userData)

    useEffect(() => {
        if (userData)
            setActiveStep(userData.onboardingStep + 1);
    }, [])


    const goToStep = (id, route) => {
        if (id <= activeStep && route) {
            navigate(route)
        }
    }

    const progreshPercentage = ((activeStep - 1) / (TOTAL_STEPS - 1)) * 100

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200 text-background px-4 py-28'>
            <div className='max-w-7xl mx-auto space-y-16'>
                <div>
                    <h1 className='text-4xl font-bold'> Partner Onboarding</h1>
                    <p className='text-gray-600 mt-3'>Complete all steps to activate your account</p>
                </div>
                <div className='bg-white rounded-3xl p-10  shadow-xl border overflow-x-auto'>
                    <div className='relative min-w-200 '>
                        <div className='absolute top-7 left-0 w-full h-0.75 bg-gray-200 rounded-full' />

                        <motion.div
                            animate={{ width: `${progreshPercentage}%` }}
                            transition={{ duration: 0.6 }}
                            className='absolute top-7 left-0 h-0.75 bg-background rounded-full'
                        />
                        <div className='relative flex justify-between'>
                            {
                                STEPS.map(({ id, title, route }) => {
                                    const complete = id < activeStep
                                    const active = id === activeStep
                                    const locked = id > activeStep

                                    return <motion.div
                                        key={id}
                                        whileHover={!locked ? { scale: 1.1 } : {}}
                                        className='flex flex-col items-center z-10 cursor-pointer '
                                    >
                                        <div
                                            onClick={() => goToStep(id, route)}
                                            className={` w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${complete ? "bg-background text-white border-background" : active ? "border-background bg-white" : "border-gray-300 text-gray-400 bg-white"}`}>
                                            {
                                                complete ?
                                                    <FaCheck />
                                                    :
                                                    locked ?
                                                        <CiLock />
                                                        :
                                                        id
                                            }
                                        </div>
                                        <p className='mt-3 text-sm font-semibold text-center '>{title}</p>
                                    </motion.div>
                                })
                            }
                        </div>
                    </div>

                </div>
                {
                    step == 3 && userData.partnerStatus === "rejected" && (
                        <RejectionCard
                            title="Partner rejected"
                            reason={userData.rejectionReason}
                            actionLabel="Review and update"
                            onAction={() => {
                                navigate("/partner/become-partner")
                            }}
                        />
                    )
                }
                {
                    step == 3 && userData.partnerStatus === "pending" && (
                        <StatusCard
                            title="Documents under review"
                            icon={FaClockRotateLeft}
                            desc="Admin is verifying your documents"
                        />
                    )
                }
            </div>
        </div>
    )
}

export default PartnerDashboard