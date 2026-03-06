import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import BookingCalendar from "../components/BookingCalendar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuditoriumBooking() {

  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(saved);
  }, []);

  const updateStatus = (index: number, status: string) => {

  const updated = [...bookings];
  updated[index].status = status;

  setBookings(updated);
  localStorage.setItem("bookings", JSON.stringify(updated));

  if (status === "Approved") {
    toast.success("Reservation approved!");
  }

  if (status === "Rejected") {
    toast.error("Reservation rejected!");
  }
};

  const deleteBooking = (index: number) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this booking?"
  );

  if (!confirmDelete) return;

  const updated = [...bookings];

  updated.splice(index, 1);

  setBookings(updated);

  localStorage.setItem("bookings", JSON.stringify(updated));
  
  toast.success("Booking deleted successfully!");
};

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Auditorium Booking
      </h1>

      <button
        type="button"
        onClick={() => navigate("/new-booking")}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + New Reservation
      </button>


      <div className="bg-white p-6 rounded-lg shadow mt-4">
        <h2 className="text-xl font-semibold mb-4">
          Booking Calendar
        </h2>

        <BookingCalendar bookings={bookings} />
      </div>



      <div className="bg-white p-6 rounded-lg shadow mt-6">

        <h2 className="text-xl font-semibold mb-4">
          Booking Requests
        </h2>

        <table className="w-full border">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Requester</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Time</th>
              <th className="p-3 border">Participants</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>

            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No bookings yet
                </td>
              </tr>
            ) : (

              bookings.map((b, index) => (

                <tr key={index}>

                  <td className="p-3 border">{b.name}</td>
                  <td className="p-3 border">{b.date}</td>
                  <td className="p-3 border">{b.start} - {b.end}</td>
                  <td className="p-3 border">{b.participants}</td>

                  <td className="p-3 border">{b.status}</td>

                  <td className="p-3 border space-x-2">

  {/* Approve / Reject only if Pending */}
  {b.status === "Pending" && (
    <>
      <button
        onClick={() => updateStatus(index, "Approved")}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Approve
      </button>

      <button
        onClick={() => updateStatus(index, "Rejected")}
        className="bg-red-600 text-white px-3 py-1 rounded"
      >
        Reject
      </button>
    </>
  )}

  {/* Edit Button */}
  <button
  onClick={() => navigate(`/edit-booking/${index}`)}
  className="bg-blue-600 text-white px-3 py-1 rounded"
>
  Edit
</button>

  {/* Delete Button */}
  <button
    onClick={() => deleteBooking(index)}
    className="bg-gray-700 text-white px-3 py-1 rounded"
  >
    Delete
  </button>

</td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}