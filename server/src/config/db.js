import mongoose from "mongoose";
 

const connectDB = async()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Mongo DB connected successfully")
    })
    .catch((err)=>{
        console.log(`Error while connecting DB : ${err}`)
    })
}

export default connectDB