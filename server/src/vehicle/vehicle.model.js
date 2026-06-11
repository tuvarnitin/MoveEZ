import mongoose from "mongoose"

const vehicleSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    },
    type:{
        type:String,
        enum:["bike","car","auto","bus","truck"],
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
        type:Number
    },
    waitingCharge:{
        type:Number
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
    },
    maxPassengers:{
        type:Number,
        required:true
    },
    luggageCapacity:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

const vehicleModel = mongoose.models.vehicles || mongoose.model("vehicle",vehicleSchema)

export default vehicleModel;