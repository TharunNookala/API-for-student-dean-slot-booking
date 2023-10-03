const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      userid: req.body.userid,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      // authToken : uuidv4() // Generates a UUID token
    });
    const token = await signToken(newUser._id);

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent here!",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { userid, password } = await req.body;

    //Check if email is correct and user exist
    if (!userid || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a userid and password",
      });
    }

    //check if user exist && password is correct
    const user = await User.findOne({ userid }).select("+password");
    // console.log(user);

    const correct = await user.correctPassword(password, user.password); //true
    console.log("correct", correct);

    if (!user || !correct) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect userid or password",
      });
    }

    //IF EVERYTHING OK
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent here!",
    });
  }
};

// create a route to convert user to dean
// /verify-dean

exports.protect = async (req, res, next) => {
  //GET TOKEN AND CHECK IF IT IS THERE
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please try again.",
      });
    }
    //VERIFICATION TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //IF USER EXISTS
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "dean") {
      return res.status(403).json({
        status: "fail",
        message: "Access denied! You don't have permission for this action.",
      });
    }
    //IF USER CHANGE PASSWORD AFTER TOKEN ISSUED

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "Invalid token. Please log in again.",
    });
  }
};
