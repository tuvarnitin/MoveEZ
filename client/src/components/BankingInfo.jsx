import React, { useRef, useState, useEffect, useCallback } from 'react'
import Button from './Button'

import BankInfoInput from "./BankInfoInput"

import { PiBank, PiCreditCardLight } from "react-icons/pi";
import { RiVerifiedBadgeLine } from 'react-icons/ri'
import { MdOutlinePhone } from 'react-icons/md';
import { userService } from '../services/user.service';
import { useNavigate } from 'react-router-dom';

const BankingInfo = ({ step, setStep, nextStep }) => {
    const [accountHolder, setAccountHolder] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [ifscCode, setIfscCode] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [upiId, setUpiId] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const [responseError, setResponseError] = useState("")

    const [errors, setErrors] = useState({
        accountHolder: "",
        accountNumber: "",
        ifscCode: "",
        mobileNumber: ""
    })

    const hanldeAccountHolderChange = useCallback((e) => {
        setErrors(prev => ({
            ...prev,
            accountHolder: ""
        }));
        setAccountHolder(e.target.value);
    }, [accountHolder])

    const hanldeAccountNumberChange = useCallback((e) => {
        setErrors(prev => ({
            ...prev,
            accountNumber: ""
        }));
        setAccountNumber(e.target.value);
    }, [accountNumber])

    const hanldeIfcsCodeChange = useCallback((e) => {
        setErrors(prev => ({
            ...prev,
            ifscCode: ""
        }));
        setIfscCode(e.target.value.toUpperCase());
    }, [ifscCode])

    const hanldeMobileNumberChange = useCallback((e) => {
        if (isNaN(Number(e.target.value))) return
        setErrors(prev => ({
            ...prev,
            mobileNumber: ""
        }));
        setMobileNumber(e.target.value);
    }, [mobileNumber])

    const hanldeUpiIdChange = useCallback((e) => {
        setUpiId(e.target.value);
    }, [upiId])

    const handleSubmit = async () => {
        const newError = {}
        if (!accountHolder) {
            newError.accountHolder = "Account holder name is required"
        }
        if (!accountNumber) {
            newError.accountNumber = "Account number is required"
        }
        if (!ifscCode) {
            newError.ifscCode = "IFSC code is required"
        }
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
            newError.ifscCode = "Invalid IFCS code"
        }
        if (!mobileNumber || mobileNumber.length !== 10) {
            newError.mobileNumber = "Invalid mobile number"
        }
        console.log(newError)
        if (Object.entries(newError).length) {
            setErrors(newError)
            return
        }
        try {
            setIsLoading(true)
            const response = await userService.hadnleUserBank({
                accountHolder,
                accountNumber,
                ifscCode,
                mobileNumber,
                upiId
            })
            if (response.success) {
                navigate("/partner/dashboard")
            }
        } catch (error) {
            if (error.message == "All fields are required") {
                setErrors(error.errors)
            }
            setResponseError(error.message)
        } finally {
            setIsLoading(false)
        }

    }

    const BANK_FIELDS = [
        {
            label: "Account holder name",
            Icon: RiVerifiedBadgeLine,
            value: accountHolder,
            id: "accountHolder",
            placeholder: "Enter account holder name",
            onChange: hanldeAccountHolderChange,
            error: errors.accountHolder
        },
        {
            label: "Bank account number",
            Icon: PiCreditCardLight,
            value: accountNumber,
            id: "accountNumber",
            placeholder: "Enter account number",
            onChange: hanldeAccountNumberChange,
            error: errors.accountNumber
        },
        {
            label: "IFSC code",
            Icon: PiBank,
            value: ifscCode,
            id: "ifscCode",
            placeholder: "PNBO000C010",
            onChange: hanldeIfcsCodeChange,
            maxLength: 11,
            error: errors.ifscCode
        },
        {
            label: "Mobile number",
            Icon: MdOutlinePhone,
            value: mobileNumber,
            id: "mobileNumber",
            placeholder: "+91 9876543210",
            onChange: hanldeMobileNumberChange,
            maxLength: 10,
            error: errors.mobileNumber
        },
        {
            label: "UPI id (Optional)",
            value: upiId,
            id: "upiId",
            placeholder: "name@upi",
            onChange: hanldeUpiIdChange,
            error: errors.upiId
        }
    ]

    return (
        <div>
            <div className='-space-y-0.5 text-center'>
                <p className='text-xs text-gray-500 font-medium'>Step {step} of 3</p>
                <h1 className='text-xl font-bold'>Banking Information</h1>
                <p className='text-xs text-gray-500 border-b border-gray-300 sm:border-0 pb-2 sm:pb-0'>Fill you Banking information</p>
            </div>
            <div className='space-y-8 mt-6'>
                {
                    BANK_FIELDS.map(({ label, Icon, value, id, placeholder, onChange, maxLength, error }, index) => (
                        <BankInfoInput
                            label={label}
                            Icon={Icon}
                            value={value}
                            id={id}
                            placeholder={placeholder}
                            onChange={onChange}
                            maxLength={maxLength}
                            error={error}
                        />
                    ))
                }
            </div>
            {
                responseError &&
                <p className='text-xs text-left ml-2 mt-0.5 text-red-500'>{responseError}</p>
            }
            <Button isLoading={isLoading} className="mt-4" onClick={handleSubmit} text={"Continue"} fill={true} />
        </div>
    )
}

export default BankingInfo