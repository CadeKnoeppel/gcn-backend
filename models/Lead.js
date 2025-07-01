import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  firmName: { type: String, required: true },
  contact: String,
  email: String,
  phone: String,
  website: String,
  city: String,
  state: String,
  capabilities: String,
  contacted: { type: Boolean, default: false },
  contactedBy: { type: String, default: '' },
  contactLog: { type: [String], default: [] }, // ✅ ADD THIS LINE

  timestamp: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
