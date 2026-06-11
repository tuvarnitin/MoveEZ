import React, { useRef, useState } from 'react'
import Button from './Button'

import BankInfoInput from "./BankInfoInput"

import { PiBank, PiCreditCardLight } from "react-icons/pi";
import { RiVerifiedBadgeLine } from 'react-icons/ri'
import { MdOutlinePhone } from 'react-icons/md';

const BankingInfo = ({ step, setStep, nextStep }) => {

    const holderName = useRef(null)
    const accountNumber = useRef(null)
    const ifscCode = useRef(null)
    const mobileNumber = useRef(null)
    const upiId = useRef(null)

    const [errors, setErrors] = useState({
        holderName: "",
        accountNumber: "",
        ifscCode: "",
        mobileNumber: "",
        upiId: ""
    })

    const handleSubmit = () => {
        setErrors({
            holderName: "",
            accountNumber: "",
            ifscCode: "",
            mobileNumber: "",
            upiId: ""
        })
        if (!holderName.current.value) {
            setErrors(prev => ({
                ...prev,
                holderName: "Account holder name is required"
            }))
        }
        if (!accountNumber.current.value) {
            setErrors(prev => ({
                ...prev,
                accountNumber: "Account number is required"
            }))
        }
        if (!ifscCode.current.value) {
            setErrors(prev => ({
                ...prev,
                ifscCode: "Account number is required"
            }))
        }
        if (!mobileNumber.current.value) {
            setErrors(prev => ({
                ...prev,
                mobileNumber: "Account number is required"
            }))
            return
        }

    }

    return (
        <div>
            <div className='-space-y-0.5 text-center'>
                <p className='text-xs text-gray-500 font-medium'>Step {step} of 3</p>
                <h1 className='text-xl font-bold'>Banking Information</h1>
                <p className='text-xs text-gray-500 '>Fill you Banking information</p>
            </div>
            <div className='space-y-8 mt-6'>
                <BankInfoInput
                    ref={holderName}
                    label="Account holder name"
                    Icon={RiVerifiedBadgeLine}
                    inputId="holderName"
                    placeholder="Enter account holder name"
                    errors={errors}
                />
                <BankInfoInput
                    ref={accountNumber}
                    label="Bank account number"
                    Icon={PiCreditCardLight}
                    inputId="accountNumber"
                    placeholder="Enter account number"
                    errors={errors}
                />
                <BankInfoInput
                    ref={ifscCode}
                    label="IFSC code"
                    Icon={PiBank}
                    inputId="ifscCode"
                    placeholder="PNB000123"
                    errors={errors}
                />
                <BankInfoInput
                    ref={mobileNumber}
                    label="Mobile number"
                    Icon={MdOutlinePhone}
                    inputId="mobileNumber"
                    placeholder="10 digit mobile number"
                    errors={errors}
                />
                <BankInfoInput
                    ref={upiId}
                    label="UPI Id (Optional)"
                    inputId="upiId"
                    placeholder="name@upi"
                    errors={errors}
                />

            </div>
            <Button className="mt-4" text={"Continue"} onClick={handleSubmit} fill={true} />
        </div>
    )
}

export default BankingInfo