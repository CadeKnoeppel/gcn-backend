import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// 👇 Explicitly bind to 'GCNCRM' to avoid fallback to 'local'
const Post = mongoose.connection.useDb('GCNCRM').model('Post', postSchema);
export default Post;
