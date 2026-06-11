import React, { useEffect, useRef, useState } from 'react'

import { motion } from "motion/react"

import Button from './Button'

import { FaBus, FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa6'
import { MdBikeScooter } from 'react-icons/md'

const VehicleDetails = ({ nextStep, step, prevStep }) => {

    const [vehicleType, setVehicleType] = useState(null)
    const vehicleNumberRef = useRef(null)
    const vehicleModelRef = useRef(null)
    const maxPassengersRef = useRef(null)

    const [errors, setErrors] = useState({
        type: "",
        number: "",
        model: "",
        maxPassengers:""
    })

    const VEHICLE_CATEGORIES = [
        {
            id: "bike",
            name: "Bike",
            description: "2 Wheeler",
            Icon: FaMotorcycle,
            badge: "Quick",
            maxPassengers: 1,
            luggageCapacity: 0
        },
        {
            id: "auto",
            name: "Auto",
            description: "3 Wheeler",
            Icon: MdBikeScooter,
            badge: "Local",
            maxPassengers: 3,
            luggageCapacity: 4
        },
        {
            id: "car",
            name: "Car",
            description: "4 Wheeler",
            Icon: FaCar,
            badge: "Comfort",
            maxPassengers: 4,
            luggageCapacity: 4
        },
        {
            id: "bus",
            name: "Bus",
            description: "Group travel",
            Icon: FaBus,
            badge: "Spacious",
            maxPassengers: 20,
            luggageCapacity: 100
        }
    ];

    const handleNextStep = async () => {
        setErrors({
            type: "",
            number: "",
            model: "",
            maxPassengers: ""
        })
        if (!vehicleType) {
            setErrors(prev => ({
                ...prev,
                type: "Vehicle type required"
            }))
            return
        }

        if (!vehicleNumberRef.current.value) {
            setErrors(prev => ({
                ...prev,
                number: "Model number required"
            }))
            console.log(errors)
            return
        }
        if (!vehicleModelRef.current.value) {
            setErrors(prev => ({
                ...prev,
                model: "Model number required"
            }))
            console.log(errors)
            return
        }
        if (!maxPassengersRef.current.value) {
            setErrors(prev => ({
                ...prev,
                maxPassengers: "Passenger capacity required"
            }))
            console.log(errors)
            return
        }
        console.log(
            vehicleModelRef.current.value,
            vehicleNumberRef.current.value,
            vehicleType
        )
        nextStep()
    }

    useEffect(() => {
        setErrors({
            type: "",
            number: "",
            model: "",
            maxPassengers:""
        })
    }, [vehicleType, vehicleModelRef?.current?.value, vehicleNumberRef?.current?.value, maxPassengersRef?.current?.value])

    return (
        <div>
            <div className=' text-center'>
                <p className='text-[max(14px,1vw)] text-gray-500 font-medium'>Step {step} of 3</p>
                <div className='-space-y-0.5 sm:-space-y-1 border-b border-gray-300 sm:border-0 pb-2 sm:pb-0'>
                    <h1 className='text-[max(22px,1.5vw)] font-bold'>Vehicle Details</h1>
                    <p className='text-[12px] text-gray-500'>Fill you Vehicle details</p>
                </div>
            </div>
            <p className='text-[max(14px)] font-extrabold sm:font-medium text-gray-500 mt-4'>Select Vehicle Type</p>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 p-2'>
                {
                    VEHICLE_CATEGORIES.map(({ id, name, Icon, description, badge, maxPassengers }, index) => {
                        const isActive = vehicleType === id
                        return (
                            <motion.div
                                key={id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setVehicleType(id)}
                                className={`rounded-2xl border p-2 pt-4 flex flex-col items-center gap-2 transition cursor-pointer ${isActive ?
                                    "bg-background text-white border-background"
                                    :
                                    "border-gray-200 hover:border-background"
                                    } ${errors["type"] && "border-red-400"}`}
                            >
                                <div className={`w-11 h-11  rounded-full flex items-center justify-center ${isActive ?
                                    "bg-white text-background"
                                    :
                                    "bg-background text-white"
                                    }`}>
                                    <Icon />
                                </div>
                                <div className='text-md font-extrabold sm:font-semibold'>
                                    {name}
                                </div>
                                <p className={`text-[max(12px)] font-black sm:font-semibold text-center ${isActive ? "text-gray-300" : "text-gray-400"}`}>{description}</p>
                            </motion.div>
                        )
                    })
                }
            </div>
            {
                errors["type"]
                &&
                <p className='text-xs text-red-500 mt-2 ml-4 mb-4'>{errors.type}</p>
            }
            <div>
                <label htmlFor="vehicleNumber" className='font-extrabold sm:font-medium text-gray-500 text-[14px]'>Vehicle Number </label>
                <input
                    ref={vehicleNumberRef}
                    onChange={() => setErrors({
                        type: "",
                        number: "",
                        model: "",
                        maxPassengers:""
                    })}
                    type="text"
                    id='vehicleNumber'
                    placeholder='HR06AB1234'
                    className={`w-full mt-2 border-b pb-2 text-[max(16px)] focus:outline-none focus:border-background transition ${errors["number"] ? "border-red-500 text-red-700" : "text-background border-gray-300"
                        }`} />
                {
                    errors["number"]
                    &&
                    <p className='text-xs text-red-500 mt-2'>{errors.number}</p>
                }
            </div>
            <div className='mt-4'>
                <label htmlFor="vehicleModel" className='font-extrabold sm:font-medium text-gray-500 text-[14px]'>Vehicle Model</label>
                <input
                    ref={vehicleModelRef}
                    onChange={() => setErrors({
                        type: "",
                        number: "",
                        model: "",
                        maxPassengers:""
                    })}
                    type="text"
                    id='vehicleModel'
                    placeholder='Alto 800'
                    className={`w-full mt-2 border-b pb-2 text-[max(16px)] focus:outline-none focus:border-background transition ${errors["model"] ? "border-red-500 text-red-700" : "text-background border-gray-300"
                        }`} />
                {
                    errors["model"]
                    &&
                    <p className='text-xs text-red-500 mt-2'>{errors.model}</p>
                }
            </div>
            <div className='mt-4'>
                <label htmlFor="maxPassengers" className='font-extrabold sm:font-medium text-gray-500 text-[14px]'>Passenger capacity</label>
                <input
                    ref={maxPassengersRef}
                    onChange={() => setErrors({
                        type: "",
                        number: "",
                        model: "",
                        maxPassengers:""
                    })}
                    type="text"
                    id='maxPassengers'
                    placeholder='2'
                    className={`w-full mt-2 border-b pb-2 text-[max(16px)] focus:outline-none focus:border-background transition ${errors["model"] ? "border-red-500 text-red-700" : "text-background border-gray-300"
                        }`} />
                {
                    errors["maxPassengers"]
                    &&
                    <p className='text-xs text-red-500 mt-2'>{errors.maxPassengers}</p>
                }
            </div>
            <Button className="mt-4 text-xl" text={"Continue"} onClick={handleNextStep} fill={true} />
        </div>
    )
}

export default VehicleDetails