import React, { useEffect, useState } from 'react'

import { motion } from "motion/react"
import Button from './Button'
import { RiUploadCloud2Line } from 'react-icons/ri'
import DocsFileInput from './DocsFileInput'

const UploadDocuments = ({ nextStep, step, prevStep }) => {

    const [aadhar, setAadhar] = useState(null)
    const [license, setLicense] = useState(null)
    const [rc, setRc] = useState(null)
    const [errors, setErrors] = useState({
        aadhar: false,
        license: false,
        rc: false
    })

    const handleNextStep = () => {
        setErrors({
            aadhar: false,
            license: false,
            rc: false
        })
        if (!aadhar) {
            setErrors(prev => ({
                ...prev,
                aadhar: true
            }))
        }
        if (!license) {
            setErrors(prev => ({
                ...prev,
                license: true
            }))
        }
        if (!rc) {
            setErrors(prev => ({
                ...prev,
                rc: true
            }))
            return
        }
        console.log(aadhar, license, rc)
        nextStep()
    }

    return (
        <div>
            <div className='-space-y-0.5 text-center'>
                <p className='text-xs text-gray-500 font-medium'>Step {step} of 3</p>
                <h1 className='text-xl font-bold'>Upload Documents</h1>
                <p className='text-xs text-gray-500 '>Required for verification</p>
                <div className='space-y-6 mt-6'>
                    <DocsFileInput
                        errors={errors}
                        name="aadhar"
                        title="Aadhar / ID Proof"
                        subTitle="Government issued id"
                        onChange={(e) => {
                            setErrors(prev => ({
                                ...prev,
                                aadhar:false
                            }))
                            setAadhar(e.target.files[0])
                        }}
                    />
                    <DocsFileInput
                        errors={errors}
                        name="license"
                        title="Driving License"
                        subTitle="Valid driving license"
                        onChange={(e) => {
                            setErrors(prev => ({
                                ...prev,
                                license: false
                            }))
                            setLicense(e.target.files[0])
                        }}
                    />
                    <DocsFileInput
                        errors={errors}
                        name="rc"
                        title="Vehicle RC"
                        subTitle="Valid registration certificate"
                        onChange={(e) => {
                            setErrors(prev => ({
                                ...prev,
                                rc: false
                            }))
                            setRc(e.target.files[0])
                        }}
                    />
                </div>
            </div>
            <Button className="mt-4" text={"Continue"} onClick={handleNextStep} fill={true} />
        </div>
    )
}

export default UploadDocuments