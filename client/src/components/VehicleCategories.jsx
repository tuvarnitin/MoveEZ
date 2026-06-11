import React, { useRef, useState } from 'react'
import { motion } from "motion/react"

import { FaAngleLeft, FaAngleRight, FaBus, FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa6'
import { IoSparklesOutline } from "react-icons/io5";
import { MdBikeScooter } from 'react-icons/md';

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
        },
        {
            id: "car",
            name: "Car",
            description: "Comfortable city travel",
            Icon: FaCar,
            badge: "Comfort",
        },
        {
            id: "suv",
            name: "SUV",
            description: "Premium & spacious",
            Icon: FaCar,
            badge: "Premium",
        },
        {
            id: "van",
            name: "Van",
            description: "Family & group transport",
            Icon: FaBus,
            badge: "Family",
        },
        {
            id: "truck",
            name: "Truck",
            description: "Heavy & commercial transport",
            Icon: FaTruck,
            badge: "Cargo",
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
                staggerChildren: 0.1,
            },
        },
    };

    const card = {
        hidden: {
            y: 10,
            opacity: 0,
        },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.2,
            },
        },
    };

    return (
        <div className='w-full min-h-140 bg-white text-background pt-10'>
            <div className='w-full max-w-7xl mx-auto bg-white'>
                <div className='flex items-center justify-between gap-2'>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-3'>
                            <span className='inline-block bg-background w-9 h-px' />
                            <h1 className='text-2xl font-bold relative'>Vehicle Categorie
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className='absolute inline-block -bottom-0.5 left-0 right-0 h-0.5 bg-background origin-left' />
                            </h1>
                        </div>
                        <p className='text-sm ml-12 mt-2 text-zinc-500'>Choose the Vehicle that fits your journey</p>
                    </div>
                    <div className='flex gap-4'>
                        <motion.button
                            onClick={() => scroll("left")}
                            whileTap={{ scale: 0.9 }}
                            className='w-10 h-10 flex items-center justify-center rounded-2xl border border-zinc-200 hover:bg-background transition-colors hover:text-white hover:border-background disabled:hover:text-background disabled:hover:bg-white disabled:opacity-25 disabled:hover:border-zinc-200 disabled:cursor-not-allowed cursor-pointer duration-300'
                        ><FaAngleLeft className='font-extrabold text-lg' /></motion.button>
                        <motion.button
                            onClick={() => scroll("right")}
                            whileTap={{ scale: 0.9 }}
                            className='w-10 h-10 flex items-center justify-center rounded-2xl border border-zinc-200 hover:bg-background transition-colors hover:text-white hover:border-background disabled:hover:text-background disabled:hover:bg-white disabled:opacity-25 disabled:hover:border-zinc-200 disabled:cursor-not-allowed cursor-pointer duration-300'
                        ><FaAngleRight className='font-extrabold text-lg' /></motion.button>
                    </div>
                </div>
                <div className='relative'>
                    <motion.div
                        ref={sliderRef}
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className='w-full flex gap-10 mx-auto px-20 py-10 mt-10 overflow-x-auto scroll-smooth'
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >

                        {
                            VEHICLE_CATEGORIES.map(({ id, name, description, Icon, badge }, index) => {
                                const isHover = hoveredCard == index
                                return (
                                    <motion.div
                                        key={id}
                                        variants={card}
                                        onHoverStart={() => setHoveredCard(index)}
                                        onHoverEnd={() => setHoveredCard(null)}
                                        whileHover={{
                                            y: -10,
                                            transition: {
                                                duration: 0.15,
                                            },
                                        }}
                                        className='group relative min-w-55 sm:min-w-65 shrink-0 cursor-pointer'
                                    >
                                        <motion.div
                                        variants={card}
                                            animate={{
                                                backgroundColor: isHover ? "#09090B" : "#ffffff",
                                                borderColor: isHover ? "#09090B" : "#e4e4e6",
                                                boxShadow: isHover ?
                                                    "0 24px 56px rgba(0,0,0,0.2)"
                                                    :
                                                    "0 2px 16px rgba(0,0,0,0.06)"
                                            }}
                                            transition={{ duration: 0.25 }}
                                            className='relative rounded-2xl p-6 sm:p-7 h-full'
                                        >
                                            <motion.div
                                                animate={{
                                                    backgroundColor: isHover ? "rgba(255,255,255,0.12)" : "#ffffff",
                                                    borderColor: isHover ? "rgba(255,255,255,0.15)" : "#e4e4e7",
                                                    color: isHover ? "#ffffff" : "#71717a"
                                                }}
                                                className='inline-flex items-center gap-1.5 border text-xs font-black uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-full mb-5 transition-colors'
                                            >
                                                <IoSparklesOutline />
                                                {
                                                    badge
                                                }
                                            </motion.div>
                                            <motion.div
                                                animate={{
                                                    backgroundColor: isHover ? "rgba(255,255,255,0.1)" : "#f4f4f5",
                                                    borderColor: isHover ? "rgba(255,255,255,0.15)" : "#e4e4e7"
                                                }}
                                                transition={{ duration: 0.2 }}
                                                className='w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 transition-colors'
                                            >
                                                <motion.div
                                                    animate={{
                                                        color: isHover ? "#ffffff" : "#3f3f46"
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {<Icon />}
                                                </motion.div>

                                            </motion.div>
                                            <motion.h3
                                                animate={{
                                                    color: isHover ? "#ffffff" : "#09090b"
                                                }}
                                                transition={{ duration: 0.2 }}
                                                className='text-lg font-black tracking-tight leading-none mb-2'
                                            >
                                                {name}
                                            </motion.h3>
                                            <motion.p
                                                animate={{ color: isHover ? "rgba(255,255,255,0.5)" : "#a1a1aa" }}
                                                transition={{ duration: 0.2 }}
                                                className='text-sm font-medium leading-relaxed'
                                            >
                                                {description}
                                            </motion.p>
                                        </motion.div>
                                    </motion.div>
                                )
                            })
                        }
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className='flex items-center justify-center gap-6 mt-8 pt-6 flex-wrap border-t border-zinc-200'
                    >
                        {
                            STATS.map(({ value, title }, index) => (
                                <div key={index} className='flex items-center gap-3'>
                                    <p className='text-background text-lg font-black tracking-tight'>{value}</p>
                                    <p className='text-zinc-400 text-sm font-medium '>{title}</p>
                                </div>
                            ))
                        }

                    </motion.div>
                </div>

            </div>
        </div>
    )
}

export default VehicleCategories