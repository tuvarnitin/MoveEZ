import React from 'react'
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";


import { FaCarSide, FaBusSimple } from "react-icons/fa6";
import { FaMotorcycle, FaTruck } from "react-icons/fa";

import Navbar from './Navbar';

const Hero = ({ setIsAuthModalOpen, isLogin }) => {

    const VEHICLE_LIST = [
        {
            name: "Bike",
            icon: <FaMotorcycle className='text-[max(20px,4vw)] md:text-[max(28px,3vw)] lg:text-[max(26px,1.8vw)]'/>
        },
        {
            name: "Car",
            icon: <FaCarSide className='text-[max(20px,4vw)] md:text-[max(28px,3vw)] lg:text-[max(26px,1.8vw)]'/>
        },
        {
            name: "Bus",
            icon: <FaBusSimple className='text-[max(20px,4vw)] md:text-[max(28px,3vw)] lg:text-[max(26px,1.8vw)]'/>
        },
        {
            name: "Truck",
            icon: <FaTruck className='text-[max(20px,4vw)] md:text-[max(28px,3vw)] lg:text-[max(26px,1.8vw)]'/>
        },
    ]


    return (
        <div className='overflow-x-hidden'>
            <main className="w-full min-h-160 sm:min-h-130 flex flex-col justify-center items-center gap-6">
                <div className='flex flex-col items-center'>
                    <div className="w-full flex justify-center items-baseline gap-2 sm:gap-4">
                        <h1 className="text-[max(2.5vw,16px)] sm:leading-0 font-[supercharge] select-none pointer-events-none text-nowrap">Start Your Journey With</h1>
                        <img src="/logo.png" alt="" className="w-[max(100px,16vw)] select-none pointer-events-none" height={100} />
                    </div>
                    <h1 className="font-[avenis] tracking-wider sm:mt-4 text-[max(1.4vw,14px)]">Seamless vehicle booking, anytime, anywhere.</h1>
                </div>
                <div className="flex gap-[max(30px,10vw)] sm:gap-14 items-center">
                    {
                        VEHICLE_LIST.map(({ name, icon }) => (
                            <div key={`${name}`} className='flex flex-col items-center'>{icon} <h1 className='text-[max(1.4vw,12px)]'>{name}</h1></div>
                        ))
                    }
                </div>
                <button className="px-4 py-2 text-background bg-white rounded-full cursor-pointer hover:bg-white/90" onClick={()=>{
                    if(!isLogin) setIsAuthModalOpen(true)
                }}>Book Now</button>
            </main>
        </div>
    )
}

export default Hero