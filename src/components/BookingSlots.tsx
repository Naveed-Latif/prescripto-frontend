import {  useMemo, useState } from "react";
// Booking Code 2


type SlotDay = {
  day: string;
  dateNumber: number;
  fullDate: Date;
};

export default function BookingSlots() {
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // 🔹 Generate next 6 days
  const days: SlotDay[] = useMemo(() => {
    const arr: SlotDay[] = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      arr.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        dateNumber: date.getDate(),
        fullDate: new Date(date),
      });
    }

    return arr;
  }, []);

  // 🔹 Generate time slots dynamically (10 AM – 5 PM, 30 mins)
  const generateTimes = () => {
    const times: string[] = [];
    for (let hour = 10; hour < 17; hour++) {
      times.push(formatTime(hour, 0));
      times.push(formatTime(hour, 30));
    }
    return times;
  };

  const times = generateTimes();

  const selectedDay = days[selectedDateIndex];

  // 🔹 Format time to AM/PM
  function formatTime(hour: number, minute: number) {
    const period = hour >= 12 ? "pm" : "am";
    const adjustedHour = hour > 12 ? hour - 12 : hour;
    return `${adjustedHour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${period}`;
  }

  // 🔹 Check if selected date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 🔹 Disable past time slots (only for today)
  const isPastTime = (time: string, date: Date) => {
    if (!isToday(date)) return false;

    const now = new Date();

    const [timePart, modifier] = time.split(" ");
    const [rawHours, minutes] = timePart.split(":").map(Number);
    let hours = rawHours;

    if (modifier === "pm" && hours !== 12) hours += 12;
    if (modifier === "am" && hours === 12) hours = 0;

    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);

    return slotDate <= now;
  };

  // 🔹 Reset time when date changes
  
  const handleBooking = () => {
    if (!selectedTime) return;

    alert(
      `Booked on ${selectedDay.day} ${selectedDay.dateNumber} at ${selectedTime}`,
    );
  };

  return (
    <div className="bg-gray-100 p-6 rounded-xl">
      <h2 className="text-lg font-semibold mb-5">Booking slots</h2>

      {/* Date Selector */}
      <div className="flex gap-4 overflow-x-auto pb-5">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedDateIndex(index);
              setSelectedTime(null);
            }}
            className={`min-w-20 h-20 rounded-full flex flex-col items-center justify-center border transition
              ${
                selectedDateIndex === index
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
              }`}
          >
            <span className="text-sm font-medium">{day.day}</span>
            <span className="text-lg font-semibold">{day.dateNumber}</span>
          </button>
        ))}
      </div>

      {/* Time Slots */}
      <div className="flex flex-wrap gap-3 mb-6">
        {times.map((time) => {
          const disabled = isPastTime(time, selectedDay.fullDate);

          return (
            <button
              key={time}
              disabled={disabled}
              onClick={() => !disabled && setSelectedTime(time)}
              className={`px-4 py-2 rounded-full border text-sm transition
                ${
                  selectedTime === time
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : disabled
                      ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                }`}
            >
              {time}
            </button>
          );
        })}
      </div>

      {/* Book Button */}
      <button
        disabled={!selectedTime}
        onClick={handleBooking}
        className={`px-8 py-3 rounded-full font-medium transition
          ${
            selectedTime
              ? "bg-indigo-500 hover:bg-indigo-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        Book an appointment
      </button>
    </div>
  );
}
