const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

// Indexes for faster queries
// Note: userId index is already created by unique: true
wishlistSchema.index({ 'items.serviceId': 1 });
wishlistSchema.index({ userId: 1, 'items.serviceId': 1 });
wishlistSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
