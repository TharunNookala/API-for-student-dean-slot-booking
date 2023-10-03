const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema({
  sessionDetails: {
    isBooked: {
      type: Boolean,
      default: false,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    slotTime: {
      type: Date,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Booking = mongoose.model("Booking", bookingsSchema);

module.exports = Booking;
