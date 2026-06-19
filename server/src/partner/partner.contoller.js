export const requestKyc = async (req, res) => {
    try {
        const partner = req.user

        if (partner.videoKycStatus !== "rejected") {
            return res.status(400).json({
                message: "You can not send kyc request at this time",
                success: false
            })
        }

        partner.videoKycStatus = "pending"
        partner.videoKycRejectionReason = ""
        partner.videoKycRoomId = ""
        await partner.save();

        return res.status(200).json({
            success: true,
            message: "Video kyc request sent",
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "Internal server error (Request video KYC)",
            error
        })
    }
}