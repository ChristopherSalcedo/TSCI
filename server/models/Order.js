import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: new mongoose.Schema(
      {
        specs: {
          type: String,
          required: true,
          trim: true,
          default: ''
        },
        no_pieces: {
          type: Number,
          required: true,
          trim: true,
          default: 0
        },
      },
      { _id: false }
    ),
  },
  blueprints: {
    type: Object,
    default: null
  },
  created_at: {
    type: String,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
