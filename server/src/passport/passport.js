import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import passport from "passport"
import dotenv from "dotenv"

import User from "../user/user.model.js";

dotenv.config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            let user = await User.findOneAndUpdate(
                { email: profile.emails[0].value },
                {
                    name:profile.displayName,
                    googleId: profile.id,
                    avatar: profile.photos[0].value,
                    emailVerified: true,
                    authProvider: "google"
                },{
                    returnDocument: "after"
                });
                
            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    emailVerified: true,
                    authProvider: "google"
                })
            }
            return cb(null, user)
        } catch (error) {
            return cb(error, null)
        }
    }
));