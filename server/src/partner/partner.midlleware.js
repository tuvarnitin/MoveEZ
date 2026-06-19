export const partnerMiddleware = async (req, res, next) => {
    const user = req.user
    if (user.role === "partner") {
        next()
    } else {
        return res.status(400).json({
            success: false,
            mesage: "Unauthorized access"
        })
    }
}