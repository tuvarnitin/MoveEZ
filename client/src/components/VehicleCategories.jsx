import React, { useRef, useState } from 'react'
import { motion } from "motion/react"

import { FaAngleLeft, FaAngleRight, FaBus, FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa6'
import { IoSparklesOutline } from "react-icons/io5";
import { MdBikeScooter } from 'react-icons/md';
import VehicleCard from './VehicleCard';

const VehicleCategories = () => {

    const VEHICLE_CATEGORIES = [
        {
            id: "all",
            name: "All Vehicles",
            description: "Browse the full fleet",
            Icon: FaCar,
            badge: "Popular",
        },
        {
            id: "bike",
            name: "Bike",
            description: "Fast & affordable rides",
            Icon: FaMotorcycle,
            badge: "Quick",
            maxPassengers: 1,
            luggageCapacity: 0
        },
        {
            id: "car",
            name: "Car",
            description: "Comfortable city travel",
            Icon: FaCar,
            badge: "Comfort",
            maxPassengers: 4,
            luggageCapacity: 2
        },
        {
            id: "suv",
            name: "SUV",
            description: "Premium & spacious",
            Icon: FaCar,
            badge: "Premium",
            maxPassengers: 7,
            luggageCapacity: 4
        },
        {
            id: "van",
            name: "Van",
            description: "Family & group transport",
            Icon: FaBus,
            badge: "Family",
            maxPassengers: 6
        },
        {
            id: "truck",
            name: "Truck",
            description: "Heavy & commercial transport",
            Icon: FaTruck,
            badge: "Cargo",
            maxPassengers: 2,
            luggageCapacity: 1000
        },
    ];
    const STATS = [
        { value: "10K+", title: "Successful Moves" },
        { value: "500+", title: "Verified Partners" },
        { value: "50+", title: "Cities Served" },
        { value: "24/7", title: "Support Available" },
    ]

    const [hoveredCard, setHoveredCard] = useState(null)
    const sliderRef = useRef(null)

    const scroll = (dir) => {
        if (!sliderRef.current) return
        sliderRef.current.scrollBy({ left: dir == "left" ? -300 : 300, behavior: "smooth" })

    }

    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.14,
            },
        },
    };

    return (
        <div className='w-full bg-white text-background py-20 px-4'>
            <div className='w-full max-w-7xl mx-auto bg-white  flex flex-col sm:justify-evenly justify-start'>
                {/* Title */}
                <div className='flex items-center justify-between gap-2'>
                    <div className='flex flex-col mx-auto sm:mx-0'>
                        <div className='flex items-center gap-3 justify-center sm:justify-start'>
                            <span className='sm:inline-block hidden bg-background w-9 h-px' />
                            <h1 className='text-[max(20px,2vw)] font-bold relative'>Vehicle Categorie
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className='absolute inline-block -bottom-0.5 left-0 right-0 h-0.5 bg-background origin-left' />
                            </h1>
                        </div>
                        <p className='text-sm sm:ml-12 mt-2 text-zinc-500'>Choose the Vehicle that fits your journey</p>
                    </div>
                </div>
                {/* Card panel */}
                <div className='relative w-full'>
                    <motion.div
                        ref={sliderRef}
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        className='w-full flex gap-10 px-4 py-8 mt-10 overflow-x-auto scroll-smooth rounded-2xl'
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {
                            VEHICLE_CATEGORIES.map((vehicle, index) => {
                                return (
                                    <VehicleCard
                                        key={index}
                                        vehicle={vehicle}
                                        index={index}
                                        hoveredCard={hoveredCard}
                                        setHoveredCard={setHoveredCard}
                                    />
                                )
                            })
                        }
                    </motion.div>
                </div>
                {/* Left Right buttons */}
                <div className='gap-4 flex justify-center'>
                    <motion.button
                        onClick={() => scroll("left")}
                        whileTap={{ scale: 0.9 }}
                        className='w-10 h-10 flex items-center justify-center rounded-2xl border bg-white border-zinc-200 hover:bg-background transition-colors active:bg-background active:text-white hover:text-white hover:border-background disabled:hover:text-background disabled:hover:bg-white disabled:opacity-25 disabled:hover:border-zinc-200 disabled:cursor-not-allowed cursor-pointer duration-300'
                    ><FaAngleLeft className='font-extrabold text-lg' /></motion.button>
                    <motion.button
                        onClick={() => scroll("right")}
                        whileTap={{ scale: 0.9 }}
                        className='w-10 h-10 flex items-center justify-center rounded-2xl border bg-white border-zinc-200 hover:bg-background transition-colors active:bg-background active:text-white hover:text-white hover:border-background disabled:hover:text-background disabled:hover:bg-white disabled:opacity-25 disabled:hover:border-zinc-200 disabled:cursor-not-allowed cursor-pointer duration-300'
                    ><FaAngleRight className='font-extrabold text-lg' /></motion.button>
                </div>
                {/* Stats box */}
                <div
                    className='grid grid-cols-2 md:grid-cols-4 place-items-center gap-4 py-6 flex-wrap border-y border-zinc-200 mt-10'
                >
                    {
                        STATS.map(({ value, title }, index) => (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.2 * index }}
                                key={index} className='flex items-center gap-3'>
                                <p className='text-background text-[max(14px,1.3vw)] font-black tracking-tight'>{value}</p>
                                <p className='text-zinc-400 text-[max(12px,0.95vw)] font-medium '>{title}</p>
                            </motion.div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default VehicleCategories