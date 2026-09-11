const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.use((err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Resume must be 3MB or smaller" })
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ message: "Resume must be a PDF or DOCX file" })
    }

    console.error(err)
    const providerMessage = err.error?.message || err.message || "Interview generation failed"
    const message = providerMessage.includes("API key not valid")
        ? "The AI service is not configured. Add a valid GOOGLE_GENAI_API_KEY in Render."
        : providerMessage

    res.status(err.status || err.statusCode || 500).json({
        message: process.env.NODE_ENV === "production" ? message : err.message
    })
})


module.exports = app