import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    toast.error("Please fill all required fields");
    return;
  }

  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(form.contact)) {
    toast.error("Contact number must contain exactly 10 digits");
    return;
  }

  if (Number(form.participants) <= 0) {
    toast.error("Participants must be greater than 0");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  if (form.date < today) {
    toast.error("Cannot book a past date");
    return;
  }

  if (form.start >= form.end) {
    toast.error("End time must be after start time");
    return;
  }

  const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

  const conflict = existingBookings.find((b: any) =>
    b.date === form.date &&
    (
      (form.start >= b.start && form.start < b.end) ||
      (form.end > b.start && form.end <= b.end) ||
      (form.start <= b.start && form.end >= b.end)
    )
  );

  if (conflict) {
    toast.error("This time slot is already booked!");
    return;
  }

  const newBooking = {
    ...form,
    status: "Pending"
  };

  existingBookings.push(newBooking);

  localStorage.setItem("bookings", JSON.stringify(existingBookings));

  toast.success("Reservation created successfully!");

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

  <div>
    <label className="block text-sm font-medium mb-1">Requester Name</label>
    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      className="border p-3 rounded w-full"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Contact Number</label>
    <input
      name="contact"
      value={form.contact}
      onChange={handleChange}
      className="border p-3 rounded w-full"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Date</label>
    <input
      type="date"
      name="date"
      value={form.date}
      onChange={handleChange}
      className="border p-3 rounded w-full"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Participants</label>
    <input
      type="number"
      name="participants"
      value={form.participants}
      onChange={handleChange}
      className="border p-3 rounded w-full"
      min="1"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Start Time</label>
    <input
      type="time"
      name="start"
      value={form.start}
      onChange={handleChange}
      className="border p-3 rounded w-full"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">End Time</label>
    <input
      type="time"
      name="end"
      value={form.end}
      onChange={handleChange}
      className="border p-3 rounded w-full"
      required
    />
  </div>

</div>

<div className="mt-4">
  <label className="block text-sm font-medium mb-1">Event Description</label>
  <textarea
    name="description"
    value={form.description}
    onChange={handleChange}
    className="border p-3 rounded w-full"
    required
  />
</div>

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded mt-4"
        >
          Submit Booking
        </button>

      </form>

    </DashboardLayout>
  );
}