import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Plus,
  Trash2,
  Eye,
  GraduationCap,
  Search,
  User,
  Mail,
  Filter,
  ClipboardList,
  Calendar,
  ChevronDown,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { fetchApi } from "../../../utils/api";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  Applied: { label: "Applied", className: "bg-violet-100 text-violet-700 border-violet-200" },
  Pending: { label: "Pending", className: "bg-amber-100 text-amber-700 border-amber-200" },
  Enrolled: { label: "Enrolled", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  Qualified: { label: "Qualified", className: "bg-sky-100 text-sky-700 border-sky-200" },
  Registered: { label: "Registered", className: "bg-blue-100 text-blue-700 border-blue-200" },
  Graduated: { label: "Graduated", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  Dropout: { label: "Dropout", className: "bg-rose-100 text-rose-700 border-rose-200" },
};

const APP_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING_REVIEW: { label: "Pending Review", className: "bg-amber-100 text-amber-700 border-amber-200" },
  APPROVED: { label: "Approved", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  REJECTED: { label: "Rejected", className: "bg-rose-100 text-rose-700 border-rose-200" },
  CORRECTION_REQUESTED: { label: "Correction Needed", className: "bg-orange-100 text-orange-700 border-orange-200" },
};

const StatusBadge = ({ status, type = "status" }: { status: string; type?: "status" | "app_status" }) => {
  const config =
    type === "app_status"
      ? APP_STATUS_CONFIG[status]
      : STATUS_CONFIG[status];
  const cfg = config || { label: status, className: "bg-slate-100 text-slate-600 border-slate-200" };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

export default function ManageEnrollment() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/students");
      setStudents(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string, name: string) => {
    if (!window.confirm(`Remove enrollment for ${name}?`)) return;
    try {
      await fetchApi(`/students/${id}`, { method: "DELETE" });
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success("Student removed successfully");
    } catch {
      toast.error("Failed to remove student");
    }
  };

  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(query);
    const emailMatch = s.email?.toLowerCase().includes(query);
    const courseMatch = s.course?.toLowerCase().includes(query);
    const statusMatch = filterStatus === "All" || s.status === filterStatus;
    return (nameMatch || emailMatch || courseMatch) && statusMatch;
  });

  const counts = {
    total: students.length,
    applied: students.filter((s) => s.status === "Applied").length,
    enrolled: students.filter((s) => s.status === "Enrolled").length,
    registered: students.filter((s) => s.status === "Registered").length,
    graduated: students.filter((s) => s.status === "Graduated").length,
    dropout: students.filter((s) => s.status === "Dropout").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Student Enrollment
              </h1>
            </div>
            <p className="text-slate-500 font-medium">
              Manage all student applications and enrollments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/student-management/enrollment/new")}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all font-semibold"
            >
              <Plus className="w-5 h-5" />
              Enroll New Student
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { label: "Total", count: counts.total, color: "indigo" },
            { label: "Applied", count: counts.applied, color: "violet" },
            { label: "Enrolled", count: counts.enrolled, color: "emerald" },
            { label: "Registered", count: counts.registered, color: "blue" },
            { label: "Graduated", count: counts.graduated, color: "sky" },
            { label: "Dropout", count: counts.dropout, color: "rose" },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className={`bg-white rounded-2xl border border-${color}-100 shadow-sm p-4 flex flex-col gap-1 cursor-pointer hover:border-${color}-300 transition-all`}
              onClick={() => setFilterStatus(label === "Total" ? "All" : label)}
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
              <p className={`text-2xl font-black text-${color}-600 leading-tight`}>{count}</p>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-500" />
              All Enrollments
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                {filteredStudents.length}
              </span>
            </h2>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, email, course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 p-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-brand-600 transition-all text-sm font-medium"
                >
                  <Filter className="w-4 h-4" />
                  {filterStatus !== "All" && <span className="text-brand-600">{filterStatus}</span>}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showFilters && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 min-w-[160px] py-1">
                    {["All", "Applied", "Pending", "Enrolled", "Qualified", "Registered", "Graduated", "Dropout"].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setFilterStatus(s); setShowFilters(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-all ${filterStatus === s ? "font-bold text-brand-600" : "text-slate-700"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course & Batch</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Enrollment Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">App. Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={7} className="p-12 text-center text-slate-400">Loading students...</td></tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <User className="w-12 h-12 text-slate-200" />
                        <p className="text-slate-500 font-medium">No students found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {student.firstName?.[0]}{student.lastName?.[0]}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{student.firstName} {student.lastName}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-700">{student.course}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{student.batch}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-slate-600">{student.studentCategory || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <StatusBadge status={student.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {student.application_status ? (
                          <StatusBadge status={student.application_status} type="app_status" />
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/student-management/students/${student.id}`)}
                            className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteStudent(student.id, `${student.firstName} ${student.lastName}`)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && filteredStudents.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-400">Showing {filteredStudents.length} of {students.length} students</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
