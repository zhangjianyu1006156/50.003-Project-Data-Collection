import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  klook_price: {
    type: Number,
    required: true
  },
  tripcom_price: {
    type: Number,
    required: true
  }
});

export const ProductModel = mongoose.model('Product', productSchema);
