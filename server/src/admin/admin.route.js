import { Router } from "express";
import User from "../user/user.model.js";
import vehicleModel from "../vehicle/vehicle.model.js";

const adminRouter = Router()

adminRouter.get("/",async (req,res)=>{
    const admin = req.user;
    try {
        const totalPartners = await User.countDocuments({role:"partner"}) 
        const totalApprovedPartners = await User.countDocuments({role:"partner",partnerStatus:"approved"}) 
        const totalPendingPartners = await User.countDocuments({role:"partner",partnerStatus:"pending"}) 
        const totalRejectedPartners = await User.countDocuments({role:"partner",partnerStatus:"rejected"}) 

        const pendingPartner = await User.find({role:'partner',partnerStatus:"pending",onboardingStep:3})
        const partnerIds = pendingPartner.map(p => p._id)

        const partnerVehicles = await vehicleModel.find({
            owner:{$in:partnerIds}
        })

        const vehicleTypes = new Map(
            partnerVehicles.map(v => [v.owner,v.type])
        )

        const pendingPartnerReviews = pendingPartner.map((p)=>({
            id:p._id,
            email:p.email,
            type:vehicleTypes.get(p._id),
            name:p.name
        }))

        return res.status(200).json({
            stats:{
                totalPartners,
                totalApprovedPartners,
                totalPendingPartners,
                totalRejectedPartners,
                pendingPartnerReviews
            },
            pendingPartnerReviews
        })


    } catch (error) {
        
    }
})

export default adminRouter