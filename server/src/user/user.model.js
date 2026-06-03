import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userShcema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        minLength: [3, "Name must be of atleast 3 characters."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        lowercase: true,
        trim: true,
        index: true
    },
    role: {
        type: String,
        enum: ["user", "partner", "admin"],
        default: "user"
    },
    password: {
        type: String,
        minLength: [6, "Password must be of 6 characters."],
        select: false
    }
})

userShcema.pre("save",async function() {
    if(!this.isModified("password")) return
    this.password = bcrypt.hash(this.password,8)
})

userShcema.methods.comparePassword = async function(password){
    return bcrypt.compare(password,this.password)
}

userShcema.methods.generateToken = async function(){
    const token = await jwt.sign({id:this._id,name:this.name,email:this.email},process.env.JWT_SECRET)
    return token
}


const userModel = mongoose.models.user || mongoose.model("user",userShcema)

export default userModel
