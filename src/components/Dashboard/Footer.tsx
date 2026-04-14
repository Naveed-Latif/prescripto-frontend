import logo from "../../assets/logo.svg";

function Footer() {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* -----------Left Section------------ */}
        <div>
          <img className="w-40 mb-5" src={logo} alt="Logo" />
          <p className="text-gray-500 text-sm w-full md:w-2/3 leading-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
        {/* -----------Middle Section------------ */}
        <div>
          <p className="text-xl font-medium mb-3">COMPANY</p>
          <ul className="flex flex-col gap-4 text-sm text-gray-500">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About us</a></li>
          </ul>
        </div>
        {/* -----------Right Section------------ */}
        <div>
          <p className="text-xl font-medium mb-3">GET IN TOUCH</p>
          <ul className="flex flex-col gap-4 text-sm text-gray-500">
            <li>+0-000-000-000</li>
            <li>example@gmail.com</li>
          </ul>
        </div>
      </div>
      <div >
        <hr />
        <p className="text-center text-sm text-gray-500 mt-3">Copyright 2024 @Riemann-Systems-Pvt-Ltd. - All Right Reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
