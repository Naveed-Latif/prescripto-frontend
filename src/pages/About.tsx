
function About() {
  return (
    <div>
      <div className="text-center text-2xl pt-8 text-gray-500">
        <p>ABOUT <span className="text-gray-800 font-medium">US</span></p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 my-12">
        <img className="w-full md:max-w-90 " src="/src/assets/about_image.png" alt="" />
        <div className="flex flex-col gap-6 justify-center text-gray-600 text-sm md:w-1/2">
          <p>Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
          <p>Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.</p>
          <b className="text-gray-900 ">Our Vision</b>
          <p>Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>
      </div>

      <div className="text-xl my-4 text-gray-900">
        <p>WHY <span className="text-gray-600">CHOOSE US</span></p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px16 py-8 md:py-16 flex flex-col text-[15px] gap-5 cursor-pointer text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 border-gray-400">
          <b>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
            </div>
        <div className="border px-10 md:px16 py-8 md:py-16 flex flex-col text-[15px] gap-5 cursor-pointer text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 border-gray-400">
          <b>CONVENIENCE:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
            </div>
        <div className="border px-10 md:px16 py-8 md:py-16 flex flex-col text-[15px] gap-5 cursor-pointer text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 border-gray-400">
          <b>PERSONALIZATION:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
            </div>
      </div>

    </div>
  )
}

export default About
