import express from "express";
import Session from "../models/Session.js";

const router = express.Router();

// Create new session on login
router.post("/start", async (req, res) => {
  try {
    const { userEmail } = req.body;
    const session = new Session({
      userEmail,
      loginTime: new Date()
    });
    await session.save();
    res.json({ sessionId: session._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to start session" });
  }
});

// Update session on logout
router.post("/end", async (req, res) => {
  try {
    const { sessionId } = req.body;
    await Session.findByIdAndUpdate(sessionId, { logoutTime: new Date() });
    res.json({ message: "Session ended" });
  } catch (err) {
    res.status(500).json({ error: "Failed to end session" });
  }
});

export default router;
