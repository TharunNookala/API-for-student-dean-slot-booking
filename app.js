const express = require("express");
const bookingRouter = require("./routes/bookingRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

app.get("/", (req, res) => {
  res.send("I'm the home route");
});

// app.post("/", (req, res) => {
//   res.send("I'm the home route");
// });

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1", userRouter);

module.exports = app;
