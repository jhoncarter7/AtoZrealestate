import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
     
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
 
      if (data.message === false) {
        setError(data.message);
        return;
      }
      setLoading(false);
      navigate('/sign-in')
    } catch (error) {
      setLoading(false);
      setError(error.message);
     
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold ">Sign Up</h1>
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-3 max-w-lg py-7"
      >
        <input
          className="border rounded-lg p-2 "
          type="text"
          placeholder="userName"
          id="userName"
          onChange={changeHandler}
        />
        <input
          className="border rounded-lg p-2 "
          type="email"
          placeholder="email"
          id="Email"
          onChange={changeHandler}
        />
        <input
          className="border rounded-lg p-2 "
          type="password"
          placeholder="password"
          id="Password"
          onChange={changeHandler}
        />
        <button disabled={loading} className="bg-slate-700 text-white p-4 rounded-lg uppercase hover:opacity-95 disabled:opacity-70">
          {loading ? "Loading...": 'signup'}
        </button>
      </form>
      <div className="flex gap-2 py-2">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <p className="text-blue-700 cursor-pointer">signIn</p>
        </Link>
      </div>
      {error && <p className="text-red-600 mt-5">{error}</p>}
    </div>
  );
}
