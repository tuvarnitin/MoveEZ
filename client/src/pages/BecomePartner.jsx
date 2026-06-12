import React, { Activity, useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AnimatePresence, motion, press } from "motion/react"

import { MdBikeScooter } from 'react-icons/md'
import { FaArrowLeft, FaBus, FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa6'

import Button from '../components/Button'
import VehicleDetails from '../components/VehicleDetails'
import UploadDocuments from '../components/UploadDocuments'
import BankingInfo from '../components/BankingInfo'

import { useSelector } from "react-redux"

const BecomePartner = () => {

    const [step, setStep] = useState(3)
    const [direction, setDirection] = useState(3);

    const navigate = useNavigate()

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 20 : -20,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction > 0 ? -20 : 20,
            opacity: 0,
        }),
    };

    const nextStep = useCallback(() => {
        setDirection(1);
        setStep(prev => prev + 1);
    })

    const prevStep = useCallback(() => {
        setDirection(-1);
        setStep(prev => prev - 1);
    })


    return (
        <div className='w-full h-dvh sm:h-full bg-background flex justify-center sm:p-2'>
            <AnimatePresence mode='wait' custom={direction}>
                <motion.div
                    key={step}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        duration: 0.1,
                        ease: "linear",
                    }}
                    className='w-full max-w-xl sm:mt-20 h-full bg-white sm:rounded-2xl border border-gray-200 shadow-[0_20px_70px_rgba(255,255,255,0.15)] text-background'>
                    <div className='relative p-6 pt-2 sm:p-8 my-auto'>
                        <button
                            onClick={prevStep}
                            className='absolute left-4 top-4 w-9 h-9  rounded-full border border-gray-300 flex items-center justify-center text-background hover:bg-gray-100 cursor-pointer hover:scale-90 transition'>
                            <FaArrowLeft />
                        </button>
                        {
                            step === 1 ?
                                <VehicleDetails
                                    nextStep={nextStep}
                                    step={step}
                                    prevStep={prevStep}
                                />
                                : (step === 2 ?
                                    <UploadDocuments
                                        step={step}
                                        nextStep={nextStep}
                                        prevStep={prevStep}
                                    />
                                    : (
                                        step === 3 ?

                                            <BankingInfo
                                                step={step}
                                                nextStep={nextStep}
                                                prevStep={prevStep}
                                            />
                                            :
                                            navigate("/")
                                    )

                                )
                        }
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default BecomePartner