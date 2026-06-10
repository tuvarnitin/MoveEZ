import mongoose from "mongoose"

const vehicleSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    },
    type:{
        type:String,
        enum:["bike","car","suv","bus","truck"],
        required:true
    },
    vehicleModel:{
        type:String,
        required:true
    },
    imageUrl:String,
    number:{
        type:String,
        required:true,
        unique:true
    },
    baseFare:{
        type:Number,
    },
    pricePerKM:{
        type:Number,
        required:true
    },
    waitingCharge:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["approved","pending","rejected"],
        default:"pending"
    },
    rejectionReason:String,
    isActive:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const vehicleModel = mongoose.models.vehicles || mongoose.model("vehicle",vehicleSchema)

export default vehicleModel;