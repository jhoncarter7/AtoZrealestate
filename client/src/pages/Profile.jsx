import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { userUpdateStart, userUpdateSuccess, userUpdateFailure, userDeleteStart, userDeleteSuccess, userDeleteFailure, signoutStart, signoutFailure, signoutSuccess } from "../redux/user/userSlice";
import { app } from "../firebase";
import { Link } from "react-router-dom";
export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, ProfileImg: downloadURL })
        );
      }
    );
  };

  const changeHandler = (e) => {
    e.preventDefault();
    setFormData({...formData, [e.target.id]: e.target.value})
  };
const submitUpdateHanler = async (e) => {
  e.preventDefault();
 try {
  dispatch(userUpdateStart())
  const res = await fetch(`/api/user/update/${currentUser._id}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  const data = await res.json()
  console.log(data)
  if(data.success === false){
    dispatch(userUpdateFailure(data.message))
    return;
  }

  dispatch(userUpdateSuccess(data))
  setUpdateSuccess(true)
 } catch (error) {
  dispatch(userUpdateFailure(error.message))
 }
}

const deleteHandler = async()=>{
try {
  dispatch(userDeleteStart())
  const res = await fetch(`/api/user/delete/${currentUser._id}`, {
    method: 'DELETE',
    
  })
  const data = await res.json()
  if(data.success === false) {
    dispatch(userDeleteFailure(data.message))
    return;
  }
   dispatch(userDeleteSuccess(data))
} catch (error) {
  dispatch(userDeleteFailure(error))
}
}

const signOutHandler = async() => {
  try {
    dispatch(signoutStart())
    const res = await fetch('/api/auth/signout')
    const data = res.json()
    if(data.success === false){
    dispatch(signoutFailure(data.message))
    return;
    }
  dispatch(signoutSuccess())
  } catch (error) {
    dispatch(signoutFailure(error.message))
  }
}

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center pt-3">Profile</h1>
      <form onSubmit={submitUpdateHanler} className="flex flex-col gap-4 pt-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full w-24 h-24 object-cover self-center cursor-pointer"
          src={formData.ProfileImg || currentUser.ProfileImg}
          alt="Profilepic"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              image Uploade Error(image must be less then 2mb){" "}
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>{`uploading ${filePerc}% `}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          className="rounded-lg border p-3"
          type="text"
          placeholder="user name"
          id="userName"
          defaultValue={currentUser.userName}
          onChange={changeHandler}
        />
        <input
          className="rounded-lg border p-3"
          type="text"
          placeholder="email"
          id="Email"
          defaultValue={currentUser.Email}
          onChange={changeHandler}
        />
        <input
          className="rounded-lg border p-3"
          type="password"
          placeholder="password"
          id="Password"
          defaultValue={currentUser.Password}
          onChange={changeHandler}
        />
        <button disabled={loading} className="bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80">
         {loading ? 'loading': 'update'}
        </button>
        <Link to={'/create-listing'} className="bg-green-700 p-3 text-center uppercase rounded-lg hover:opacity-95 text-white">
        Create Listing
        </Link>
      </form>
      <div className="text-red-700 flex justify-between pt-5 ">
        <span onClick={deleteHandler} className="cursor-pointer">Delete Account</span>
        <span onClick={signOutHandler} className="cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'Profile updated successfully' : ''}</p>
    </div>
  );
}
