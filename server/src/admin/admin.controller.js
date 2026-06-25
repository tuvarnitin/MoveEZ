import User from "../user/user.model.js";
import Docs from "../user/userDoc.model.js";
import Bank from "../user/userBank.model.js";
import Vehicle from "../vehicle/vehicle.model.js";
import userModel from "../user/user.model.js";

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

        const pendingVideoKyc = await User.find({
            role: "partner",
            onboardingStep: 4,
            videoKycStatus: {
                $in: ["pending", "in_progress"]
            }
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

        const pendingVehicles = await Vehicle.find({
            status: "pending",
            baseFare:{$exists:true},
            pricePerKM:{$exists:true},
            waitingCharge:{$exists:true},
        }).populate("owner")

        return res.status(200).json({
            pendingVehicles,
            stats: {
                totalPartners,
                totalApprovedPartners,
                totalPendingPartners,
                totalRejectedPartners,
            },
            pendingVideoKyc,
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

export const fetchVehicle = async (req, res) => {
    try {
        const id = req.params.id
        const vehicle = await Vehicle.findById(id).populate("owner")

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        }

        return res.status(200).json({
            success: true,
            vehicle
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error (Fetch vehicle)",
            error
        })
    }
}

export const approveVehicle = async (req,res) => {
    try {
        const vehicleId = req.params.id
        const vehicle = await Vehicle.findById(vehicleId)
        const owner = await User.findById(vehicle.owner)

        if (!owner) {
            return res.status(400).json({
                success: false,
                message: "Partner not found"
            })
        }
        if (!vehicle) {
            return res.status(400).json({
                success: false,
                message: "Vehicle not found"
            })
        }

        if (vehicle.status === "approved") {
            return res.status(400).json({
                success: false,
                message: "Vehicle already approved"
            })
        }

        vehicle.status = "approved"
        vehicle.rejectionReason = ""
        await vehicle.save()

        owner.onboardingStep = 7
        await owner.save()

        return res.status(200).json({
            success: true,
            message: "Vehicle approved successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error (Approving Vehicle)",
            error
        })
    }
}
export const rejectVehicle = async (req,res) => {
    try {
        const vehicleId = req.params.id
        const reason = req.body.rejectionReason

        const vehicle = await Vehicle.findById(vehicleId)

        if (!vehicle) {
            return res.status(400).json({
                success: false,
                message: "Vehicle not found"
            })
        }
        if (!reason) {
            return res.status(400).json({
                success: false,
                message: "Please provide rejection reason"
            })
        }

        if (vehicle.status === "rejected") {
            return res.status(400).json({
                success: false,
                message: "Vehicle already rejected"
            })
        }

        vehicle.status = "rejected"
        vehicle.rejectionReason = reason
        await vehicle.save()

        return res.status(200).json({
            success: true,
            message: "Vehicle rejected successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error (Rejecting Vehicle)",
            error
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

export const startVideoCall = async (req, res) => {
    try {
        const partnerId = req.params.id
        const partner = await User.findById(partnerId)

        if (!partner || partner.role !== "partner") {
            return res.status(400).json({
                success: false,
                message: "Partner not found"
            })
        }

        const roomId = `kyc-${partnerId}-${Date.now()}`
        partner.videoKycRoomId = roomId;
        partner.videoKycStatus = "in_progress";
        partner.onboardingStep = 4;
        await partner.save()

        return res.status(200).json({
            success: true,
            roomId
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error (Start call)",
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
        partner.videoKycStatus = "pending"
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

export const videoKycComplete = async (req, res) => {
    try {
        const { roomId, action, reason } = req.body
        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room id is requried"
            })
        }

        if (!["approved", "rejected"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Invalid action"
            })
        }
        const partner = await User.findOne({
            videoKycRoomId: roomId,
            role: "partner"
        })

        if (!partner) {
            return res.status(400).json({
                success: false,
                message: "Partner not found"
            })
        }

        if (action === "approved") {
            partner.videoKycStatus = "approved"
            partner.videoKycRejectionReason = ""
            partner.onboardingStep = 5
            await partner.save()
        }

        if (action === "rejected") {
            if (!reason) {
                return res.status(400).json({
                    success: false,
                    message: "Rejection reason is required"
                })
            }
            partner.videoKycStatus = "rejected"
            partner.videoKycRejectionReason = reason.trim()
            partner.onboardingStep = 4
            await partner.save()
        }

        return res.status(200).json({
            success: true,
            message: "Video KYC completed",
            status: partner.videoKycStatus,
            partner
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Internal server error (Complete Video KYC)",
            error
        })
    }

}