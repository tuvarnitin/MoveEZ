import React, { useRef, useState } from 'react'

import { validateFiels } from "../../utils/validateFields.js"
import Input from '../Input'
import Button from '../Button.jsx'
import { authService } from '../../services/auth.service.js'

import { MdOutlineMail } from 'react-icons/md'
import { CiLock } from 'react-icons/ci'

import { useDispatch } from 'react-redux'
import { closeAuthModal, loginSuccess, setCurrState } from '../../redux/features/authSlice.js'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [isLoading, setLoading] = useState(false)

  const email = useRef(null)
  const password = useRef(null)

  const [fieldsErrors, setFieldsErrors] = useState({})
  const [responseError, setResponseErrors] = useState("")

  const dispatch = useDispatch()

  const navigate = useNavigate()

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
        dispatch(loginSuccess({
          user: response.user,
          token: response.token
        }))
        dispatch(closeAuthModal({}))
        if (response.user.role == "partner")
          navigate("/partner")
        else if (response.user.role == "admin")
          navigate("/admin")
        else
          navigate("/bookings")
      }
    } catch (error) {
      setResponseErrors(error.message)
    } finally {
      setFieldsErrors({})
      setLoading(false)
    }
  }
  return (
    <div className='w-full flex flex-col gap-2'>
      {
        INPUT_FIELDS.map(({ type, name, placeholder, icon, onChange, ref }, index) => (
          <div key={`${name}-${index}`}>
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
          </div>
        ))
      }
      {
        responseError &&
        <p
          className='text-[max(12px,0.4vw)] text-red-500'
        >{responseError}</p>
      }
      <a href="#" className='text-[max(12px,0.9vw)] text-purple-950 hover:underline block text-right'>forgot password</a>
      {/* Button - Continue */}
      <Button text={"Continue"} isLoading={isLoading} onClick={handleLogin} fill={true} />
      <p
        className='text-[max(14px,0.8vw)] text-background/60 text-center'
      >Don't have an account? &nbsp;
        <span
          className='text-background text-[max(16px,1vw)] underline font-semibold cursor-pointer'
          onClick={() => dispatch(setCurrState({
            state: "sign-up"
          }))}
        >Sign Up</span>
      </p>
    </div>
  )
}

export default Login