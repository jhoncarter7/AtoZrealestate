import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading, error} = useSelector((state)=> state.user)
  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold ">Sign In</h1>
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-3 max-w-lg py-7"
      >
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
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-4 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
        >
          {loading ? "Loading..." : "sign-in"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 py-2">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <p className="text-blue-700 cursor-pointer">signUp</p>
        </Link>
      </div>
      {error && <p className="text-red-600 mt-5">{error}</p>}
    </div>
  );
}
