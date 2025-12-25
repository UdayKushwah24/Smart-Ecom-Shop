const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Product'
  }],
});

userSchema.plugin(passportLocalMongoose); // this plugin is responsible for all the properties, that which can PLM provide you

let User = mongoose.model("User", userSchema);

module.exports = User;
