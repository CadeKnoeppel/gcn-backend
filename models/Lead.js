import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  firmName:     { type: String, required: true },
  contact:      { type: String },
  email:        { type: String },
  phone:        { type: String },
  website:      { type: String },
  city:         { type: String },
  state:        { type: String },
  capabilities: { type: String },

  // ←––– Assignment
  assignedTo:   { type: String },       // employee’s name

  // ←––– Contact tracking
  contacted:      { type: Boolean, default: false },
  contactedBy:    { type: String, default: '' },  // employee’s name
  contactedEmail: { type: String, default: '' },  // employee’s email
  contactedAt:    { type: Date },              // timestamp of when they contacted

  contactLog:    { type: [String], default: [] }, // free-form notes
  timestamp:     { type: Date, default: Date.now } // import / creation time
});

export default mongoose.model('Lead', leadSchema);
