const multer = require("multer")


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB
    },
    fileFilter: (req, file, callback) => {
        const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

        if (!allowedTypes.includes(file.mimetype)) {
            return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "resume"))
        }

        callback(null, true)
    }
})


module.exports = upload