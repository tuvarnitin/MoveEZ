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
            const accessToken = await jwt.sign({
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }, process.env.JWT_SECRET, { expiresIn: "15m" })
            const refreshToken = await jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

            res.cookie("token", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 15 * 60 * 1000
            })
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            if(req.user.role === "partner"){
                res.redirect(`${process.env.FRONTEND_URL}/partner`);
            }else if(req.user.role === "admin"){
                res.redirect(`${process.env.FRONTEND_URL}/admin`);
            }else{
                res.redirect(`${process.env.FRONTEND_URL}`);
            }
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/auth?error=google_login_failed`)
        }
    })

export default googleRouter