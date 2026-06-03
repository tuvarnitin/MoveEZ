import React, { useEffect, useRef, useState } from 'react'
import { IoMdClose } from "react-icons/io";

import { MdEmojiFlags, MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { RiUser6Line } from "react-icons/ri";

import GoogleIcon from "../components/GoogleIcon"
import Input from './Input';
import OtpInput from './OtpInput';

const LoginModal = ({ setIsLoginModalOpen }) => {

  const name = useRef(null)
  const email = useRef(null)
  const password = useRef(null)

  const [state, seState] = useState("otp")

  const pageRef = useRef(null)
  const modelRef = useRef(null)


  return (
    <div className='fixed inset-0 overflow-y-hidden left-0 z-10 bg-background/90 flex items-center justify-center transition-all overflow-hidden px-3' ref={pageRef} onClick={(e) => (e.target == pageRef.current) && setIsLoginModalOpen(false)}>
      {/* Close Icon */}
      <div className='w-full sm:w-[62vw] md:w-[40vw] max-w-90 relative bg-white text-background p-6 rounded-md flex flex-col gap-4 items-center' ref={modelRef}>
        <IoMdClose
          className='absolute right-2 top-2 cursor-pointer'
          onClick={() =>
            setIsLoginModalOpen(false)
          }
        />
        <div className=' flex flex-col items-center'>
          <h1 className='font-[euro-fill] text-lg '>Move<span className='text-2xl text-orange-500'>EZ</span></h1>
          <p className='text-xs text-background/50'>Easy vehicle bookings</p>
        </div>
        <button className='w-full text-sm font-semibold flex items-center justify-center gap-2 py-1 px-4 border border-background/30 rounded-md cursor-pointer hover:bg-background hover:text-white transition-all duration-200 ease-in-out hover:scale-96'>
          <GoogleIcon />
          Continue with Google
        </button>
        <div className='w-full relative grid place-items-center'>
          <div className='w-full absolute top-1/2 h-px border-t border-background/30'></div>
          <h1 className='text-background/50 text-md z-10 p-1 bg-white'>or</h1>
        </div>
        <div className='w-full flex flex-col gap-2'>
          {
            state === "otp" ?
              <>
                <OtpInput length={3} />
                <button
                  className='w-full p-1.5 text-md font-semibold text-white bg-background rounded-md cursor-pointer hover:bg-background hover:text-white transition-all duration-200 ease-in-out hover:scale-96'
                  onClick={() => console.log(password?.current?.value, email.current.value)}
                >Verify OTP</button>
              </>
              :
              <>
                {
                  state === "sign-up" &&
                  <Input
                    type="text"
                    placeholder="Name"
                    icon={<RiUser6Line className='text-background/50 stroke-[0.7px]' />}
                    onChange={(e) => name.current.value = e.target.value}
                    ref={name}
                  />
                }
                <Input
                  type="email"
                  placeholder="Email Address"
                  icon={<MdOutlineMail className='text-background/50 ' />}
                  onChange={(e) => email.current.value = e.target.value}
                  ref={email}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  icon={<CiLock className='text-background/50 stroke-[0.7px]' />}
                  onChange={(e) => password.current.value = e.target.value}
                  ref={password}
                />
                <button
                  className='w-full p-1.5 text-md font-semibold text-white bg-background rounded-md cursor-pointer hover:bg-background hover:text-white transition-all duration-200 ease-in-out hover:scale-96'
                  onClick={() => console.log(password?.current?.value, email.current.value)}
                >Continue</button>
              </>
          }
        </div>

        {
          state === "login" &&
          <p
            className='text-xs text-background/60'
          >Don't have an account? &nbsp;
            <span
              className='text-background font-semibold cursor-pointer'
              onClick={() => seState("sign-up")}
            >Sign Up</span>
          </p>
        }
        {
          state === "sign-up" &&
          <p
            className='text-xs text-background/60'
          >Already have an account? &nbsp;
            <span
              className='text-background font-semibold cursor-pointer'
              onClick={() => seState("login")}
            >Login Up</span>
          </p>
        }
      </div>
    </div>
  )
}

export default LoginModal