const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = Schema({
  username: String,
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
