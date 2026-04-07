import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import "react-toastify/dist/ReactToastify.css";
import { fetchApi } from "../../../utils/api";
import MaintenanceWarningModal from "../components/MaintenanceWarningModal";

export default function NewBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeStr = searchParams.get("type");
  
  const titleMap: any = {
    classroom: "New Classroom Booking",
    transport: "New Transport Request",
    auditorium: "New Auditorium Reservation"
  };
  const pageTitle = titleMap[typeStr as string] || titleMap.auditorium;

  const [form, setForm] = useState({
    name: "",
    contact: "",
    date: "",
    start: "",
    end: "",
    participants: "",
    description: ""
  });
  const [maintenanceWarnings, setMaintenanceWarnings] = useState<any[]>([]);

  const checkMaintenanceForDate = async (date: string, start: string, end: string) => {
    if (!date) { setMaintenanceWarnings([]); return; }
    try {
      const result = await fetchApi('/maintenances/check-conflict', {
        method: 'POST',
        body: JSON.stringify({
          facilityType: 'Auditorium',
          dateFrom: date,
          dateTo: date,
          timeFrom: start || '00:00',
          timeTo: end || '23:59'
        })
      });
      setMaintenanceWarnings(result.hasConflict ? result.conflicts.map((m: any) => ({
        ...m,
        facilityName: m.classroom?.name || m.vehicle?.name || m.facilityType
      })) : []);
    } catch (_) { setMaintenanceWarnings([]); }
  };

  const handleChange = (e: any) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (e.target.name === 'date' || e.target.name === 'start' || e.target.name === 'end') {
      checkMaintenanceForDate(
        e.target.name === 'date' ? e.target.value : form.date,
        e.target.name === 'start' ? e.target.value : form.start,
        e.target.name === 'end' ? e.target.value : form.end
      );
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name || !form.contact || !form.date || !form.start || !form.end) {
      toast.error("Please fill all required fields");
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

    try {
      const existingBookings = await fetchApi('/auditorium-bookings');

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

      const maintenanceCheck = await fetchApi('/maintenances/check-conflict', {
        method: 'POST',
        body: JSON.stringify({
          facilityType: 'Auditorium',
          dateFrom: form.date,
          dateTo: form.date,
          timeFrom: form.start,
          timeTo: form.end
        })
      });

      if (maintenanceCheck.hasConflict) {
        // Since there's only one auditorium, any 'Auditorium' maintenance blocks it
        toast.error(`Auditorium is under maintenance: ${maintenanceCheck.conflicts[0].title}`);
        return;
      }

      const payload = {
        ...form,
        participants: Number(form.participants),
        status: "Pending"
      };

      await fetchApi('/auditorium-bookings', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      toast.success("Reservation created successfully!");
      navigate("/auditorium-booking");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    }
  };

  return (
    <DashboardLayout>
      <MaintenanceWarningModal
        warnings={maintenanceWarnings}
        onClose={() => setMaintenanceWarnings([])}
      />
      
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
            {pageTitle}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Fill out the details below to request a new reservation.
          </p>
        </div>
      </div>

      <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Booking Details</h2>
          <p className="text-sm text-slate-500">Required fields are marked with an asterisk (*)</p>
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
                  placeholder="Full Name"
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
                  placeholder="0xxxxxxxxx"
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
                  min={new Date().toISOString().split("T")[0]}
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
                Expected Participants <span className="text-red-500">*</span>
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
                  placeholder="E.g., 50"
                  min="1"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                  required
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
              Event Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none">
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a brief description of the event or requirement..."
                rows={4}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none resize-none"
                required
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
              Submit Request
            </button>
          </div>

        </form>

      </div>
    </DashboardLayout>
  );
}