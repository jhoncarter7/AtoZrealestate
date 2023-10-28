import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(file);
  console.log(fileUploadError);
  console.log(formData);

  console.log(filePerc);

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
      },
      () => {
        // console.log('getDownloadURL'),
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
          setFormData({ ...formData, profileImg: downloadURL })
      );
      }
    );
  };
  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center pt-3">Profile</h1>
      <form className="flex flex-col gap-4 pt-4">
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
          src={currentUser.ProfileImg}
          alt="Profilepic"
        />
        { fileUploadError ? (<span className="text-red-700">image Uploade Error </span>): (filePerc > 0 && filePerc < 100) ? (<span>{`uploading ${filePerc}% `}</span>) : filePerc === 100 ? (<span className="text-green-700">Image successfully uploaded</span>) : ("") }
       
        <input
          className="rounded-lg border p-3"
          type="text"
          placeholder="user name"
          id="userName"
        />
        <input
          className="rounded-lg border p-3"
          type="text"
          placeholder="email"
          id="Email"
        />
        <input
          className="rounded-lg border p-3"
          type="text"
          placeholder="password"
          id="Password"
        />
        <button className="bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="text-red-700 flex justify-between pt-5 ">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
