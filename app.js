import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { connectDB } from "./db/db.js"
import PasteRouter from "./routes/paste.route.js"
import { ensureDB } from "./middleware/ensureDb.js"
import path from "node:path"

const app = express()

app.use(express.json())

// Use DB middleware only for serverless
if (process.env.IS_SERVERLESS === "1") {
    app.use(ensureDB);
}
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public/html/index.html"));
});

app.get("/api/healthz", (req, res) => {
    return res.status(200).json({ ok: true })
})

app.use(PasteRouter)

// ServerFul mode (Render, local)
if (process.env.IS_SERVERLESS !== "1") {
    const port = process.env.PORT || 3000;
    app.listen(port, async () => {
        await connectDB();
        console.log(`Server is listening on port: ${port}`);
    });
}

export default app; // for serverless platforms