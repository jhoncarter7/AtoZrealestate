import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Contact({listing}) {

  const [landloard, setLandloard] = useState(null)
  const [message, setMessage] = useState()
  console.log(listing.userRef)

  useEffect(()=>{
    const fetchuser = async () =>{
     try {
      const res = await fetch(`/api/user/${listing.userRef}`)
      const data = await res.json()
      setLandloard(data)
     } catch (error) {
      console.log(error)
     }
    }
    fetchuser();
  }, [listing.userRef])

  const onchange = (e)=> {
  setMessage(e.target.value)
  }
  return (
<> 
   {
    landloard && (
      <div className='flex flex-col gap-2'>
      <p>Contact <span className="font-semibold">{landloard.userName}{' '}</span> for{' '} <span className="font-semibold">{listing.name.toLowerCase()}</span></p>
      
      <textarea name="message" id="message"  rows="2" value={message} onChange={onchange} placeholder="Enter your message here...." className="w-full border p-3 rounded-lg"></textarea>
      
      
      <Link to={`mailto:${landloard.Email}?subject=Regarding ${listing.name}&body=${message}`} className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">
      Send Message
      </Link>
      </div>
    )
   }
   </>
  )

}
