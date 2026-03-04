import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function NewBooking() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    date: "",
    start: "",
    end: "",
    participants: "",
    description: ""
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!form.name || !form.contact || !form.date || !form.start || !form.end) {
      alert("Please fill all required fields");
      return;
    }

    if (form.start >= form.end) {
      alert("End time must be after start time");
      return;
    }

    const newBooking = {
      ...form,
      status: "Pending"
    };

    // Get existing bookings
    const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    // Add new booking
    existingBookings.push(newBooking);

    // Save back to localStorage
    localStorage.setItem("bookings", JSON.stringify(existingBookings));

    // Go back to main booking page
    navigate("/auditorium-booking");
  };

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        New Auditorium Reservation
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow"
      >

        <div className="grid grid-cols-2 gap-4">

          <input
            name="name"
            placeholder="Requester Name"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            name="contact"
            placeholder="Contact Number"
            value={form.contact}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            type="number"
            name="participants"
            placeholder="Participants"
            value={form.participants}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            type="time"
            name="start"
            value={form.start}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            type="time"
            name="end"
            value={form.end}
            onChange={handleChange}
            className="border p-3 rounded"
          />

        </div>

        <textarea
          name="description"
          placeholder="Event Description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded w-full mt-4"
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded mt-4"
        >
          Submit Booking
        </button>

      </form>

    </DashboardLayout>
  );
}