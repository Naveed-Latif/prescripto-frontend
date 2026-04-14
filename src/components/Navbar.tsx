import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
function Navbar() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const navigate = useNavigate();
  const {token,setToken,userData} = useContext(AppContext);

  const logOut = () => {
    setToken('');
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-300">
      <img
        onClick={() => {
          navigate("/");
          scrollTo(0, 0);
        }}
        className="w-44 cursor-pointer"
        src="/src/assets/logo.svg"
        alt="Logo"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/4 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/4 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/4 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/4 m-auto hidden" />
        </NavLink>
        <a target="_blank" className="border border-gray-300 px-5 text-xs py-1.5 rounded-full" href="https://prescripto-admin-xi.vercel.app/">Admin Panel</a>
      </ul>

      <div className="flex items-center gap-4">
        {token && token.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 group relative cursor-pointer">
              <img
                className="w-8 rounded-full"
                src={userData?.profileImage || "/src/assets/profile_pic.png"}
                alt="User Icon"
              />
              <img
                className="w-2.5 "
                src="/src/assets/dropdown_icon.svg"
                alt="Dropdown Icon"
              />
              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                  <p
                    onClick={() => navigate("/myprofile")}
                    className="hover:text-black cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/myappointments")}
                    className="hover:text-black cursor-pointer"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={logOut}
                    className="hover:text-black cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/createaccount")}
            className="bg-primary text-white px-8 py-3 cursor-pointer border-l rounded-full font-light hidden md:block"
          >
            create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src="/src/assets/menu_icon.svg"
          alt=""
        />
        {/* --------mobile menu --------- */}
        <div className={` ${showMenu? 'w-full fixed' :'h-0 w-0 '} md:hidden right-0 top-0  bottom-0 z-20 overflow-hidden text-black bg-white transition-all`}>
          <div className="flex justify-between items-center py-6 px-8">
            <img className="w-36" src="/src/assets/logo.svg" alt="" />
            <img className="w-7" onClick={()=>setShowMenu(false)} src="/src/assets/cross_icon.png" alt="" />
          </div>
          <ul className="flex flex-col gap-6 mt-5 px-5 text-lg font-medium items-center">
            <NavLink className='px-4 py-2 rounded inline-block' onClick={()=>setShowMenu(false)} to="/"><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
            <NavLink className='px-4 py-2 rounded inline-block' onClick={()=>setShowMenu(false)} to="/doctors"><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink className='px-4 py-2 rounded inline-block' onClick={()=>setShowMenu(false)} to="/about"><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
            <NavLink className='px-4 py-2 rounded inline-block' onClick={()=>setShowMenu(false)} to="/contact"><p className='px-4 py-2 rounded inline-block'>CONTACT US</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
