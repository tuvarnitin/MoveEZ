import mongoose from "mongoose"

const userBankSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    accountHolder:{
        type:String,
        required:true
    },
    accountNumber :{
        type:String,
        required:true,
        unique:true
    },
    ifscCode:{
        type:String,
        required:true,
        uppercase:true
    },
    upi:String,
    status:{
        type:String,
        enum:["approved","pending","rejected"],
        default:"pending"
    },
},{
    timestamps:true
})

const userBankModel = mongoose.models.userbanks || mongoose.model("userbank",userBankSchema)

export default userBankModel