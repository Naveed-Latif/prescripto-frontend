export default function Camo() {
  return (
    <section className="w-full flex justify-center px-4 mt-3.5">
      <div
        className="
          w-full max-w-7xl
          bg-[#5F6FFF]
          rounded-2xl
          overflow-hidden
          flex flex-col md:flex-row
          min-h-130
        "
      >
        {/* LEFT CONTENT */}
        <div
          className="
            flex-1
            flex flex-col justify-center
            px-6 md:px-16
            pt-12 md:pt-0
            text-white
            text-center md:text-left
          "
        >
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-lg">
            Book Appointment <br />
            With Trusted Doctors
          </h1>

          <div className="mt-6 flex items-center justify-center md:justify-start gap-4 max-w-md">
            <div className="flex -space-x-3">
              <img src="/a1.png" className="w-9 h-9 rounded-full border-2 border-white" />
              <img src="/a2.png" className="w-9 h-9 rounded-full border-2 border-white" />
              <img src="/a3.png" className="w-9 h-9 rounded-full border-2 border-white" />
            </div>

            <p className="text-sm text-indigo-100 leading-snug">
              Simply browse through our extensive list of trusted doctors,
              schedule your appointment hassle-free.
            </p>
          </div>

          <button
            className="
              mt-8
              bg-white text-[#5F6FFF]
              px-8 py-3
              rounded-full
              font-medium
              w-fit
              mx-auto md:mx-0
              hover:bg-indigo-50
              transition
            "
          >
            Book appointment →
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 flex items-end justify-center md:justify-end">
          <img
            src="/src/assets/header_img.png"
            alt="Doctors"
            className="h-104 object-contain"
          />
        </div>
      </div>
    </section>
  );
}
