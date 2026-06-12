import mongoose, { mongo } from "mongoose"

const userDocSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    aadharUrl:{
        type:String,
        required:true
    },
    rcUrl:{
        type:String,
        required:true
    },
    licenseUrl:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    },
    rejectionReason:{
        type:String,
        default:""
    }
},{
    timestamps:true
})

const userDocModel = mongoose.models.userdocs || mongoose.model("userdoc",userDocSchema)

export default userDocModel