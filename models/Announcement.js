import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Announcement", announcementSchema);
