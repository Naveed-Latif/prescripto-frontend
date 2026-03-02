import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

type FormValues = {
  fullName: string;
  email: string;
  gender: "male" | "female";
  password: string;
  confirmPassword: string;
};

export default function CreateAccount() {
  const navigate = useNavigate();
  const { backendurl, setToken, token } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (formdata: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", formdata.fullName);
      formData.append("email", formdata.email);
      formData.append("gender", formdata.gender);
      formData.append("password", formdata.password);
      formData.append("confirm_password", formdata.confirmPassword);

     const response = await axios.post(`${backendurl}/auth/signup`, formData);
     if(response.data.success){
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      toast.success("Account created successfully");
     }else{
      toast.error(response.data.message);
     }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // toast.error(error.message);
      }
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
        <h1 className="text-2xl font-medium text-[#5E5E5E] mb-1">
          Create Account
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Please sign up to book appointment
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Full Name */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="etc:-Jhon Wick"
              {...register("fullName", { required: "Full name is required" })}
              className={`w-full border rounded-md px-3 py-2.5 text-sm text-gray-700 bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-400 transition ${
                errors.fullName ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="anymail@example.com"
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
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* gender */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-2">Gender</label>

            <div className="flex gap-4">
              {["MALE", "FEMALE"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 border rounded-md px-4 py-2.5 text-sm text-gray-700 bg-gray-50 cursor-pointer hover:border-indigo-400 transition"
                >
                  <input
                    type="radio"
                    value={option}
                    {...register("gender", {
                      required: "Please select your gender",
                    })}
                    className="accent-indigo-500"
                  />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </div>

            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1.5">
              Password
            </label>
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
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* confirm password */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value, formValues) =>
                  value === formValues.password || "Passwords do not match",
              })}
              className={`w-full border rounded-md px-3 py-2.5 text-sm text-gray-700 bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-400 transition ${
                errors.confirmPassword ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md text-sm tracking-wide transition duration-200"
          >
            Create account
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
