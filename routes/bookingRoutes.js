const express = require("express");
const authController = require("./../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.route("/student/free-slots").get(bookingController.getFreeSlots);

router.route("/student/book-slot").post(bookingController.bookSlot);

router.route("/dean/booked-slots").get(bookingController.getBookedSlots);

module.exports = router;
