import { Routes,Route } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import Appointment from "../pages/Appointment"
import Contact from "../pages/Contact"
import Doctors from "../pages/Doctors"
import Login from "../pages/Login"
import MyProfile from "../pages/MyProfile"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import CreateAccount from "../pages/CreateAccount"
import MyAppointments from "../pages/MyAppointments"

function AppLayout() {
  return (
    <div className="mx-2 sm:mx-[10%]">
        <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/appointment/:id" element={<Appointment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/myappointments" element={<MyAppointments />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default AppLayout
