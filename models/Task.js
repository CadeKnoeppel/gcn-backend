import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: String,
  createdBy: String,
  completed: { type: Boolean, default: false },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;
