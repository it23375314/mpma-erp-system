import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import BookingCalendar from "../components/BookingCalendar";
import { toast } from "react-toastify";
import { 
  Plus, 
  CheckCircle, 
  XOctagon, 
  Trash2, 
  Edit3, 
  BookOpen,
  Calendar,
  Clock,
  Users
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function ClassroomBooking() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const userRole = localStorage.getItem("userRole") || "user";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("classroom-bookings") || "[]");
    setBookings(saved);
  }, []);

  const updateStatus = (index: number, status: string) => {
    const updated = [...bookings];
    updated[index].status = status;
    setBookings(updated);
    localStorage.setItem("classroom-bookings", JSON.stringify(updated));
    if (status === "Approved") toast.success("Reservation approved!");
    if (status === "Rejected") toast.error("Reservation rejected!");
  };

  const deleteBooking = (index: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;
    const updated = [...bookings];
    updated.splice(index, 1);
    setBookings(updated);
    localStorage.setItem("classroom-bookings", JSON.stringify(updated));
    toast.success("Booking deleted successfully!");
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "Approved":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Approved</span>;
      case "Rejected":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>Pending</span>;
    }
  };

  return (
    <DashboardLayout>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 justify-center rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Classroom Bookings
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            Manage and monitor reservations for lecture halls and classrooms.
          </p>
        </div>
        <button
          onClick={() => navigate("/new-booking?type=classroom")}
          className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Reservation
        </button>
      </div>

      {/* Calendar Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-500" />
          Availability Schedule
        </h2>
        <div className="rounded-xl overflow-hidden border border-slate-200/60 bg-slate-50/50 p-2">
          <BookingCalendar bookings={bookings} />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Recent Requests</h2>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Total: {bookings.length}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-4 pl-6 whitespace-nowrap">Requester</th>
                <th className="p-4 whitespace-nowrap">Schedule</th>
                <th className="p-4 whitespace-nowrap">Participants</th>
                <th className="p-4 whitespace-nowrap text-center">Status</th>
                <th className="p-4 pr-6 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <BookOpen className="w-12 h-12 text-emerald-200 mb-3" />
                      <p className="font-medium text-slate-600">No bookings found</p>
                      <p className="text-sm mt-1">There are currently no reservations for classrooms.</p>
                      <button 
                        onClick={() => navigate("/new-booking?type=classroom")}
                        className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-100"
                      >
                        Create the first one
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((b, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="p-4 pl-6 align-middle">
                      <div className="font-semibold text-slate-800">{b.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">ID: #CLS-{1000 + index}</div>
                    </td>
                    
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-medium whitespace-nowrap">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {b.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 whitespace-nowrap">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {b.start} - {b.end}
                      </div>
                    </td>

                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <Users className="w-4 h-4 text-slate-400" />
                        {b.participants} pax
                      </div>
                    </td>

                    <td className="p-4 align-middle text-center">
                      <StatusBadge status={b.status} />
                    </td>

                    <td className="p-4 pr-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {userRole === "admin" && b.status === "Pending" && (
                          <div className="flex bg-slate-100 rounded-lg p-1 mr-2 border border-slate-200">
                            <button title="Approve" onClick={() => updateStatus(index, "Approved")} className="p-1.5 text-emerald-600 hover:bg-white rounded-md transition-colors"><CheckCircle className="w-4 h-4" /></button>
                            <div className="w-px bg-slate-200 mx-0.5"></div>
                            <button title="Reject" onClick={() => updateStatus(index, "Rejected")} className="p-1.5 text-red-600 hover:bg-white rounded-md transition-colors"><XOctagon className="w-4 h-4" /></button>
                          </div>
                        )}

                        <button title="Edit" onClick={() => navigate(`/edit-booking/${index}?type=classroom`)} className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 hover:text-brand-700 rounded-lg transition-colors border border-brand-100"><Edit3 className="w-4 h-4" /></button>
                        <button title="Delete" onClick={() => deleteBooking(index)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors border border-red-100"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}