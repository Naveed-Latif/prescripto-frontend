import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Banner() {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  return (
    <div>
      <div className="flex bg-primary rounded-lg px-10 md:px-14 lg:px-10 my-20 md:mx-10">
        {/* Left Side */}
        <div className="flex-1 py-10  md:py-16 lg:py-24">
          <div className=" text-white text-2xl md:text-3xl font-semibold lg:text-5xl ">
            <p className="">Book Appointment </p>
            <p className="mt-4">With 100+ Trusted Doctors</p>
          </div>

          <button
            onClick={() => {
              if (token) {
                navigate("/doctors");
              } else {
                navigate("/createaccount");
              }
              scrollTo(0, 0);
            }}
            className=" bg-white px-8 py-3 mt-3 rounded-full text-[#595959] text-sm hover:scale-105 transition-all duration-300 hover:bg-indigo-50 "
          >
            {token ? "Book Appointment" : "Create Account"}
          </button>
        </div>
        {/* Right Side */}
        <div className="hidden md:block md:w-1/2 lg:w-92.5 relative">
          <img
            src="/src/assets/appointment_img.png"
            alt="Doctors"
            className="w-full max-w-md absolute bottom-0 right-0"
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;
