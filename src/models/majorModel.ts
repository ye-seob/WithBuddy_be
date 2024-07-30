const mongoose = require("mongoose");

const majorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    default: 0,
  },
});

const Major = mongoose.model("Major", majorSchema);

export default Major;
