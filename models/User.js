const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 },
  stripeCheckoutSessions: { type: [String], default: [] },
});

mongoose.model("users", userSchema);
