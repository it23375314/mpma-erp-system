import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { fetchApi } from "../../../utils/api";
import ReceiptModal from "../components/ReceiptModal";
import {
  Users,
  Search,
  Eye,
  Edit3,
  CreditCard,
  ReceiptText,
  GraduationCap,
  UserCheck,
  Calendar,
} from "lucide-react";
import type { PaymentStatus, StudentRecord } from "../types/student";
import {
  formatStudentId,
  getNicOrPassport,
  getStudentFullName,
} from "../types/student";

const StudentStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Enrolled: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Registered: "bg-blue-100 text-blue-700 border-blue-200",
    Graduated: "bg-indigo-100 text-indigo-700 border-indigo-200",
    Dropout: "bg-rose-100 text-rose-700 border-rose-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
};

const PaymentStatusBadge = ({ status }: { status: PaymentStatus | "NONE" }) => {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
    FAILED: "bg-red-100 text-red-700 border-red-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
    REFUNDED: "bg-purple-100 text-purple-700 border-purple-200",
    NONE: "bg-slate-100 text-slate-500 border-slate-200",
  };

  const label = status === "NONE" ? "No Payment" : status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
        styles[status] || styles.NONE
      }`}
    >
      {label}
    </span>
  );
};

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [receiptPayment, setReceiptPayment] = useState<{
    payment: StudentRecord["latestPayment"];
    studentName: string;
  } | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/students?status=Enrolled,Registered");
      setStudents(data);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const fullName = getStudentFullName(student).toLowerCase();
    const q = searchQuery.toLowerCase();
    const idDoc = getNicOrPassport(student).toLowerCase();
    return (
      !q ||
      fullName.includes(q) ||
      student.email.toLowerCase().includes(q) ||
      student.course.toLowerCase().includes(q) ||
      student.id.toLowerCase().includes(q) ||
      idDoc.includes(q) ||
      (student.studentCategory || "").toLowerCase().includes(q)
    );
  });

  const stats = {
    total: students.length,
    enrolled: students.filter((s) => s.status === "Enrolled").length,
    registered: students.filter((s) => s.status === "Registered").length,
    paid: students.filter((s) => s.latestPayment?.payment_status === "PAID").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Student List</h1>
            </div>
            <p className="text-slate-500 font-medium">
              View all enrolled and registered students with payment and profile details.
            </p>
          </div>
          <button
            onClick={() => navigate("/student-management/enrollment/new")}
            className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all font-semibold"
          >
            <GraduationCap className="w-5 h-5" />
            New Enrollment
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
              <p className="text-2xl font-black text-slate-800 leading-tight">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enrolled</p>
              <p className="text-2xl font-black text-emerald-600 leading-tight">{stats.enrolled}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered</p>
              <p className="text-2xl font-black text-blue-600 leading-tight">{stats.registered}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-teal-100 text-teal-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paid</p>
              <p className="text-2xl font-black text-teal-600 leading-tight">{stats.paid}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800">Enrolled & Registered Students</h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, ID, NIC, course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1100px]">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-4 py-4">Student ID</th>
                  <th className="px-4 py-4">Full Name</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">NIC / Passport</th>
                  <th className="px-4 py-4">Course</th>
                  <th className="px-4 py-4">Batch</th>
                  <th className="px-4 py-4 text-center">Payment Status</th>
                  <th className="px-4 py-4 text-center">Student Status</th>
                  <th className="px-4 py-4">Created Date</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-400">
                      Loading students...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const paymentStatus = (student.latestPayment?.payment_status || "NONE") as
                      | PaymentStatus
                      | "NONE";
                    const fullName = getStudentFullName(student);

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono font-bold text-slate-600" title={student.id}>
                            {formatStudentId(student.id)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-slate-800">{fullName}</div>
                          <div className="text-xs text-slate-500">{student.email}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
                          {student.studentCategory || "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                          {getNicOrPassport(student)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                          {student.course}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs font-bold text-slate-400 uppercase">
                          {student.batch}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <PaymentStatusBadge status={paymentStatus} />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <StudentStatusBadge status={student.status} />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(student.createdAt).toLocaleDateString("en-LK")}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              title="View Profile"
                              onClick={() => navigate(`/student-management/students/${student.id}`)}
                              className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              title="Edit Student"
                              onClick={() =>
                                navigate(`/student-management/students/${student.id}?edit=true`)
                              }
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              title="Payment"
                              onClick={() => {
                                const ref = student.latestPayment?.payment_reference;
                                navigate(
                                  ref
                                    ? `/student-management/payment?ref=${encodeURIComponent(ref)}`
                                    : "/student-management/payment"
                                );
                              }}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                            <button
                              title="Receipt"
                              disabled={student.latestPayment?.payment_status !== "PAID"}
                              onClick={() => {
                                if (student.latestPayment?.payment_status === "PAID") {
                                  setReceiptPayment({
                                    payment: student.latestPayment,
                                    studentName: fullName,
                                  });
                                }
                              }}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ReceiptText className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {receiptPayment?.payment && (
        <ReceiptModal
          payment={receiptPayment.payment}
          studentName={receiptPayment.studentName}
          onClose={() => setReceiptPayment(null)}
        />
      )}
    </DashboardLayout>
  );
}
