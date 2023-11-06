import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcrypt";
export const fetchUser = (req, res) => {
  res.json({
    message: "I have user details",
  });
};
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can only update your profile"));

  try {
    if (req.body.Password) {
      req.body.Password = bcrypt.hashSync(req.body.Password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          Email: req.body.Email,
          Password: req.body.Password,
          ProfileImg: req.body.ProfileImg,
        },
      },
      { new: true }
    );

    const { Password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your profile'))

try {
    await User.findByIdAndDelete(req.user.id)
    res.clearCookie('access_token');
    res.status(200).json('user has been deleted')
} catch (error) {
    next(error)
}

}

export const getUserListings = async(req, res, next)=>{
  if(req.user.id === req.params.id){
  try {
      const listings = await Listing.find({userRef: req.params.id})
      res.status(201).json(listings)
  } catch (error) {
      next(error)
  }
  }else{
      next(errorHandler(401, "you can only view your own listings"))
  }
  }

  export const deleteUserListing = async (req, res, next)=>{
   if(req.user.id === req.params.id) {
    try {
      const deletelisting = await Listing.findByIdAndDelete({_id: req.body.id})
      await res.status(201).json('one listing has been deleted')
    } catch (error) {
      next(error)
    }
   }else{
    next(errorHandler(401, 'you can only delete your own listings'))
   }
  } 

  export const getUser = async (req, res, next)=>{
    try {
      const userdata = await User.findById(req.params.id)
      if(!userdata) return next(errorHandler(404, 'user Not found!'))
      const {Password: pass, ...rest} = userdata._doc;
       res.status(200).json(rest)
    } catch (error) {
      next(error)
    }
  }


  