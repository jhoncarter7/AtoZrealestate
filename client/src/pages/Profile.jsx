import {useSelector} from 'react-redux'
export default function Profile() {
  const {currentUser} = useSelector((state)=> state.user)
  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className="text-3xl font-semibold text-center pt-3">Profile</h1>
      <form className='flex flex-col gap-4 pt-4'>
      <img className='rounded-full w-24 h-24 object-cover self-center cursor-pointer' src={currentUser.ProfileImg} alt='Profilepic'/>
      <input className='rounded-lg border p-3' type="text" placeholder='user name' id='userName'/>
      <input className='rounded-lg border p-3' type="text" placeholder='email' id='Email'/>
      <input className='rounded-lg border p-3' type="text" placeholder='password' id='Password'/>
      <button className='bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>update</button>
      </form>
      <div className='text-red-700 flex justify-between pt-5 '>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
