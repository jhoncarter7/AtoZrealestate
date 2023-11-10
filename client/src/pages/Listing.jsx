import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listing, setListing] = useState(null);
  const params = useParams();
  const [copied, setCopied] = useState(false);
 const {currentUser} = useSelector((state)=> state.user)
 const [contact, setContact] = useState(false)

  useEffect(() => {
    const fetchlisting = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setError(false);
        setLoading(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchlisting();
  }, [params.listingId]);
  console.log(listing);
  return (
    <main>
      {loading && <p className="text-2xl text-center">Loading....</p>}
      {error && <p className="text-2xl text-center">there is no data</p>}
      {!loading && !error && listing && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[350px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "100% 100%",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border  rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare  className="text-slate-500"  onClick={()=> {
              navigator.clipboard.writeText(window.location.href);    
              setCopied(true)            
              setTimeout(()=>{
                setCopied(false)
              }, 2000);
            }}/>
          </div>
          {copied && <p className="fixed z-10 top-[23%] right-[5%] rounded-md bg-slate-100 p-2">
            Link Copied!
          </p>}
          <div>
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p>
              {listing.name} - ₹{" "}
              {listing.offer ? listing.discountPrice.toLocaleString('en-IN') : listing.regularPrice.toLocaleString('en-IN')}
              {listing.type === 'rent' && ' / month'}

            </p>
            <p className="flex items-center gap-2 mt-6 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700"/>
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900  w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === 'rent' ? 'for Rent': 'for Sale'}
              </p>
              {
                listing.offer && (
                  <p className="bg-green-900 w-full max-w-[200px] rounded-md text-center p-1 text-white">
                    ₹ {+listing.regularPrice - +listing.discountPrice} Discount
                  </p>
                )
              }
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="flex gap-4 sm:gap-6 items-center text-green-900 font-semibold text-sm flex-wrap">
              <li className="flex items-center gap-1 sm:gap-3 whitespace-nowrap">
                <FaBed className="text-lg"/>
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds`: `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 sm:gap-3 whitespace-nowrap">
                <FaBath className="text-lg"/>
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths`: `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 sm:gap-3 whitespace-nowrap">
                <FaParking className="text-lg"/>
                {listing.parking > 1 ? 'Parking Spot': 'No Parking'}
              </li>
              <li className="flex items-center gap-1 sm:gap-3 whitespace-nowrap">
                <FaChair className="text-lg"/>
                {listing.furnished > 1 ? 'Furnished': 'Unfurnished'}
              </li>
            </ul>
            { currentUser && listing.userRef !== currentUser._id && !contact && (
              <button onClick={()=> setContact(true)} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3">Contact landloard</button>
            )
            }
            {contact && <Contact listing={listing}/>}
          </div>
          </div>
        </div>
      )}
    </main>
  );
}
