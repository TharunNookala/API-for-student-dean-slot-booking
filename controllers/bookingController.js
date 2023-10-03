const Bookings = require("../models/bookingsModel");

exports.bookSlot = async (req, res) => {
  try {
    const { sessionDetails } = req.body;
    const newSlot = await Bookings.create({
      isBooked: sessionDetails.isBooked,
      studentId: sessionDetails.studentId,
      deanId: sessionDetails.deanId,
      slotTime: sessionDetails.slotTime,
    });

    res.status(200).json({
      status: "success",
      data: {
        slots: newSlot,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
    });
  }
};

exports.getFreeSlots = async (req, res) => {
  try {
    const freeSlots = await Bookings.find({ "sessionDetails.isBooked": false });
    res.status(200).json({
      status: "success",
      data: {
        freeSlots,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error 123.",
    });
  }
};

exports.getBookedSlots = async (req, res) => {
  console.log(req.user);
  try {
    const deanId = req.user._id;

    const bookedSlots = await Bookings.find({
      "sessionDetails.deanId": deanId,
    });

    res.status(200).json({
      status: "success",
      data: {
        bookedSlots,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
