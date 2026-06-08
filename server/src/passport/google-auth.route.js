import express from "express"
import passport from "passport"
import jwt from 'jsonwebtoken'

const googleRouter = express.Router()

googleRouter.get("/",
    passport.authenticate('google', { scope: ['profile', "email"] })
)

googleRouter.get("/callback",
    passport.authenticate('google', { session: false }),
    async (req, res) => {
        try {
            const token = await jwt.sign({
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            )

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            res.redirect(`${process.env.FRONTEND_URL}`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/login?error=google_login_failed`)
        }
    })

export default googleRouter