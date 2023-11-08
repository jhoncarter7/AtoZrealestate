import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-6 ">
            <div className="flex gap-2 items-center">
                <label className=' whitespace-nowrap font-semibold'>Search Term: </label>
                <input type="text" id='searchTerm' className='p-2 rounded-lg border  w-full' placeholder='Search...' />
            </div>
            <div className="flex gap-3 flex-wrap items-center">
                <label className='font-semibold'>Type: </label>
              <div className="flex gap-2">
                <input type="checkbox" id='all' className='w-5'/>
                <span> Rent & Sale</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='rent' className='w-5'/>
                <span> Rent</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='sale' className='w-5'/>
                <span> Sale</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='offer' className='w-5'/>
                <span> Offer </span>
              </div>
            </div>
            <div className='flex gap-3 items-center'>
              <label className='font-semibold'> Amenities: </label>
              <div className="flex gap-2 ">
                <input type="checkbox" name="" id="parking" className='w-5'/>
                <span>Parking</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" name="" id="furnished" className='w-5'/>
                <span>Furnished</span>
              </div>
            </div>
            <div className="flex gap-3 items-center">
             <label className='font-semibold'> Sort: </label>
             <select id="sort_order" className='border rounded-lg p-2'>
              <option> Price high to low</option>
              <option> Price low to high</option>
              <option> Latest</option>
              <option> Oldest</option>
             </select>
            </div>
            <button className='bg-slate-700 rounded-lg p-3 border uppercase text-white hover:opacity-90'>Search</button>
        </form>
        </div>
        <div className="">
          <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        </div>
    </div>
  )
}
