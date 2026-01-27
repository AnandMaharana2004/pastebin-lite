import { Router } from "express";
import { CreatePaste, GetPaste, getPasteHTML } from "../controllers/pasteController.js";

const router = Router()

router.post("/api/pastes", CreatePaste)
router.get("/api/pastes/:id", GetPaste)
router.get("/p/:id", getPasteHTML)
export default router