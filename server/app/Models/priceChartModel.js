import mongoose from "mongoose";

const priceChartSchema = new mongoose.Schema(
  {
    base_fare: {
      type: Number,
      required: true,
      default: 300, // basic charge for any service
    },

    per_km_rate: {
      type: Number,
      required: true,
      default: 20, // cost per km
    },

    per_sqft_rate: {
      type: Number,
      required: true,
      default: 3, // cost per square feet
    },

    // Optional: Different pricing for packing-only service
    packing_rate_per_sqft: {
      type: Number,
      default: 2,
    },

    // Optional: Add seasonal or weekend multiplier
    weekend_multiplier: {
      type: Number,
      default: 1, // 1 = no extra charge
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PriceChart", priceChartSchema);


// db.pricecharts.insertOne({
//   base_fare: 300,
//   per_km_rate: 20,
//   per_sqft_rate: 3,
//   packing_rate_per_sqft: 2,
//   weekend_multiplier: 1
// })
