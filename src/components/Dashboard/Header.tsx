import groupProfiles from "../../assets/group_profiles.png";
import arrowIcon from "../../assets/arrow_icon.svg";
import headerImg from "../../assets/header_img.png";

function Header() {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20">
      {/* Left Side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:-mb-7">
        <p className=" text-white text-3xl md:text-4xl font-bold lg:text-5xl leading-tight md:leading-tight lg:leading-tight">
          Book Appointment <br /> With Trusted Doctors
        </p>
        <div className="flex flex-col md:flex-row items-start  gap-4 py-10  md:py-0 text-white font-light text-sm ">
          <img src={groupProfiles} alt="Group of Profiles" />
          <p className=" ">
            Simply browse through our extensive list of trusted doctors,
            <br className="hidden md:block" />
            schedule your appointment hassle-free.
          </p>
        </div>
        <a
          href="#speciality"
          className=" flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300 hover:bg-indigo-50 "
        >
          Book Appointment <img className="w-3" src={arrowIcon} alt="" />
        </a>
      </div>
      {/* Right Side */}
      <div className="md:w-1/2 flex items-end justify-center md:justify-end">
        <img
          src={headerImg}
          alt="Doctors"
          className="h-105 object-contain"
        />
      </div>
    </div>
  );
}

export default Header;
