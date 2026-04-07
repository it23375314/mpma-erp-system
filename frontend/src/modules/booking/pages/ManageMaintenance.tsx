import { useState, useEffect } from "react";
import { fetchApi } from "../../../utils/api";
import { 
  Wrench, 
  Trash2, 
  Plus, 
  CalendarMinus,
  CheckCircle,
  AlertCircle,
  Edit3
} from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomModal from "../components/CustomModal";

export default function ManageMaintenance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [modalConfig, setModalConfig] = useState<any>({ isOpen: false });

  const [form, setForm] = useState({
    title: "",
    description: "",
    facilityType: "General",
    facilityId: "",
    dateFrom: "",
    dateTo: "",
    timeFrom: "",
    timeTo: ""
  });

  // Fetch facilities for dropdowns
  const loadFacilities = async () => {
    try {
      const [vData, cData] = await Promise.all([
        fetchApi('/vehicles'),
        fetchApi('/classrooms')
      ]);
      setVehicles(vData);
      setClassrooms(cData);
    } catch (error) {
      console.error("Failed to load facilities", error);
    }
  };

  // Fetch maintenances
  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/maintenances");
      setMaintenances(data);
    } catch (error) {
      console.error("Failed to fetch maintenances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check auth
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      navigate("/dashboard");
      return;
    }
    
    // Pre-fill from URL
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    
    if (type && id) {
      setForm(prev => ({
        ...prev,
        facilityType: type,
        facilityId: id,
        title: name ? `${name} Maintenance` : ""
      }));
    }

    fetchMaintenances();
    loadFacilities();
  }, [navigate, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (m: any) => {
    setEditingId(m.id);
    setForm({
      title: m.title,
      description: m.description || "",
      facilityType: m.facilityType,
      facilityId: m.facilityId || "",
      dateFrom: m.dateFrom,
      dateTo: m.dateTo,
      timeFrom: m.timeFrom,
      timeTo: m.timeTo
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", description: "", facilityType: "General", facilityId: "", dateFrom: "", dateTo: "", timeFrom: "", timeTo: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    // Quick validation
    if (!form.title || !form.dateFrom || !form.dateTo || !form.timeFrom || !form.timeTo) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        const updated = await fetchApi(`/maintenances/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
        setMaintenances(maintenances.map(m => m.id === editingId ? updated : m));
        setSuccessMsg("Maintenance schedule updated successfully.");
        setEditingId(null);
      } else {
        await fetchApi("/maintenances", {
          method: 'POST',
          body: JSON.stringify(form)
        });
        setSuccessMsg("Maintenance schedule created successfully.");
        fetchMaintenances();
      }
      setForm({ title: "", description: "", facilityType: "General", facilityId: "", dateFrom: "", dateTo: "", timeFrom: "", timeTo: "" });
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to create maintenance schedule.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    setModalConfig({
      isOpen: true,
      title: "Remove Maintenance Schedule",
      message: `Are you sure you want to remove the maintenance schedule for "${title}"? This will unblock any facilities associated with this record.`,
      type: "danger",
      confirmText: "Remove Schedule",
      onConfirm: async () => {
        try {
          await fetchApi(`/maintenances/${id}`, { method: 'DELETE' });
          fetchMaintenances();
          setSuccessMsg("Maintenance schedule removed successfully.");
          setTimeout(() => setSuccessMsg(""), 3000);
        } catch (error) {
          console.error("Failed to delete", error);
          setErrorMsg("Failed to remove maintenance schedule.");
        }
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-brand-600" />
            Manage Maintenance & Notices
          </h1>
          <p className="text-gray-500 mt-2">
            Schedule repairs to block bookings and inform users.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-1 border rounded-2xl bg-white shadow-sm overflow-hidden h-fit">
          <div className="bg-slate-50 border-b p-5 font-semibold text-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-600" />
              {editingId ? "Edit Maintenance Notice" : "New Maintenance Notice"}
            </div>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="text-xs font-semibold text-slate-500 hover:text-red-600"
              >
                Cancel Edit
              </button>
            )}
          </div>
          
          <form className="p-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notice Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., HVAC Repair"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facility Type *</label>
              <select
                name="facilityType"
                value={form.facilityType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="General">General (All Facilities)</option>
                <option value="Auditorium">Auditorium</option>
                <option value="Classroom">Classroom</option>
                <option value="Transport">Transport</option>
              </select>
            </div>

            {form.facilityType !== 'General' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select {form.facilityType} *</label>
                <select
                  name="facilityId"
                  value={form.facilityId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                >
                  <option value="">-- Select {form.facilityType} --</option>
                  {form.facilityType === 'Transport' ? (
                    vehicles.map(v => <option key={v._id || v.id} value={v._id || v.id}>{v.name} ({v.number})</option>)
                  ) : form.facilityType === 'Classroom' ? (
                    classrooms.map(c => <option key={c.id} value={c.id}>{c.name} (Cap: {c.capacity})</option>)
                  ) : (
                    <option value="N/A">Not applicable for this type</option>
                  )}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date From *</label>
                <input
                  type="date"
                  name="dateFrom"
                  value={form.dateFrom}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time From *</label>
                <input
                  type="time"
                  name="timeFrom"
                  value={form.timeFrom}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To *</label>
                <input
                  type="date"
                  name="dateTo"
                  value={form.dateTo}
                  min={form.dateFrom}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time To *</label>
                <input
                  type="time"
                  name="timeTo"
                  value={form.timeTo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Any additional details..."
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none min-h-[80px]"
              />
            </div>

              <button
              type="submit"
              disabled={submitting}
              className={`w-full font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 mt-4 text-white ${
                editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-brand-600 hover:bg-brand-700'
              }`}
            >
              {submitting ? "Saving..." : editingId ? "Update Maintenance" : "Add Maintenance"}
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 border rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b p-5 font-semibold text-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarMinus className="w-5 h-5 text-brand-600" />
              Scheduled Notices
            </div>
            <span className="bg-brand-100 text-brand-700 text-xs py-1 px-3 rounded-full">
              {maintenances.length} Records
            </span>
          </div>

          <div className="p-0 overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : maintenances.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No maintenance schedules found.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b text-sm text-gray-600">
                    <th className="py-4 px-6 font-semibold">Title</th>
                    <th className="py-4 px-6 font-semibold">Type</th>
                    <th className="py-4 px-6 font-semibold">Specific Facility</th>
                    <th className="py-4 px-6 font-semibold">Duration</th>
                    <th className="py-4 px-6 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {maintenances.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-800">{m.title}</p>
                        {m.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{m.description}</p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          m.facilityType === 'General' ? 'bg-indigo-100 text-indigo-700' :
                          m.facilityType === 'Auditorium' ? 'bg-emerald-100 text-emerald-700' :
                          m.facilityType === 'Classroom' ? 'bg-amber-100 text-amber-700' :
                          'bg-cyan-100 text-cyan-700'
                        }`}>
                          {m.facilityType}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium text-slate-700">
                          {(() => {
                            // 1. Try associations
                            if (m.classroom?.name) return m.classroom.name;
                            if (m.vehicle) return `${m.vehicle.name} (${m.vehicle.number})`;
                            
                            // 2. Try manual lookup from fetched assets (fallback)
                            if (m.facilityId) {
                               if (m.facilityType === 'Classroom') {
                                  const c = classrooms.find(cl => cl.id === m.facilityId);
                                  if (c) return c.name;
                               } else if (m.facilityType === 'Transport') {
                                  const v = vehicles.find(vh => vh.id === m.facilityId || vh._id === m.facilityId);
                                  if (v) return `${v.name} (${v.number})`;
                               }
                            }

                            // 3. Type-based default
                            if (m.facilityType === 'General') return 'All Facilities';
                            if (m.facilityType === 'Auditorium') return 'Main Auditorium';
                            return m.facilityType; // e.g. "Classroom" if ID missing
                          })()}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <p className="text-gray-800"><span className="text-gray-500 text-xs">From:</span> {m.dateFrom} <span className="text-xs text-gray-400">@</span> {m.timeFrom}</p>
                          <p className="text-gray-800"><span className="text-gray-500 text-xs">To:</span> {m.dateTo} <span className="text-xs text-gray-400">@</span> {m.timeTo}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(m)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Schedule"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id, m.title)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Schedule"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <CustomModal 
        {...modalConfig} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} 
      />
    </DashboardLayout>
  );
}
