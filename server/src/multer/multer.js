import Multer from "multer"

const storage = new Multer.memoryStorage()

export const upload = Multer({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
    storage,
    limits:{
        fileSize:5*1024*1024
    }
})