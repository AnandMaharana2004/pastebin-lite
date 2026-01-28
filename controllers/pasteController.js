import { Paste } from "../models/pasteModel.js";
import { CreatePasteSchema, getPasteHTMLSchema, GetPasteSchema } from "../validation/pasteSchema.js";

export const CreatePaste = async (req, res) => {
    try {
        const result = CreatePasteSchema.safeParse(req.body);
        if (!result.success)
            return res.status(400).json({ message: result.error.issues[0].message });

        const { content, max_views, ttl_seconds } = result.data;

        const deleteAt = ttl_seconds
            ? new Date(Date.now() + ttl_seconds * 1000)
            : null;

        const paste = await Paste.create({
            content,
            deleteAt,
            viewCount: max_views ?? null, // null = unlimited views
        });

        return res.status(201).json({
            id: paste._id,
            url: `${process.env.FRONTEND_ORIGIN}/p/${paste._id}`,
        });
    } catch (error) {
        console.log("create paste fail", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const GetPaste = async (req, res) => {
    try {
        const parsed = GetPasteSchema.safeParse(req.params);
        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.issues[0].message });
        }

        const { id } = parsed.data;
        const paste = await Paste.findById(id);

        if (!paste) {
            return res.status(404).json({ message: "Paste not found or expired" });
        }

        // Handle view limit
        if (paste.viewCount !== null) {
            if (paste.viewCount <= 0) {
                await paste.deleteOne();
                return res.status(404).json({ message: "Paste expired" });
            }

            paste.viewCount -= 1;

            if (paste.viewCount === 0) {
                await paste.deleteOne();
            } else {
                await paste.save();
            }
        }

        const remainingSeconds = paste.deleteAt
            ? Math.max(0, Math.floor((paste.deleteAt - Date.now()) / 1000))
            : null;

        return res.status(200).json({
            content: paste.content,
            remaining_seconds: remainingSeconds,
            remaining_views: paste.viewCount,
        });
    } catch (error) {
        console.error("get paste fail", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getPasteHTML = async (req, res) => {
    try {
        const result = getPasteHTMLSchema.safeParse(req.params)

        if (!result.success || !result.data) return res.status(404).send(result.error.issues[0].message)

        const { id } = result.data

        const paste = await Paste.findById(id);
        if (!paste) {
            return res.status(404).send("Not Found");
        }

        const now = process.env.TEST_MODE === "1" && req.header("x-test-now-ms")
            ? new Date(Number(req.header("x-test-now-ms")))
            : new Date();

        // TTL check
        if (paste.deleteAt && paste.deleteAt <= now) {
            await paste.deleteOne();
            return res.status(404).send("Not Found");
        }

        // View limit check
        if (paste.viewCount !== null) {
            if (paste.viewCount <= 0) {
                await paste.deleteOne();
                return res.status(404).send("Not Found");
            }

            paste.viewCount -= 1;
            await paste.save();

            if (paste.viewCount === 0) {
                await paste.deleteOne();
            }
        }

        const safeContent = paste.content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Paste</title>
        </head>
        <body>
          <pre>${safeContent}</pre>
        </body>
      </html>
    `;

        res.status(200).send(html);
    } catch (error) {
        console.log("Fail to get paste html file", error);
        res.status(500).send("Server error");
    }
};
