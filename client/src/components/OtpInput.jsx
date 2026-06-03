import React, { useRef, useState } from 'react'

const OtpInput = ({ length = 4 }) => {

    const [otp, setOtp] = useState(Array(length).fill(""))
    const [otpError,setOtpError] = useState([])

    const inputRefs = useRef([])

    const focusElem = (index) => {
       inputRefs.current[index]?.focus();
    }

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)){
            setOtpError([...otpError,index])
            return
        }else{
            setOtpError([])
        }

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)

        if (index > 0 && !otp[index]){
            focusElem(index-1)
        }

        if (value && index < length - 1) {
            focusElem(index + 1)
        }
        if(index === length-1){
            focusElem(index)
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            focusElem(index - 1);
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text").slice(0,length)

        if (!/^\d*$/.test(pasted)) {
            setOtpError([...otpError, 0])
            return
        } else {
            setOtpError([])
        }
        const newOtp = [...otp]

        pasted.split("").forEach((char,i) => {
            newOtp[i] = char
        });
        setOtp(newOtp)

        console.log(pasted,newOtp)
        const nextIndex = Math.min(pasted.length, length - 1);
        focusElem(nextIndex);
    }


    return (
        <div className='flex justify-center gap-1'>
            {
                otp.map((value, index) => (
                    <div key={`${index}-`}
                        className={`border border-background/30 w-8 rounded-md flex items-center p-1 ${otpError.includes(index) ? "border-red-400" : "border-background/30"}`}>
                        <input
                            value={value}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e)=>handleKeyPress(e,index)}
                            onPaste={handlePaste}
                            maxLength={1}
                            ref={(e) => (inputRefs.current[index] = e)}
                            className='text-xl w-full text-center outline-none rounded-lg' />
                    </div>
                ))
            }
        </div>
    )
}

export default OtpInput