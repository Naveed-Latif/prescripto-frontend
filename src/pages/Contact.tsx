import contactImg from "../assets/contact_image.png";
function Contact() {
  return (
    <div>
      <div className="text-center text-2xl pt-8 text-gray-500">
        <p>CONTACT <span className="text-gray-800 font-medium">US</span></p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-10  my-10 mb-28 ">
        <img className="w-full md:max-w-90 " src={contactImg} alt="" />
        <div className="text-gray-400 flex flex-col gap-8 justify-center items-start text-sm">
          <p className="text-gray-700 text-xl">OUR OFFICE</p>
          <p>
            00000 Willms Station
            <br />
            Suite 000, Washington, USA
          </p>
          <p>
            Tel: (000) 000-0000
            <br />
            Email: greatstackdev@gmail.com
          </p>
          <p className="text-gray-700 text-xl">CAREERS AT PRESCRIPTO</p>
          <p>Learn more about our teams and job openings.</p> 
          <button className="text-gray-900 border border-black px-8 py-4 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer">EXPLORE JOBS</button>
        </div>
      </div>
    </div>
  )
}

export default Contact
