const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uploads: [{ type: String, required: true }], // Array of Cloudinary URLs
    desc: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feed', FeedSchema);