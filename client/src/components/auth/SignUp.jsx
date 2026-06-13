import React, { useRef, useState } from 'react'

import { CiLock } from 'react-icons/ci'
import { MdOutlineMail } from 'react-icons/md'
import { RiUser6Line } from 'react-icons/ri'

import Button from '../Button'
import Input from '../Input'

import { authService } from '../../services/auth.service'
import { validateFiels } from '../../utils/validateFields'

import { useDispatch } from 'react-redux'
import { loginSuccess, setCurrState } from '../../redux/features/authSlice'

const SignUp = () => {

  const [isLoading, setIsLoading] = useState(false)

  const name = useRef(null)
  const email = useRef(null)
  const password = useRef(null)

  const [fieldsErrors, setFieldsErrors] = useState({})
  const [responseError, setResponseErrors] = useState("")

  const dispatch = useDispatch()

  const INPUT_FIELDS = [
    {
      type: "text",
      name: "name",
      placeholder: "Name",
      icon: <RiUser6Line className='text-background/50 text-[max(22px,1.1vw)] stroke-[0.7px]' />,
      onChange: (e) => name.current.value = e.target.value,
      ref: name
    },
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

  const handleRegister = async () => {
    try {
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
      setIsLoading(true)
      const { user, token, success } = await authService.register({ name: name.current?.value, email: email.current?.value, password: password.current?.value })
      if (success) {
        dispatch(loginSuccess({
          user,
          token
        }))
        dispatch(setCurrState({
          state: "otp"
        }))
        setResponseErrors("")
      }
    } catch (error) {
      setFieldsErrors({})
      setResponseErrors(error)
    } finally {
      setIsLoading(false)
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
                className='text-[max(12px,0.4vw)] text-red-500'
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
      {/* Button - Continue */}
      <Button text={"Send OTP"} isLoading={isLoading} onClick={handleRegister} fill={true} />
      <p
        className='text-[max(14px,0.8vw)] text-background/60 text-center'
      >Already have an account? &nbsp;
        <span
          className='text-background text-[max(16px,1vw)] underline font-semibold cursor-pointer'
          onClick={() => dispatch(setCurrState({
            state: "login"
          }))}
        >Login</span>
      </p>
    </div>
  )
}

export default SignUp