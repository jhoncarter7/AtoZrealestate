
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
        unique: true,
    },
    Email:{
        type: String,
        required: true,
        unique: true,
    },
    Password:{
        type: String,
        required: true,  
    },
    ProfileImg:{
        type: String,
        default: "https://icon-library.com/images/profile-picture-icon/profile-picture-icon-0.jpg"
    }
},{timestamps: true })

const User = mongoose.model('User', userSchema)
export default User;
