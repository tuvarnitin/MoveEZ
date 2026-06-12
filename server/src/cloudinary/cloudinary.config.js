import { v2 as cloudinary } from "cloudinary"
import { Readable } from "stream"


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

export async function handleUpload(buffer,userId,documentName) {
    return new Promise((resolve, reject) => {
        const cloudinaryStream = cloudinary.uploader.upload_stream({
            folder:"partner-docs",
            public_id: `${documentName}-${userId}`
        },
            (err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        Readable.from(buffer).pipe(cloudinaryStream)
    })
}