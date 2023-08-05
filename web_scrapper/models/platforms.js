import mongoose from "mongoose"

const platformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  biggest_discount: {
    type: Number,
    required: true,
    unique: true
  }
})

export const PlatformModel = mongoose.model('Platform', platformSchema);    
