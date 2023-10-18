
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        require: true,
        unique: true,
    },
    userEmail:{
        type: String,
        require: true,
        unique: true,
    },
    userPassword:{
        type: String,
        require: true,
       
    },
})

const User = mongoose.model('User', userSchema)
export default User;
