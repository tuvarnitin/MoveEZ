import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"

import { IoMdClose } from "react-icons/io";
import { MdEmojiFlags, MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { RiUser6Line } from "react-icons/ri";

import GoogleIcon from "../GoogleIcon.jsx"
import Input from '../Input.jsx';
import OtpInput from './Otp.jsx';
import Button from '../Button.jsx';
import OrDivider from '../OrDivider.jsx';

import { authService } from "../../services/auth.service.js"
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { closeAuthModal } from '../../redux/features/authSlice.js';

const authModel = () => {

  const currState = useSelector(state => state.auth.currState)
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const user = useSelector(state => state.auth.user)

  const dispatch = useDispatch()

  const naviagte = useNavigate()

  if (isAuthenticated && user.emailVerified) {
    dispatch(closeAuthModal())
    naviagte("/")
  }

  const name = useRef(null)
  const email = useRef(null)
  const password = useRef(null)


  const pageRef = useRef(null)
  const modelRef = useRef(null)

  const [fieldsErrors, setFieldsErrors] = useState({})
  const [responseError, setResponseErrors] = useState("")

  return (
    <div className='fixed inset-0 overflow-y-hidden left-0 z-10 bg-background/90 flex items-center justify-center transition-all overflow-hidden px-3' ref={pageRef} onClick={(e) => (e.target == pageRef.current) && dispatch(closeAuthModal())}>

      <div className='w-full sm:w-[62vw] md:w-[40vw] max-w-90 relative bg-white text-background pt-10 px-4 pb-6 rounded-md flex flex-col gap-4 items-center' ref={modelRef}>

        {/* Close Icon */}
        <IoMdClose
          className='absolute right-2 top-2 text-[max(1.7vw,28px)] cursor-pointer text-background/70'
          onClick={() =>
            dispatch(closeAuthModal())
          }
        />
        {/* Title  */}
        <div className=' flex flex-col gap-2 items-center'>
          <h1 className='font-[supercharge] text-[max(28px,1.8vw)] leading-1 '>Move<span className='text-[max(36px,2.3vw)] text-orange-500'>EZ</span></h1>
          <p className='text-[max(12px,.9vw)] text-background/50'>Easy vehicle bookings</p>
        </div>

        {/* Button - Continue wiht Google */}
        <Button
          text={`Continue with Google`}
          icon={<GoogleIcon />}
        />

        {/* Separator */}
        <OrDivider />
        {
          currState === "login" ?
            <Login />
            : (
              currState === "sign-up" ?
                <SignUp />
                :
                <OtpInput />
            )
        }
      </div>
    </div>
  )
}

export default authModel