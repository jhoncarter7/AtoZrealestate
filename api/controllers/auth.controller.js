import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
export const signUp = async(req, res)=>{
   const {userName, Email, Password} = req.body;
   console.log("all details", userName, Email, Password)
   const hashPassword =  bcrypt.hashSync(Password, 10)
   const newUser = new User({userName, Email, Password: hashPassword})
   try {
    await newUser.save()
    res.status(201).json("User Created Successfully")
   } catch (error) {
   res.status(500).json(error.messag)
   }
}