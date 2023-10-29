import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcrypt from 'bcrypt'
export const fetchUser =  (req, res)=>{
    res.json({
        message: "I have user details"
    })
}
export const updateUser= async(req, res, next)=> {
if(req.user.id !== req.params.id) return next(errorHandler(403, 'You can only update your profile'))

try {
    if(req.body.Password){
        req.body.Password = bcrypt.hashSync(req.body.Password, 10)
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            userName: req.body.userName,
            Email: req.body.Email,
            Password: req.body.Password,
            ProfileImg: req.body.ProfileImg
        }
    }, {new: true})

    const {Password, ...rest} = updatedUser._doc
    res.status(200).json(rest)
} catch (error) {
    next(error)
}
}