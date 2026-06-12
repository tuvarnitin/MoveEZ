import { handleUpload } from "../cloudinary/cloudinary.config.js"
import userDocModel from "./userDoc.model.js"

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

            user.onboardingStep = 3
            await user.save()

            res.status(201).json({
                success: true,
                message: "Documents uploaded successfully",
                result
            })
        }

    } catch (error) {
        return res.json({
            success: false,
            message: `Internal server error (uploading documents) : ${error}`,
            error
        })
    }
}