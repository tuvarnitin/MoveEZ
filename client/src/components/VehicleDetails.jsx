import React, { useEffect, useRef, useState } from 'react'

import { motion } from "motion/react"

import Button from './Button'

import { FaBus, FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa6'
import { MdBikeScooter } from 'react-icons/md'

const VehicleDetails = ({ nextStep, step, prevStep }) => {

    const [vehicleType, setVehicleType] = useState(null)
    const vehicleNumberRef = useRef(null)
    const vehicleModelRef = useRef(null)

    const [errors, setErrors] = useState({
        type: "",
        number: "",
        model: ""
    })

    const VEHICLE_CATEGORIES = [
        {
            id: "bike",
            name: "Bike",
            description: "2 Wheeler",
            Icon: FaMotorcycle,
            badge: "Quick",
        },
        {
            id: "auto",
            name: "Auto",
            description: "3 Wheeler",
            Icon: MdBikeScooter,
            badge: "Local",
        },
        {
            id: "car",
            name: "Car",
            description: "4 Wheeler",
            Icon: FaCar,
            badge: "Comfort",
        },
        {
            id: "bus",
            name: "Bus",
            description: "Group & long-distance travel",
            Icon: FaBus,
            badge: "Spacious",
        }
    ];

    const handleNextStep = async () => {
        setErrors({
            type: "",
            number: "",
            model: ""
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
            model: ""
        })
    }, [vehicleType, vehicleModelRef?.current?.value, vehicleNumberRef?.current?.value])

    return (
        <div>
            <div className='-space-y-0.5 text-center'>
                <p className='text-xs text-gray-500 font-medium'>Step {step} of 3</p>
                <h1 className='text-xl font-bold'>Vehicle Details</h1>
                <p className='text-xs text-gray-500 '>Fill you Vehicle details</p>
            </div>
            <p className='text-xs font-semibold text-gray-500'>Vehicle Type</p>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 pb-0'>
                {
                    VEHICLE_CATEGORIES.map(({ id, name, Icon, description, badge }, index) => {
                        const isActive = vehicleType === id
                        return (
                            <motion.div
                                key={id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setVehicleType(id)}
                                className={`rounded-2xl border p-2 flex flex-col items-center gap-2 transition cursor-pointer ${isActive ?
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
                                <div className='text-sm font-semibold'>
                                    {name}
                                </div>
                                <p className={`text-xs text-center ${isActive ? "text-gray-300" : "text-gray-500"}`}>{description}</p>
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
                <label htmlFor="vehicleNumber" className='font-semibold text-gray-500 text-xs'>Vehicle Number </label>
                <input
                    ref={vehicleNumberRef}
                    onChange={() => setErrors({
                        type: "",
                        number: "",
                        model: ""
                    })}
                    type="text"
                    id='vehicleNumber'
                    placeholder='HR06AB1234'
                    className={`w-full mt-2 border-b pb-2 text-sm focus:outline-none focus:border-background transition ${errors["number"] ? "border-red-500 text-red-700" : "text-background border-gray-300"
                        }`} />
                {
                    errors["number"]
                    &&
                    <p className='text-xs text-red-500 mt-2'>{errors.number}</p>
                }
            </div>
            <div className='mt-4'>
                <label htmlFor="vehicleModel" className='font-semibold text-gray-500 text-xs'>Vehicle Model </label>
                <input
                    ref={vehicleModelRef}
                    onChange={() => setErrors({
                        type: "",
                        number: "",
                        model: ""
                    })}
                    type="text"
                    id='vehicleModel'
                    placeholder='Alto 800'
                    className={`w-full mt-2 border-b pb-2 text-sm focus:outline-none focus:border-background transition ${errors["model"] ? "border-red-500 text-red-700" : "text-background border-gray-300"
                        }`} />
                {
                    errors["model"]
                    &&
                    <p className='text-xs text-red-500 mt-2'>{errors.model}</p>
                }
            </div>
            <Button className="mt-4" text={"Continue"} onClick={handleNextStep} fill={true} />
        </div>
    )
}

export default VehicleDetails