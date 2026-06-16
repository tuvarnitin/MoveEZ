import React, { useCallback, useEffect, useRef, useState } from 'react'

import { motion } from "motion/react"

import Button from './Button'

import { FaBus, FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa6'
import { MdBikeScooter } from 'react-icons/md'
import { vehicleService } from '../services/vehicle.service'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { setUserData } from '../redux/features/userSlice'

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

const vehicleRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;

const VehicleDetails = () => {

    const [vehicleType, setVehicleType] = useState("")
    const [vehicleNumber, setVehicleNumber] = useState("")
    const [vehicleModel, setVehicleModel] = useState("")
    const [maxPassengers, setMaxPassengers] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const userData = useSelector(state => state.user?.data)

    const [errors, setErrors] = useState({
        type: "",
        number: "",
        model: "",
        maxPassengers: ""
    })

    const [responseError, setResponseError] = useState("")

    const handleNextStep = async () => {
        setIsLoading(true)
        const newErrors = {};

        if (!vehicleType) {
            newErrors.type = "Vehicle type required";
        }
        if (!vehicleNumber) {
            newErrors.number = "Vehicle number required";
        }
        if (!vehicleRegex.test(vehicleNumber?.toUpperCase())) {
            newErrors.number = "Invalid vehicle number"
        }
        if (!vehicleModel) {
            newErrors.model = "Model required";
        }
        if (!maxPassengers) {
            newErrors.maxPassengers = "Passenger capacity required";
        }
        setErrors(newErrors);

        try {
            const hasErrors = Object.values(newErrors).some(Boolean);

            if (hasErrors) return;

            const response = await vehicleService.register({
                vehicleType,
                vehicleModel,
                vehicleNumber,
                maxPassengers
            })

            if (response.success) {
                dispatch(setUserData({
                    user: response.user
                }))
                navigate("/partner/become-partner/upload-documents")
            }
        } catch (error) {
            setResponseError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setIsLoading(true)

        const fetchVehicleDetails = async () => {
            const { vehicle: { number, type, model, maxPassengers } } = await vehicleService.fetchVehicle();
            setVehicleType(type)
            setVehicleNumber(number)
            setVehicleModel(model)
            setMaxPassengers(maxPassengers)
        }
        fetchVehicleDetails()
        setIsLoading(false)
    }, [])

    return (
        <div className='relative'>
            <div className='text-center'>
                <p className='text-[max(14px,1vw)] text-gray-500 font-medium'>Step 1 of 3</p>
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
                    value={vehicleNumber}
                    onChange={(e) => {
                        if (errors.number) {
                            setErrors(prev => ({
                                ...prev,
                                number: ""
                            }));
                        }
                        setVehicleNumber(e.target.value)
                    }}
                    disabled={isLoading}
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
                    value={vehicleModel}
                    onChange={(e) => {
                        if (errors.model) {
                            setErrors(prev => ({
                                ...prev,
                                model: ""
                            }));
                        }
                        setVehicleModel(e.target.value)
                    }}
                    disabled={isLoading}
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
                    value={maxPassengers}
                    onChange={(e) => {
                        if (errors.maxPassengers) {
                            setErrors(prev => ({
                                ...prev,
                                maxPassengers: ""
                            }));
                        }
                        setMaxPassengers(e.target.value)
                    }}
                    disabled={isLoading}
                    type="number"
                    id='maxPassengers'
                    placeholder='2'
                    min={1}
                    className={`w-full mt-2 border-b pb-2 text-[max(16px)] focus:outline-none focus:border-background transition ${errors["model"] ? "border-red-500 text-red-700" : "text-background border-gray-300"
                        }`} />
                {
                    errors["maxPassengers"]
                    &&
                    <p className='text-xs text-red-500 mt-2'>{errors.maxPassengers}</p>
                }
            </div>
            {
                responseError &&
                <p className='text-xs text-red-500 mt-2'>{responseError}</p>
            }
            <Button
                className="mt-4 text-xl" text={"Continue"}
                fill={true}
                isLoading={isLoading}
                onClick={handleNextStep}
            />
        </div>
    )
}

export default VehicleDetails