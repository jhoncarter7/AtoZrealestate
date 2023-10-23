import {Link} from 'react-router-dom'

export default function SignUp() {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className='text-3xl text-center font-semibold '>
        Sign Up
      </h1>
      <form className="flex flex-col gap-3 max-w-lg py-7">
        <input className="border rounded-lg p-2 " type="text" placeholder="userName" id="userName"/>
        <input className="border rounded-lg p-2 " type="email" placeholder="email" id="email"/>
        <input className="border rounded-lg p-2 " type="password" placeholder="password" id="password"/>
        <button className="bg-slate-700 text-white p-4 rounded-lg uppercase hover:opacity-95 disabled:opacity-70">signup</button>
      </form>
      <div className="flex gap-2 py-2">
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
        <p className="text-blue-700 cursor-pointer">signIn</p>
        
        </Link>
      
      </div>
    </div>
  )
}
