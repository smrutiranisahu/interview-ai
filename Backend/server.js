require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

const port = process.env.PORT || 3000

async function startServer() {
    await connectToDB()

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

startServer().catch((err) => {
    console.error("Failed to start server", err)
    process.exit(1)
})