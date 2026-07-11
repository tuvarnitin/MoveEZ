import { handleUpload } from "../cloudinary/cloudinary.config.js"
import userDocModel from "./userDoc.model.js"
import userBankModel from "./userBank.model.js"
import bookingModel from "../booking/booking.model.js"

export const uploadUserDocs = async (req, res) => {

    const MIN_FILE_SIZE = 100 * 1024

    try {
        const user = req.user

        const { aadhar, license, rc } = req.files

        const fileSizeErrors = {}

        if (aadhar[0].size < MIN_FILE_SIZE) {
            fileSizeErrors.aadhar = "Aadhar file size is too small."
        }
        if (license[0].size < MIN_FILE_SIZE) {
            fileSizeErrors.license = "License file size is too small."
        }

        if (rc[0].size < MIN_FILE_SIZE) {
            fileSizeErrors.rc = "RC file size is too small."
        }

        if (Object.entries(fileSizeErrors).length) {
            return res.status(400).json({
                success: false,
                message: "File size error",
                errors: fileSizeErrors
            })
        }

        if (!aadhar.length || !license.length || !rc.length) {
            return res.status(400).json({
                success: false,
                message: "All documents are required"
            })
        }

        const result = await Promise.allSettled([
            handleUpload(aadhar[0].buffer, user._id, "aadhar"),
            handleUpload(license[0].buffer, user._id, "license"),
            handleUpload(rc[0].buffer, user._id, "rc"),
        ])

        const hasNoErrors = result.every(({ status }) => status === "fulfilled")

        if (hasNoErrors) {
            const userDocs = await userDocModel.create({
                user: user._id,
                aadharUrl: result[0].value.secure_url,
                licenseUrl: result[1].value.secure_url,
                rcUrl: result[2].value.secure_url,
            })

            if (user.onboardingStep == 1) {
                user.onboardingStep = 2
            } else if (user.onboardingStep >= 2) {
                user.onboardingStep = 3
            }
            user.partnerStatus = "pending"
            user.rejectionReason = ""
            await user.save()

            res.status(201).json({
                success: true,
                message: "Documents uploaded successfully",
                user
            })
        } else {
            return res.status(500).json({
                success: false,
                message: `Internal server error (uploading documents)`
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error (uploading documents) : ${error}`,
            error
        })
    }
}

export const handleUserBank = async (req, res) => {
    const user = req.user
    try {
        const { accountHolder, accountNumber, ifscCode, mobileNumber, upiId } = req.body

        const errors = {}
        if (!accountHolder) {
            errors.accountHolder = "Account holder name is requried"
        }
        if (!accountNumber) {
            errors.accountNumber = "Account number is requried"
        }
        if (!ifscCode) {
            errors.ifscCode = "IFSC code is requried"
        }
        if (!mobileNumber) {
            errors.mobileNumber = "Mobile number is requried"
        }
        if (Object.entries(errors).length) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                errors
            })
        }
        
        let userBank

        const isAccExists = await userBankModel.findOne({ accountNumber }).populate("owner")

        if (isAccExists) {
            if (isAccExists.owner._id.toString() === user._id.toString()) {
                isAccExists.accountNumber = accountNumber
                isAccExists.accountHolder = accountHolder
                isAccExists.ifscCode = ifscCode
                isAccExists.mobileNumber = mobileNumber
                userBank = await isAccExists.save()
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Account number is already registered",
                })
            }
        }
        else {
            userBank = await userBankModel.create({
                owner: user._id,
                accountNumber,
                accountHolder,
                ifscCode,
                mobileNumber,
                upiId
            })
        }

        user.role = "partner"
        user.onboardingStep = 3
        user.partnerStatus = "pending"
        user.rejectionReason = ""
        await user.save()

        return res.status(201).json({
            success: true,
            message: "Bank info are submited successfully",
            details: {
                holderName: userBank.holdername,
                ifscCode: userBank.ifscCode,
                accountNumber: userBank.accountNumber,
                mobileNumber: userBank.mobileNumber
            },
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getUserBankDetails = async (req, res) => {
    const user = req.user
    const userBank = await userBankModel.findOne({ owner: user._id })
    user.mobileNumber = userBank.mobileNumber
    await user.save()
    if (userBank) {
        return res.status(200).json({
            success: true,
            bank: {
                holderName: userBank.accountHolder,
                ifscCode: userBank.ifscCode,
                accountNumber: userBank.accountNumber,
                mobileNumber: userBank.mobileNumber,
                upi: userBank.upi || ""
            }
        })
    }
}