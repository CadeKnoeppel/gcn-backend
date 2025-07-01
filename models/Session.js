import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userEmail: String,
  loginTime: { type: Date, required: true },
  logoutTime: Date
});

export default mongoose.model("Session", sessionSchema);
