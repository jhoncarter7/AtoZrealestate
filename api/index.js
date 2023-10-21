import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import getUser from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
// import User from "./models/user.model.js";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server running on port 3000:");
});
// here we first say that we are going to api than / categaries like auth, user than inside the categaries we target different route inthat categaries i.e /api/categaries(auth)/subcategaries(getuser, getdetails)
app.use("/api/user", getUser);
app.use("/api/auth", authRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
