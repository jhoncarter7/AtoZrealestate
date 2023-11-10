import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Swiper, SwiperSlide} from 'swiper/react'
import {Navigation} from 'swiper/modules'
import SwiperCore from 'swiper'
import 'swiper/css/bundle'
import ListingItem from "../components/ListingItem";


export default function Home() {
const [listingOffer, setListingOffer] = useState()
const [listingSale, setListingSale] = useState()
const [listingRent, setListingRent] = useState()
const [loading, setLoading] = useState(false)
SwiperCore.use([Navigation])
  useEffect(()=>{
   const fetchListingOffer = async ()=>{
    setLoading(true)
  const res = await fetch('/api/listing/get?offer=true&limit=4')
  const data = await res.json()
  setListingOffer(data)
  fetchListingRent()
  fetchListingSale()
   }
   const fetchListingRent =  async()=>{
   const res = await fetch('/api/listing/get?type=rent&limit=4')
   const data = await res.json()
   setListingRent(data)
   }
   const fetchListingSale =  async()=>{
   const res = await fetch('/api/listing/get?type=sale&limit=4')
   const data = await res.json()
   setListingSale(data)
   setLoading(false)
   }
   fetchListingOffer()
  },[])
  return (
    <div>
      <div className="flex flex-col gap-4 p-28 px-3 mx-auto max-w-6xl">
        <h1 className="font-bold text-3xl lg:text-6xl text-slate-700">
          Find your next <span className="text-slate-500 ">perfect</span> <br />{" "}
          place with ease.
        </h1>
        <div className="text-xs sm:text-sm text-slate-600">
          RealEstate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to="/search"
          className="text-yellow-600 text-xs sm:text-sm font-semibold hover:underline"
        >
          Let&apos;s get started...{" "}
        </Link>
      </div>

      {/* for listing offer banner */}
       <Swiper navigation>
        {listingOffer && listingOffer.length > 0 && listingOffer.map((offer)=>(
         <SwiperSlide key={offer._id}>
          <div style={{background:`url(${offer.imageUrls[0]}) center no-repeat`, backgroundSize:'cover'}} className="h-[500px]" >
          </div>
         </SwiperSlide>
        ))}
       </Swiper>
      {/* for listing categaries */}
      <div className="max-w-6xl  mx-auto p-3 flex flex-col gap-8 my-10">
        {listingOffer && listingOffer.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700">Recent Offer</h2>
              <Link to={'/search?offer=true'} className="text-blue-700 hover:underline text-sm">Show more offer</Link>
            </div>
            <div className="flex  flex-wrap gap-4">
           { listingOffer.map((offer)=> (
            <ListingItem key={offer._id} listing={offer}/>
            ))}
            </div>
          </div>
        )}


        {listingRent && listingRent.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700">Recent place for Rent</h2>
              <Link to={'/search?rent=true'} className="text-blue-700 hover:underline text-sm">Show more place for Rent</Link>
            </div>
            <div className="flex  flex-wrap gap-4">
           { listingRent.map((rent)=> (
            <ListingItem key={rent._id} listing={rent}/>
            ))}
            </div>
          </div>
        )}

        {listingSale && listingSale.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700">Recent place for Sale</h2>
              <Link to={'/search?sale=true'} className="text-blue-700 hover:underline text-sm">Show more Sale</Link>
            </div>
            <div className="flex  flex-wrap gap-4">
           { listingSale.map((sale)=> (
            <ListingItem key={sale._id} listing={sale}/>
            ))}
            </div>
          </div>
        )}
        {
          loading && (
            <p className="text-center text-2xl">Loading.....</p>
          )
        }
      </div>
    </div>
  );
}
