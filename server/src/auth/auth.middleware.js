import jwt from "jsonwebtoken"
import User from "../user/user.model.js"

export const authMiddleware = async (req,res,next) => {

    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not provided"
            })
        }
        try {
            const {id} = await jwt.verify(token,process.env.JWT_SECRET)
            const user = await User.findById(id)
            
            if(!user){
                return res.status(401).json({
                    success: false,
                    message: "Unauthorize"
                })
            }
            req.user = user
            next()
        } catch (error) {
            res.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
}