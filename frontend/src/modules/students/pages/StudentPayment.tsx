import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { 
  Plus, 
  Search,
  Download,
  CreditCard,
  DollarSign,
  TrendingUp,
  Clock,
  User,
  Calendar,
  Filter,
  CheckCircle2,
  FileText
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function StudentPayment() {
  const [payments, setPayments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Placeholder data for now
  useEffect(() => {
    setPayments([
      { id: '1', studentName: 'Nishantha Kumara', studentId: 'ST-001', amount: 50000, date: '2026-06-10', type: 'Semester Fee', status: 'Paid' },
      { id: '2', studentName: 'Amila Perera', studentId: 'ST-002', amount: 15000, date: '2026-06-12', type: 'Library Fee', status: 'Paid' },
      { id: '3', studentName: 'Sandun Silva', studentId: 'ST-003', amount: 50000, date: '2026-06-15', type: 'Semester Fee', status: 'Pending' },
    ]);
  }, []);

  const StatusBadge = ({ status }: { status: string }) => {
    return status === 'Paid' 
      ? <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wider">Paid</span>
      : <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider">Pending</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 text-emerald-700 justify-center rounded-lg">
                <CreditCard className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Student Payments
              </h1>
            </div>
            <p className="text-slate-500 font-medium">
              Track and manage all student financial transactions and fee payments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-all font-semibold">
              <Download className="w-5 h-5 text-slate-400" />
              Export Report
            </button>
            <button className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all font-semibold">
              <Plus className="w-5 h-5" />
              New Payment
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue</p>
              <p className="text-2xl font-black text-slate-800 leading-tight">Rs. 115k</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Collected</p>
              <p className="text-2xl font-black text-blue-600 leading-tight">100%</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-black text-amber-600 leading-tight">01</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Processed</p>
              <p className="text-2xl font-black text-indigo-600 leading-tight">65</p>
            </div>
          </div>
        </div>

        {/* List Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800">Payment Transactions</h2>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none"
                />
              </div>
              <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-brand-600 transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Transaction Details</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{p.studentName}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {p.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-600">{p.type}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {p.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-700">Rs. {p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-all">
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
