const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { bookingsSchema } = require("./bookingsModel");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  userid: {
    type: String,
    required: [true, "Please provide your userid to authenticate"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide your password to authenticate"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password to authenticate"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  role: {
    type: String,
    enum: ["student", "dean"],
    default: "student",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
