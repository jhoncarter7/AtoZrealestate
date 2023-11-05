import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 10000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [imageUpload, setImageUpload] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchlist = async () => {
      const res = await fetch(`/api/listing/get/${params.listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchlist();
  }, [params.listingId]);
  const handleImageSubmit = () => {
    setImageUpload(true);
    setImageUploadError(false);
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setImageUpload(false);
        })
        .catch((err) => {
          console.log(err);
          setImageUploadError("Image Upload Failed (2 mb max size per image)");
          setImageUpload(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setImageUpload(false);
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
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const changehandler = (e) => {
    if (
      e.target.type === "text" ||
      e.target.type === "number" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
    if (e.target.id === "sale" || e.target.id == "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You have to upload at least 1 image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form
        onSubmit={submitHandler}
        className="flex flex-col sm:flex-row gap-6"
      >
        <div className="flex flex-col  gap-4 flex-1">
          <input
            className="p-2 rounded-lg"
            type="text"
            placeholder="Name"
            id="name"
            maxLength="60"
            minLength="10"
            required
            onChange={changehandler}
            value={formData.name}
          />
          <textarea
            className="p-2 rounded-lg"
            type="text"
            placeholder="Description"
            id="description"
            required
            onChange={changehandler}
            value={formData.description}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            placeholder="Address"
            id="address"
            required
            onChange={changehandler}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap my-8">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={changehandler}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={changehandler}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={changehandler}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={changehandler}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={changehandler}
                checked={formData.offer}
              />
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
                onChange={changehandler}
                value={formData.bedrooms}
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
                onChange={changehandler}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                size="12"
                min="10000"
                max="10000000000"
                required
                className="border p-3 border-gray-300 rounded-lg"
                onChange={changehandler}
                value={formData.regularPrice}
              />
              <p className="flex flex-col ">Regular Price</p>
              {formData.type === "rent" && (
                <span className="text-xs">{`(₹ / month)`}</span>
              )}
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  size="12"
                  min="0"
                  max="10000000000"
                  required
                  className="border p-3 border-gray-300 rounded-lg"
                  onChange={changehandler}
                  value={formData.discountPrice}
                />
                <p className="flex flex-col ">Discounted Price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">{`(₹ / month)`}</span>
                )}
              </div>
            )}
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
              {imageUpload ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div className="flex justify-between" key={url}>
                <img
                  src={url}
                  alt="images list"
                  className="w-20, h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImageHandle(index)}
                  className="text-red-700 uppercase py-0 hover:opacity-75 rounded-lg pr-3"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || imageUpload}
            className="p-3 bg-gray-700 text-center rounded-lg uppercase text-white hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "update listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
