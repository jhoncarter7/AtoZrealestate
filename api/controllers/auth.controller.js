import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const signUp = async (req, res, next) => {
  const { userName, Email, Password } = req.body;
  console.log("all details", userName, Email, Password);
  const hashPassword = bcrypt.hashSync(Password, 10);
  const newUser = new User({ userName, Email, Password: hashPassword });
  try {
    await newUser.save();
    res.status(201).json("User Created Successfully");
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { Email, Password } =  req.body;
  try {
    const validUser = await User.findOne({ Email });
    if (!validUser) return next(errorHandler(404, "user not found!"));
    const validPassword = bcrypt.compareSync(Password, validUser.Password);
    if (!validPassword) return next(errorHandler(401, "wrong credential"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { Password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
