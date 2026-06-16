export const adminMiddleware = async (req, res,next) => {
    const user = req.user
    if (user.role === "admin") {
        req.user = user
        next()
    } else {
        return res.status(400).json({
            success: false,
            mesage: "Unauthorized access"
        })
    }
}