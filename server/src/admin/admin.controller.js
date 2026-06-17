import User from "../user/user.model.js";
import Docs from "../user/userDoc.model.js";
import Bank from "../user/userBank.model.js";
import Vehicle from "../vehicle/vehicle.model.js";

export const fetchAdminData = async (req, res) => {
    const admin = req.user;
    try {
        const totalPartners = await User.countDocuments({ role: "partner" })
        const totalApprovedPartners = await User.countDocuments({ role: "partner", partnerStatus: "approved" })
        const totalPendingPartners = await User.countDocuments({ role: "partner", partnerStatus: "pending" })
        const totalRejectedPartners = await User.countDocuments({ role: "partner", partnerStatus: "rejected" })

        const pendingPartner = await User.find({ role: 'partner', partnerStatus: "pending", onboardingStep: { $gte: 3 } })
        const partnerIds = pendingPartner.map(p => p._id)

        const partnerVehicles = await Vehicle.find({
            owner: { $in: partnerIds }
        })

        const vehicleTypes = new Map(
            partnerVehicles.map(v => [v.owner, v.type])
        )

        const pendingPartnerReviews = pendingPartner.map((p) => ({
            id: p._id,
            email: p.email,
            type: vehicleTypes.get(p._id),
            name: p.name
        }))

        return res.status(200).json({
            stats: {
                totalPartners,
                totalApprovedPartners,
                totalPendingPartners,
                totalRejectedPartners
            },
            pendingPartnerReviews
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error (Admin /)",
            error: error.message
        })
    }
}

export const fetchPartnerData = async (req, res) => {
    try {
        const partnerId = req.params.id
        const partner = await User.findById(partnerId)

        if (!partner || partner.role !== "partner") {
            return res.status(400).json({
                success: false,
                message: "Partner not found"
            })
        }

        const vehicle = await Vehicle.findOne({ owner: partnerId })
        const docs = await Docs.findOne({ user: partnerId })
        const bank = await Bank.findOne({ owner: partnerId })

        return res.status(200).json({
            vehicle: vehicle || null,
            docs: docs || null,
            bank: bank || null,
            partner
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        })
    }
}

export const approvePartner = async (req, res) => {
    try {
        const partnerId = req.params.id
        const partner = await User.findById(partnerId)

        if (!partner || partner.role !== "partner") {
            return res.status(400).json({
                success: false,
                message: "Partner not found"
            })
        }

        if (partner.partnerStatus === "approved") {
            return res.status(400).json({
                success: false,
                message: "Partner already approved"
            })
        }

        const docs = await Docs.findOne({ user: partnerId })
        const bank = await Bank.findOne({ owner: partnerId })

        if (!docs || !bank) {
            return res.status(400).json({
                success: false,
                message: "Partner did not complete onboarding steps"
            })
        }

        partner.partnerStatus = "approved"
        partner.onboardingStep = 4
        await partner.save()

        docs.status = "approved"
        await docs.save()

        bank.status = "verified"
        await bank.save()

        return res.status(200).json({
            success: true,
            message: "Partner approved successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error (Approving partner)",
            error
        })
    }
}


export const rejectPartner = async (req, res) => {
    try {
        const partnerId = req.params.id
        const { rejectionReason } = req.body
        console.log(rejectionReason)
        const partner = await User.findById(partnerId)

        if (!partner || partner.role !== "partner") {
            return res.status(400).json({
                success: false,
                message: "Partner not found"
            })
        }

        const docs = await Docs.findOne({ user: partnerId })
        const bank = await Bank.findOne({ owner: partnerId })

        if (!docs || !bank) {
            return res.status(400).json({
                success: false,
                message: "Partner did not complete onboarding steps"
            })
        }

        partner.partnerStatus = "rejected"
        partner.onboardingStep = 3
        partner.rejectionReason = rejectionReason
        await partner.save()

        return res.status(200).json({
            success: true,
            message: "Partner rejected successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error (Rejecting partner)",
            error
        })
    }
}