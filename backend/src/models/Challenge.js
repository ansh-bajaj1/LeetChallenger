const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionNumbers: {
      type: [Number],
      default: [],
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

challengeSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
challengeSchema.index({ sender: 1, createdAt: -1 });

module.exports = mongoose.model('Challenge', challengeSchema);
