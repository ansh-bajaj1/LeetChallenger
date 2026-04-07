const mongoose = require('mongoose');

const directTrackSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leetCodeUsername: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

directTrackSchema.index({ owner: 1, leetCodeUsername: 1 }, { unique: true });

module.exports = mongoose.model('DirectTrack', directTrackSchema);
