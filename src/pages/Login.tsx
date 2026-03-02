import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
 import {  toast } from 'react-toastify';
 


type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
      const navigate = useNavigate()
      const { token,setToken, backendurl } = useContext(AppContext)
      

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post(`${backendurl}/auth/login`, {
        email: data.email,
        password: data.password,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        console.log(response.data);
        toast.success("Login successful");
      } else {
        toast.error("Invalid credentials")
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
      } else {
        console.error("Login error:", String(error));
      }
      toast.error("Something went wrong. Please try again.");
    }
  };
  useEffect(()=>{
    if(token && token.length > 0){
      navigate("/");
    }
  },[token])

   return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white ">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-97">
        
        {/* Heading */}
        <h1 className="text-2xl font-medium text-[#5E5E5E] mb-1">Login</h1>
        <p className="text-sm text-gray-400 mb-6">Please log in to book appointment</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>


          {/* Email */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              className={`w-full border rounded-md px-3 py-2.5 text-sm text-gray-700 bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-400 transition ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1.5">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className={`w-full border rounded-md px-3 py-2.5 text-sm text-gray-700 bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-400 transition ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md text-sm tracking-wide transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-gray-400 mt-5">
          Create an new account?{" "}
          <a onClick={()=>{navigate('/createaccount')}}  className="text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer">
           Create Account
          </a>
        </p>
      </div>
    </div>
  );
}