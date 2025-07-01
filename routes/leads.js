import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

/* ─────────────────────────────  GET /api/leads  ──────────────────────────────
 * Query params:
 *   user   – (required) employee’s name (e.g. "Cade")
 *   limit  – (optional) # leads to return / claim (default 10, max 100)
 * 
 * How it works:
 *   1. Finds up to `limit` unassigned leads and sets assignedTo = user.
 *   2. Returns all leads already assigned to that user (up to `limit`).
 *   3. Always sorted by newest first, so fresh imports show first.
 *---------------------------------------------------------------------------*/
router.get("/", async (req, res) => {
  const { user, limit = 10 } = req.query;
  if (!user) return res.status(400).json({ error: "Missing user name" });

  const lim = Math.min(Number(limit) || 10, 100); // cap at 100 per call

  try {
    /* 1️⃣  claim up to `lim` unassigned leads */
    const unclaimedIds = await Lead.find({ assignedTo: { $exists: false } })
      .select("_id")
      .limit(lim)
      .lean();

    if (unclaimedIds.length) {
      await Lead.updateMany(
        { _id: { $in: unclaimedIds.map((d) => d._id) } },
        { $set: { assignedTo: user } }
      );
    }

    /* 2️⃣  fetch the user’s leads (could be > lim over time) */
    const leads = await Lead.find({ assignedTo: user })
      .sort({ timestamp: -1 })
      .limit(lim);

    res.json(leads);
  } catch (err) {
    console.error("❌ Failed to fetch/assign leads:", err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

/* ──────────────────  GET /api/leads/daily-completed  ──────────────────── */
router.get("/daily-completed", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Missing email" });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  try {
    const count = await Lead.countDocuments({
      contactedEmail: email,
      contacted: true,
      contactedAt: { $gte: startOfDay },
    });

    res.json({ count });
  } catch (err) {
    console.error("❌ Failed to count daily leads:", err);
    res.status(500).json({ error: "Failed to count leads" });
  }
});

/* ────────────────────────  PATCH /api/leads/:id  ──────────────────────── */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await Lead.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("❌ Failed to update lead:", err);
    res.status(500).json({ error: "Failed to update lead" });
  }
});

export default router;
