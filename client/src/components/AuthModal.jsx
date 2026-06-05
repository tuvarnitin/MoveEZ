import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"

import { IoMdClose } from "react-icons/io";
import { MdEmojiFlags, MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { RiUser6Line } from "react-icons/ri";

import GoogleIcon from "./GoogleIcon"
import Input from './Input';
import OtpInput from './OtpInput';
import Button from './Button';
import OrDivider from './OrDivider';

import { authService } from "../services/auth.service.js"

const LoginModal = ({ isLogin, setIsLogin, setIsAuthModalOpen }) => {

  const naviagte = useNavigate()

  if (isLogin) {
    setIsAuthModalOpen(true)
    naviagte("/")
  }

  const name = useRef(null)
  const email = useRef(null)
  const password = useRef(null)

  const [state, seState] = useState("login")

  const pageRef = useRef(null)
  const modelRef = useRef(null)

  const [shake, setShake] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const [fieldsErrors, setFieldsErrors] = useState({})
  const [responseError, setResponseErrors] = useState("")

  const INPUT_FIELDS = [
    {
      type: "email",
      name: "email",
      placeholder: "Email Address",
      icon: <MdOutlineMail className='text-background/50 text-[max(22px,1.1vw)] ' />,
      onChange: (e) => email.current.value = e.target.value,
      ref: email
    },
    {
      type: "password",
      name: "password",
      placeholder: "Password",
      icon: <CiLock className='text-background/50 text-[max(22px,1.1vw)] stroke-[0.7px]' />,
      onChange: (e) => password.current.value = e.target.value,
      ref: password
    }
  ]

  const validateFiels = (fields) => {
    const errors = {};

    if (state === "sign-up") {
      if (!fields.name?.trim()) errors.name = "Name is required";
    }
    if (!fields.email?.trim()) errors.email = "Email is required";
    if (!fields.password?.trim()) errors.password = "Password is required";

    return errors;
  };

  const handleLogin = async () => {

    setFieldsErrors({})
    setResponseErrors("")

    const error = validateFiels({
      email: email.current?.value,
      password: password.current?.value,
    })
    if (Object.keys(error).length) {
      setFieldsErrors(error)
      return
    }

    setLoading(true)

    try {

      const response = await authService.login({ email: email.current?.value, password: password.current?.value })
      if (response.success) {
        setIsLogin(true)
        setIsAuthModalOpen(false)
        localStorage.setItem("name", response.user.name)
        naviagte("/")
      }
    } catch (error) {
      setResponseErrors(error)
    } finally {
      setFieldsErrors({})
      setLoading(false)
    }
  }
  const handleRegister = async () => {

    setFieldsErrors({})
    setResponseErrors("")

    const error = validateFiels({
      name: name.current?.value,
      email: email.current?.value,
      password: password.current?.value,
    })

    if (Object.keys(error).length) {
      setFieldsErrors(error)
      return
    }

    try {
      const response = await authService.register({ name: name.current?.value, email: email.current?.value, password: password.current?.value })
      if (response.success) {
        setIsLogin(true)
        setResponseErrors("")
        setIsAuthModalOpen(false)
        localStorage.setItem("name", response.user.name)
        naviagte("/")
      }
    } catch (error) {
      setFieldsErrors({})
      setResponseErrors(error)
    }
  }

  return (
    <div className='fixed inset-0 overflow-y-hidden left-0 z-10 bg-background/90 flex items-center justify-center transition-all overflow-hidden px-3' ref={pageRef} onClick={(e) => (e.target == pageRef.current) && setIsAuthModalOpen(false)}>

      <div className='w-full sm:w-[62vw] md:w-[40vw] max-w-90 relative bg-white text-background p-6 pt-10 rounded-md flex flex-col gap-4 items-center' ref={modelRef}>

        {/* Close Icon */}

        <IoMdClose
          className='absolute right-2 top-2 text-[max(1.7vw,28px)] cursor-pointer text-background/70'
          onClick={() =>
            setIsAuthModalOpen(false)
          }
        />
        {/* Title  */}
        <div className=' flex flex-col gap-3 items-center'>
          <h1 className='font-[supercharge] text-[max(28px,1.8vw)] leading-1 '>Move<span className='text-[max(36px,2.3vw)] text-orange-500'>EZ</span></h1>
          <p className='text-[max(16px,1vw)] text-background/50'>Easy vehicle bookings</p>
        </div>

        {/* Button - Continue wiht Google */}
        <Button
          text={`Continue with Google`}
          icon={<GoogleIcon />}
        />

        {/* Separator */}
        <OrDivider />

        {/* All input fields wiht conditional rendering */}
        <div className='w-full flex flex-col gap-2'>
          {
            state === "otp" ?
              <>
                <OtpInput length={6} />
                <Button
                  isLoading={isLoading}
                  onClick={() => console.log(password?.current?.value, email.current.value)}
                  text="Verify OTP"
                />
              </>
              :
              <>
                {
                  state === "sign-up" &&
                  <>
                    <Input
                      errors={fieldsErrors}
                      type="text"
                      placeholder="Name"
                      name="name"
                      icon={<RiUser6Line className='text-background/50 text-[max(22px,1.1vw)] stroke-[0.7px]' />}
                      onChange={(e) => name.current.value = e.target.value}
                      ref={name}
                    />
                    {fieldsErrors.name && <p
                      className='text-[max(12px,0.4vw)] leading-1 text-red-500'
                    >{fieldsErrors.name}</p>}
                  </>
                }
                {/* A input field array is created, in future if we wan to add a new input field we don't need to search for the UI prt we simply add the new object in the INPUT_FIELDS array */}
                {
                  INPUT_FIELDS.map(({ type, name, placeholder, icon, onChange, ref }, index) => (
                    <>
                      <Input
                        key={index}
                        errors={fieldsErrors}
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        icon={icon}
                        onChange={onChange}
                        ref={ref}
                      />
                      {fieldsErrors[name] &&
                        <p
                          className='text-[max(12px,0.4vw)] leading-1 text-red-500'
                        >{fieldsErrors[name]}</p>
                      }
                    </>
                  ))
                }
                {responseError &&
                  <p
                    className='text-[max(12px,0.4vw)] leading-1 text-red-500'
                  >{responseError}</p>
                }
                {
                  state === "login" &&
                  <a href="#" className='text-[max(12px,0.9vw)] text-purple-950 hover:underline text-right'>forgot password</a>
                }
                {/* Button - Continue */}
                <Button text="Continue" isLoading={isLoading} onClick={state === "login" ? handleLogin : handleRegister} fill={true} />
              </>
          }
        </div>


        {
          state === "login" &&
          <p
            className='text-[max(14px,0.8vw)] text-background/60'
          >Don't have an account? &nbsp;
            <span
              className='text-background text-[max(16px,1vw)] underline font-semibold cursor-pointer'
              onClick={() => seState("sign-up")}
            >Sign Up</span>
          </p>
        }
        {
          state === "sign-up" &&
          <p
            className='text-[max(14px,0.8vw)] text-background/60'
          >Already have an account? &nbsp;
            <span
              className='text-background text-[max(16px,1vw)] underline font-semibold cursor-pointer'
              onClick={() => seState("login")}
            >Login</span>
          </p>
        }
      </div>
    </div>
  )
}

export default LoginModal