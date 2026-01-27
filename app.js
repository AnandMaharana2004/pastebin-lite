import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { connectDB } from "./db/db.js"
import PasteRouter from "./routes/paste.route.js"

const app = express()

app.use(express.json())

app.get("/api/healthz", (req, res) => {
    return res.status(200).json({ ok: true })
})

app.use(PasteRouter)

const port = process.env.PORT || 3000
app.listen(port, async () => {
    await connectDB()
    console.log(`Server is listen on port : ${port}`);
})