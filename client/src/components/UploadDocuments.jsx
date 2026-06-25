import React, { useCallback, useEffect, useState } from 'react'

import { motion } from "motion/react"

import Button from './Button'
import DocsFileInput from './DocsFileInput'

import { RiLoader2Line, RiUploadCloud2Line } from 'react-icons/ri'
import { LuFilePenLine } from "react-icons/lu";

import { userService } from "../services/user.service"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { setUserData } from '../redux/features/userSlice'

const UploadDocuments = () => {

    const userData = useSelector(state => state.user?.data)
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [aadhar, setAadhar] = useState(null)
    const [license, setLicense] = useState(null)
    const [rc, setRc] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

    const [errors, setErrors] = useState({
        aadhar: "",
        license: "",
        rc: ""
    })

    const handleAadharChange = useCallback((e) => {
        setErrors(prev => ({ ...prev, aadhar: "" }));
        setAadhar(e.target.files[0]);
    }, [aadhar]);

    const handleLicenseChange = useCallback((e) => {
        setErrors(prev => ({ ...prev, license: "" }));
        setLicense(e.target.files[0]);
    }, [license]);

    const handleRcChange = useCallback((e) => {
        setErrors(prev => ({ ...prev, rc: "" }));
        setRc(e.target.files[0]);
    }, [rc]);

    const handleUploadDocuments = async () => {
        const newErrors = {
            aadhar: "",
            license: "",
            rc: ""
        };

        if (!aadhar) {
            newErrors.aadhar = "ID proof is required";
        }

        if (!license) {
            newErrors.license = "License is required";
        }

        if (!rc) {
            newErrors.rc = "Registration certificate is required";
        }
        setErrors(newErrors)

        try {
            setIsLoading(true)

            const hasErrors = Object.values(newErrors).some(Boolean);

            if (hasErrors) return;

            const formData = new FormData();
            formData.append("aadhar", aadhar)
            formData.append("license", license)
            formData.append("rc", rc)

            const response = await userService.uploadDocs(formData)

            if (response.success) {
                dispatch(setUserData({
                    user: response.user
                }))
                navigate("/partner/become-partner/bank-details")
            }
        } catch (error) {
            if (error.message == "File size error") {
                setErrors(error.errors)
            }
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (userData.onboardingStep < 1) {
            navigate("/partner/become-partner")
        }
    }, [])

    return (
        <div>
            <div className='-space-y-0.5 text-center'>
                <p className='text-xs text-gray-500 font-medium'>Step 2 of 3</p>
                <h1 className='text-xl font-bold'>Upload Documents</h1>
                <p className='text-xs text-gray-500 border-b border-gray-300 sm:border-0 pb-2 sm:pb-0'>Required for verification</p>
                <div className='space-y-4 mt-6'>
                    <DocsFileInput
                        name="aadhar"
                        title="Aadhar / ID Proof"
                        subTitle="Government issued id"
                        file={aadhar}
                        error={errors.aadhar}
                        onChange={handleAadharChange}
                    />

                    <DocsFileInput
                        name="license"
                        title="Driving License"
                        subTitle="Valid driving license"
                        file={license}
                        error={errors.license}
                        onChange={handleLicenseChange}
                    />

                    <DocsFileInput
                        name="rc"
                        title="Vehicle RC"
                        subTitle="Valid registration certificate"
                        file={rc}
                        error={errors.rc}
                        onChange={handleRcChange}
                    />
                </div>
            </div>
            <div className='flex items-center gap-2 pl-4 mt-3 justify-center'>
                <LuFilePenLine />
                <p className='text-xs text-zinc-400'>Documents are stored securly and manually verified by our team</p>
            </div>
            <Button className="mt-4" text={"Continue"} onClick={handleUploadDocuments} fill={true} isLoading={isLoading} />
        </div>
    )
}

export default UploadDocuments