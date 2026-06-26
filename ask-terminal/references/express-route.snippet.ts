// Add this to your local Express/Node dev server so /api/chat works identically
// in dev and in production. It reuses the SAME handleChat from api/chat.ts.
//
// Requires express.json() body parsing to be registered before this route.

app.post("/api/chat", async (req, res) => {
  const { handleChat } = await import("../../api/chat"); // adjust relative path
  const xff = req.headers["x-forwarded-for"];
  const ip = (typeof xff === "string" ? xff.split(",")[0] : req.socket?.remoteAddress || "unknown").trim();
  const result = await handleChat(req.body?.messages, ip);
  if (result.error) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(200).json({ reply: result.reply });
});
