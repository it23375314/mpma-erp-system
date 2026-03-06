import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBooking() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    date: "",
    start: "",
    end: "",
    participants: "",
    description: ""
  });

  useEffect(() => {

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    const booking = bookings[id as any];

    if (booking) {
      setForm(booking);
    }

  }, [id]);

  const handleChange = (e:any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e:any) => {

    e.preventDefault();

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    bookings[id as any] = {
      ...form,
      status: bookings[id as any].status
    };

    localStorage.setItem("bookings", JSON.stringify(bookings));

    navigate("/auditorium-booking");
  };

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Edit Reservation
      </h1>

      <form
  onSubmit={handleSubmit}
  className="bg-white p-6 rounded-lg shadow"
>

<div className="grid grid-cols-2 gap-4">

  <div>
    <label className="block text-sm font-medium mb-1">
      Requester Name <span className="text-red-500">*</span>
    </label>
    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      className="border p-3 rounded w-full"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Contact Number <span className="text-red-500">*</span>
    </label>
    <input
      name="contact"
      value={form.contact}
      onChange={handleChange}
      className="border p-3 rounded w-full"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Date <span className="text-red-500">*</span>
    </label>
    <input
      type="date"
      name="date"
      value={form.date}
      onChange={handleChange}
      className="border p-3 rounded w-full"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Participants
    </label>
    <input
      type="number"
      name="participants"
      value={form.participants}
      onChange={handleChange}
      className="border p-3 rounded w-full"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Start Time <span className="text-red-500">*</span>
    </label>
    <input
      type="time"
      name="start"
      value={form.start}
      onChange={handleChange}
      className="border p-3 rounded w-full"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      End Time <span className="text-red-500">*</span>
    </label>
    <input
      type="time"
      name="end"
      value={form.end}
      onChange={handleChange}
      className="border p-3 rounded w-full"
    />
  </div>

</div>

<div className="mt-4">
  <label className="block text-sm font-medium mb-1">
    Event Description
  </label>
  <textarea
    name="description"
    value={form.description}
    onChange={handleChange}
    className="border p-3 rounded w-full"
  />
</div>

<button
  className="bg-blue-600 text-white px-6 py-3 rounded mt-4"
>
  Update Booking
</button>

</form>

    </DashboardLayout>

  );
}