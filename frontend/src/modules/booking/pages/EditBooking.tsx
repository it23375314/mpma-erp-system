import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  Save,
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Clock,
  Users,
  FileText
} from "lucide-react";
import { fetchApi } from "../../../utils/api";

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
    description: "",
    status: "Pending"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // Fetch all auditorium bookings and find by id (UUID)
        const data = await fetchApi("/auditorium-bookings");
        const booking = data.find((b: any) => b.id === id);
        if (booking) {
          setForm({
            name: booking.name || "",
            contact: booking.contact || "",
            date: booking.date || "",
            start: booking.start || "",
            end: booking.end || "",
            participants: booking.participants?.toString() || "",
            description: booking.description || "",
            status: booking.status || "Pending"
          });
        } else {
          toast.error("Booking not found");
          navigate("/auditorium-booking");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load booking");
        navigate("/auditorium-booking");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name || !form.contact || !form.date || !form.start || !form.end) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await fetchApi(`/auditorium-bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          contact: form.contact,
          date: form.date,
          start: form.start,
          end: form.end,
          participants: Number(form.participants),
          description: form.description
        })
      });

      toast.success("Reservation updated successfully!");
      navigate("/auditorium-booking");
    } catch (err: any) {
      toast.error(err.message || "Failed to update booking");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-brand-600 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Edit Reservation
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Update the details for booking ID: {id?.slice(0, 8)}...
          </p>
        </div>
      </div>

      <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Booking Details</h2>
            <p className="text-sm text-slate-500">Required fields are marked with an asterisk (*)</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            form.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
            form.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
            'bg-amber-100 text-amber-700 border-amber-200'
          }`}>
            Status: {form.status || 'Pending'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Requester Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Requester Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Requester name"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Contact number"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Reservation Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Expected Participants
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Users className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="participants"
                  value={form.participants}
                  onChange={handleChange}
                  min="1"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Clock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="time"
                  name="start"
                  value={form.start}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                End Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Clock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="time"
                  name="end"
                  value={form.end}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Event Description
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none">
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the event..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none resize-none"
              />
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5"
            >
              <Save className="w-5 h-5" />
              Update Reservation
            </button>
          </div>

        </form>

      </div>
    </DashboardLayout>
  );
}