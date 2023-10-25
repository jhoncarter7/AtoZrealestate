import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
    const dispatch = useDispatch()
    const navigate =useNavigate()
    const googleHandler = async () =>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
        
            const resp = await fetch('/api/auth/google', {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userName: result.user.displayName, Email: result.user.email, ProfileImg: result.user.photoURL})
            })
            const data = await resp.json()
            dispatch(signInSuccess(data))
            navigate('/') 
        } catch (error) {
            console.log("Authentication Problem", error)
        }
    }
  return (
    <button type="button" className="bg-red-700 rounded-lg p-3 text-white uppercase" onClick={googleHandler}>Signin with google</button>
  )
}
