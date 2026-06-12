import React, { useEffect, useState } from 'react'

import { motion } from "motion/react"

import Button from './Button'
import DocsFileInput from './DocsFileInput'

import { RiLoader2Line, RiUploadCloud2Line } from 'react-icons/ri'

import { userService } from "../services/user.service"

const UploadDocuments = ({ nextStep, step, prevStep }) => {

    const [aadhar, setAadhar] = useState(null)
    const [license, setLicense] = useState(null)
    const [rc, setRc] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

    const [errors, setErrors] = useState({
        aadhar: "",
        license: "",
        rc: ""
    })

    const DOCS_INPUT_FIELDS = [
        {
            name: "aadhar",
            title: "Aadhar / ID Proof",
            subTitle: "Government issued id",
            value: aadhar,
            onChange: (e) => {
                setErrors(prev => ({
                    ...prev,
                    aadhar: ""
                }))
                setAadhar(e.target.files[0])
            }
        },
        {
            name: "license",
            title: "Driving License",
            subTitle: "Valid driving license",
            value: license,
            onChange: (e) => {
                setErrors(prev => ({
                    ...prev,
                    license: ""
                }))
                setLicense(e.target.files[0])
            }
        },
        {
            name: "rc",
            title: "Vehicle RC",
            subTitle: "Valid registration certificate",
            value: rc,
            onChange: (e) => {
                setErrors(prev => ({
                    ...prev,
                    rc: ""
                }))
                setRc(e.target.files[0])
            }
        }
    ]

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
            
            if(response.success){
                nextStep()
            }

        } catch (error) {
            console.log("Error : ", error)
            if (error.message == "File size error") {
                setErrors(error.errors)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className='-space-y-0.5 text-center'>
                <p className='text-xs text-gray-500 font-medium'>Step {step} of 3</p>
                <h1 className='text-xl font-bold'>Upload Documents</h1>
                <p className='text-xs text-gray-500 border-b border-gray-300 sm:border-0 pb-2 sm:pb-0'>Required for verification</p>
                <div className='space-y-4 mt-6'>
                    {
                        DOCS_INPUT_FIELDS.map((fields, index) => (
                            <DocsFileInput
                                key={index}
                                errors={errors}
                                isLoading={isLoading}
                                fields={fields}
                            />
                        ))
                    }
                </div>
            </div>
            <Button className="mt-4" text={"Continue"} onClick={handleUploadDocuments} fill={true} isLoading={isLoading} />
        </div>
    )
}

export default UploadDocuments