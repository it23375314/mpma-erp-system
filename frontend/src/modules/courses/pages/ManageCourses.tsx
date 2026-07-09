import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { 
  Plus, 
  Edit3, 
  Search, 
  BookOpen, 
  Clock, 
  Globe, 
  MapPin, 
  Users, 
  Power, 
  FileText
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { fetchApi } from "../../../utils/api";

export default function ManageCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const userRole = localStorage.getItem("userRole") || "user";

  const [form, setForm] = useState({
    courseCode: "",
    courseName: "",
    stream: "",
    description: "",
    duration: "",
    medium: "English",
    location: "",
    maxParticipants: "",
    registrationFee: "",
    courseFee: ""
  });

  useEffect(() => {
    if (userRole !== "admin" && userRole !== "officer") {
      window.location.href = "/dashboard";
    }
    loadCourses();
  }, [userRole]);

  const loadCourses = async () => {
    try {
      const data = await fetchApi('/courses');
      setCourses(data);
    } catch (error) {
      toast.error("Failed to load courses");
    }
  };

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (c: any) => {
    setEditingId(c.id);
    setForm({
      courseCode: c.courseCode,
      courseName: c.courseName,
      stream: c.stream,
      description: c.description || "",
      duration: c.duration,
      medium: c.medium,
      location: c.location,
      maxParticipants: c.maxParticipants.toString(),
      registrationFee: c.registrationFee.toString(),
      courseFee: c.courseFee.toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveCourse = async (e: any) => {
    e.preventDefault();

    if (!form.courseCode || !form.courseName || !form.stream || !form.duration || !form.location || !form.maxParticipants || !form.registrationFee || !form.courseFee) {
      toast.error("Please fill all required fields");
      return;
    }

    if (Number(form.maxParticipants) <= 0) {
      toast.error("Max participants must be greater than 0");
      return;
    }

    const payload = {
      ...form,
      maxParticipants: Number(form.maxParticipants),
      registrationFee: Number(form.registrationFee),
      courseFee: Number(form.courseFee)
    };

    try {
      if (editingId) {
        const updated = await fetchApi(`/courses/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setCourses(courses.map(c => c.id === editingId ? updated : c));
        toast.success("Course details successfully updated!");
      } else {
        const newCourse = await fetchApi('/courses', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setCourses([...courses, newCourse]);
        toast.success("Course registered into registry successfully!");
      }
      
      handleReset();
    } catch (error: any) {
      toast.error(error.message || "Failed to save course");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await fetchApi(`/courses/${id}/status`, {
        method: 'PATCH'
      });
      setCourses(courses.map(c => c.id === id ? updated : c));
      toast.info(`Course code ${updated.courseCode} is now ${updated.status}`);
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setForm({
      courseCode: "",
      courseName: "",
      stream: "",
      description: "",
      duration: "",
      medium: "English",
      location: "",
      maxParticipants: "",
      registrationFee: "",
      courseFee: ""
    });
  };

  // No active stats calculations

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 justify-center rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Manage Courses
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            Configure curriculum templates, fees matrices, timelines, and primary instructions streams.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sleek Registration Form Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-28">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Course" : "Add New Course"}
              </h2>
              {editingId && (
                <button 
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
            
            <form onSubmit={handleSaveCourse} className="p-5 space-y-5">
              
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Code</label>
                  <input
                    name="courseCode"
                    value={form.courseCode}
                    onChange={handleChange}
                    placeholder="e.g. C-DSE"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stream Name</label>
                  <input
                    name="stream"
                    value={form.stream}
                    onChange={handleChange}
                    placeholder="e.g. IT & Software"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Course / Degree Name</label>
                <input
                  name="courseName"
                  value={form.courseName}
                  onChange={handleChange}
                  placeholder="e.g. Diploma in Software Engineering"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Medium</label>
                  <select
                    name="medium"
                    value={form.medium}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duration</label>
                  <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g. 6 Months"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Lab 02"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Participants</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={form.maxParticipants}
                    onChange={handleChange}
                    placeholder="e.g. 40"
                    min="1"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reg. Fee (LKR)</label>
                  <input
                    type="number"
                    name="registrationFee"
                    value={form.registrationFee}
                    onChange={handleChange}
                    placeholder="LKR 1,500"
                    min="0"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tuition Fee (LKR)</label>
                  <input
                    type="number"
                    name="courseFee"
                    value={form.courseFee}
                    onChange={handleChange}
                    placeholder="LKR 45,000"
                    min="0"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Syllabus Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Outline key academic outcomes..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5 mt-2 shadow-md ${
                  editingId ? "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
                }`}
              >
                {editingId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingId ? "Update Course" : "Add Course"}
              </button>
            </form>
          </div>
        </div>

        {/* Dashboard course list panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            
            {/* Table Utilities */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/50 gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800">Course Registry</h2>
                <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                  Total: {courses.length}
                </span>
              </div>
              
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
                <input 
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* List */}
            <div className="p-5">
              {courses.length === 0 ? (
                <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-medium text-slate-600">No courses added yet</p>
                  <p className="text-sm text-slate-500 mt-1">Use the form to add courses to the registry.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses
                    .filter(c => 
                      c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      c.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.stream.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((c, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3 gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">
                              {c.courseCode}
                            </span>
                            <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
                              {c.stream}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-800 leading-tight mt-2 truncate group-hover:text-indigo-600 transition-colors">
                            {c.courseName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleToggleStatus(c.id)}
                            className={`p-1.5 rounded-lg transition-all ${
                              c.status === 'Active' 
                                ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                            title={c.status === 'Active' ? 'Deactivate Program' : 'Activate Program'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(c)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Program"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {c.description && (
                        <p className="text-xs text-slate-500 mb-4 line-clamp-2 h-8">
                          {c.description}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-y-2 py-3 border-t border-b border-slate-100 text-xs text-slate-600 mb-3 mt-auto">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{c.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{c.medium}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{c.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{c.maxParticipants} PAX</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider leading-none">Course Fee</span>
                          <span className="text-sm font-bold text-slate-800 mt-1">LKR {Number(c.courseFee).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                            c.status === 'Active' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                              : 'bg-red-50 border-red-200 text-red-700'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
