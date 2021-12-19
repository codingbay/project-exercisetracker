const mongoose = require("mongoose");

const { Schema } = mongoose;

const exerciseSchema = Schema({
  userId: String,
  description: String,
  duration: Number,
  date: String,
});

const exerciseModel = mongoose.model("Exercise", exerciseSchema);

module.exports = exerciseModel;
