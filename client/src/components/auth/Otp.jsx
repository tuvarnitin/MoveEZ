import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../Button'

import { authService } from '../../services/auth.service'

import { useDispatch, useSelector } from 'react-redux'
import { closeAuthModal, loginSuccess, setCurrState } from '../../redux/features/authSlice'

const OtpInput = ({}) => {
    
    const LENGTH = 4
    const [otp, setOtp] = useState([...Array(LENGTH).fill("")])
    const [otpError, setOtpError] = useState([])

    const [isLoading,setLoading] = useState(false)

    const inputRefs = useRef([])

    const [responseError,setResponseErrors] = useState("")

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.data)

    const navigate = useNavigate()

    const focusElem = (index) => {
        inputRefs.current[index]?.focus();
    }

    const handleChange = (value, index) => {
        setOtpError([])
        setResponseErrors("")
        if (!/^\d*$/.test(value)) {
            setOtpError([...otpError, index])
            return
        } else {
            setOtpError([])
        }
        
        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)
        
        if (index > 0 && !otp[index]) {
            focusElem(index - 1)
        }
        
        if (value && index < LENGTH - 1) {
            focusElem(index + 1)
        }
        if (index === LENGTH - 1) {
            focusElem(index)
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            focusElem(index - 1);
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text").slice(0, LENGTH)

        if (!/^\d*$/.test(pasted)) {
            setOtpError([...otpError, 0])
            return
        } else {
            setOtpError([])
        }
        const newOtp = [...otp]

        pasted.split("").forEach((char, i) => {
            newOtp[i] = char
        });
        setOtp(newOtp)

        const nextIndex = Math.min(pasted.LENGTH, LENGTH - 1);
        focusElem(nextIndex);
    }

    const VerifyOtp = async () => {
        setResponseErrors("")
        try {
            const otpValue = otp.reduce((acc, curr) => acc + curr);
            if(otpValue.length < 4){
                setOtpError(otp.map((num,index)=> num === "" && index))
                focusElem(otp.indexOf(otp.find((num, index) => num === "")))
                return
            }
            const response = await authService.verifyOtp({ otp: otpValue })
            if (response.success) {
                dispatch(loginSuccess({
                    user:{
                        ...user,
                        emailVerified:true
                    }
                }))
                dispatch(closeAuthModal())
                dispatch(setCurrState({
                    state:"login"
                }))
                navigate("/")
            }
        } catch (error) {
            console.log(error)
            setResponseErrors(error)
            setOtpError([...Array.from({ length: LENGTH }, (_, i) => i)])
            focusElem(LENGTH-1)
        }

    }

    return (
        <div className='w-full flex flex-col justify-center gap-1'>
           <div className='w-full flex items-center justify-center gap-2'>
                {
                    otp.map((value, index) => (
                        <div key={index}
                            className={`border border-background/30 w-8 rounded-md flex items-center p-1 ${otpError.includes(index) ? "border-2 border-red-400" : "border-background/30"}`}>
                            <input
                                value={value}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyPress(e, index)}
                                onPaste={handlePaste}
                                maxLength={1}
                                ref={(e) => (inputRefs.current[index] = e)}
                                className='text-xl w-full text-center outline-none rounded-lg' />
                        </div>
                    ))
                }
           </div>
            {
                responseError &&
                <p
                    className='text-[max(12px,0.4vw)] my-2 text-center leading-1 text-red-500'
                >{responseError}</p>
            }
            <Button
                isLoading={isLoading}
                onClick={VerifyOtp}
                className="mt-2"
                text="Verify OTP"
                fill={true}
            />
        </div>
    )
}

export default OtpInput