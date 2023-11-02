import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [imageUpload, setImageUpload] = useState(false);

  console.log("formData", formData);
  const handleImageSubmit = () => {
    setImageUpload(true)
    setImageUploadError(false)
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
     
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false)
        setImageUpload(false)
      }).catch((err)=>{
        console.log(err)
        setImageUploadError('Image Upload Failed (2 mb max size per image)');
        setImageUpload(false)
      })
    }else{
      setImageUploadError('You can only upload 6 images per listing')
      setImageUpload(false)
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`uploaded ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
   const removeImageHandle = (index) => {
     setFormData(
     { ...formData,
     imageUrls: formData.imageUrls.filter((_, i)=> 
      i !== index
     )
    }
    )
   }
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col  gap-4 flex-1">
          <input
            className="p-2 rounded-lg"
            type="text"
            placeholder="Name"
            id="name"
            maxLength="60"
            minLength="10"
            required
          />
          <textarea
            className="p-2 rounded-lg"
            type="text"
            placeholder="Description"
            id="description"
            required
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            placeholder="Address"
            id="address"
            required
          />

          <div className="flex gap-6 flex-wrap my-8">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 ">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                size="4"
                required
                className="border p-3 border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                size="4"
                required
                className="border p-3 border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                size="12"
                required
                className="border p-3 border-gray-300 rounded-lg"
              />
              <p className="flex flex-col ">
                Regular Price <span>{`(₹ / month)`}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                size="12"
                required
                className="border p-3 border-gray-300 rounded-lg"
              />
              <p className="flex flex-col ">
                Discounted Price <span>{`(₹ / month)`}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-500">
              The first image will be Cover (max 6)
            </span>
          </p>
          <div className=" flex gap-2">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="border p-3 rounded-w-full border-gray-300"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
            type="button"
              onClick={handleImageSubmit}
              className="text-green-700 uppercase border rounded-lg p-3 border-green-800 hover:shadow-lg disabled:opacity-80"
            >
              {imageUpload? "uploading...": "upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index)=>(
                <div className="flex justify-between" key={url}>
                <img src={url} alt="images list" className="w-20, h-20 object-contain rounded-lg"/>
                 <button   type="button" onClick={()=> removeImageHandle(index)} className="text-red-700 uppercase py-0 hover:opacity-75 rounded-lg pr-3">Delete</button>
              </div>
              )
            )
          }
          <button className="p-3 bg-gray-700 text-center rounded-lg uppercase text-white hover:opacity-95 disabled:opacity-80">
            create listing
          </button>
        </div>
      </form>
    </main>
  );
}
