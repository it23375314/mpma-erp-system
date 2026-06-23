import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  CreditCard,
  Search,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  RotateCcw,
  FileText,
  User,
  Hash,
  Calendar,
  DollarSign,
  TrendingUp,
  Loader2,
  ChevronDown,
  ReceiptText,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ============================================================
// TypeScript Interfaces
// ============================================================
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export interface StudentInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  course: string;
  batch: string;
}

export interface StudentPaymentRecord {
  id: number;
  student_id: string;
  user_id: number | null;
  course_batch_id: number | null;
  registration_fee: number;
  course_fee: number;
  full_amount_payable: number;
  amount_paid: number;
  payment_method: string;
  payment_status: PaymentStatus;
  payment_completed: boolean;
  payment_reference: string;
  transaction_id: string | null;
  receipt_number: string | null;
  paid_at: string | null;
  callback_response: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  student?: StudentInfo;
}

export interface CreatePaymentRequest {
  student_id: string;
  course_batch_id?: number;
  registration_fee: number;
  course_fee: number;
}

export interface GovPayInitiateResponse {
  success: boolean;
  message: string;
  data: {
    payment_url: string;
    payment_reference: string;
    amount: number;
  };
}

// ============================================================
// Status Badge Component
// ============================================================
const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const config: Record<PaymentStatus, { label: string; classes: string }> = {
    PENDING: {
      label: "Pending",
      classes: "bg-amber-100 text-amber-700 border-amber-200",
    },
    PAID: {
      label: "Paid",
      classes: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    FAILED: {
      label: "Failed",
      classes: "bg-red-100 text-red-700 border-red-200",
    },
    CANCELLED: {
      label: "Cancelled",
      classes: "bg-slate-100 text-slate-600 border-slate-200",
    },
    REFUNDED: {
      label: "Refunded",
      classes: "bg-purple-100 text-purple-700 border-purple-200",
    },
  };

  const c = config[status] || config.PENDING;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${c.classes}`}
    >
      {c.label}
    </span>
  );
};

// ============================================================
// Receipt Modal Component
// ============================================================
const ReceiptModal = ({
  payment,
  onClose,
}: {
  payment: StudentPaymentRecord;
  onClose: () => void;
}) => {
  const studentName = payment.student
    ? `${payment.student.firstName} ${payment.student.lastName}`
    : payment.student_id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <ReceiptText className="w-7 h-7" />
            <h2 className="text-xl font-bold">Payment Receipt</h2>
          </div>
          <p className="text-emerald-100 text-sm">MPMA ERP System — Official Receipt</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-1" />
            <p className="text-emerald-700 font-bold text-lg">Payment Successful</p>
            <p className="text-2xl font-black text-emerald-800">
              Rs. {Number(payment.amount_paid).toLocaleString()}
            </p>
          </div>

          <div className="space-y-3 text-sm">
            {[
              { label: "Student Name", value: studentName },
              { label: "Receipt No.", value: payment.receipt_number || "—" },
              { label: "Payment Ref.", value: payment.payment_reference },
              { label: "Transaction ID", value: payment.transaction_id || "—" },
              { label: "Registration Fee", value: `Rs. ${Number(payment.registration_fee).toLocaleString()}` },
              { label: "Course Fee", value: `Rs. ${Number(payment.course_fee).toLocaleString()}` },
              { label: "Total Amount", value: `Rs. ${Number(payment.full_amount_payable).toLocaleString()}` },
              {
                label: "Paid At",
                value: payment.paid_at
                  ? new Date(payment.paid_at).toLocaleString("en-LK")
                  : "—",
              },
              { label: "Payment Method", value: payment.payment_method },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">{label}</span>
                <span className="font-semibold text-slate-800 text-right">{value}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 pt-2">
            This is a system-generated receipt. No signature required.
          </p>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Main StudentPayment Page
// ============================================================
export default function StudentPayment() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<StudentPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [initiatingId, setInitiatingId] = useState<number | null>(null);
  const [verifyingRef, setVerifyingRef] = useState<string | null>(null);
  const [receiptPayment, setReceiptPayment] = useState<StudentPaymentRecord | null>(null);

  // ── Fetch all payments ──────────────────────────────────────
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/student-payments");
      const json = await res.json();
      if (json.success) {
        setPayments(json.data);
      } else {
        toast.error("Failed to load payments.");
      }
    } catch {
      toast.error("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // ── Initiate GovPay ────────────────────────────────────────
  const handleInitiatePayment = async (payment: StudentPaymentRecord) => {
    try {
      setInitiatingId(payment.id);
      const res = await fetch("http://localhost:5001/api/student-payments/govpay/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: payment.id }),
      });
      const json: GovPayInitiateResponse = await res.json();

      if (json.success && json.data?.payment_url) {
        // Navigate to the GovPay demo page (sandbox)
        navigate(json.data.payment_url);
      } else {
        toast.error(json.message || "Failed to initiate payment.");
      }
    } catch {
      toast.error("Could not connect to server.");
    } finally {
      setInitiatingId(null);
    }
  };

  // ── Verify payment ─────────────────────────────────────────
  const handleVerifyPayment = async (reference: string) => {
    try {
      setVerifyingRef(reference);
      const res = await fetch(
        `http://localhost:5001/api/student-payments/verify/${reference}`
      );
      const json = await res.json();
      if (json.success) {
        const s = json.data.payment_status;
        toast.info(`Status for ${reference}: ${s}`, { autoClose: 4000 });
        await fetchPayments(); // Refresh list
      } else {
        toast.error(json.message || "Verification failed.");
      }
    } catch {
      toast.error("Could not connect to server.");
    } finally {
      setVerifyingRef(null);
    }
  };

  // ── Derived stats ──────────────────────────────────────────
  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.payment_status === "PAID").length,
    pending: payments.filter((p) => p.payment_status === "PENDING").length,
    failed: payments.filter((p) => p.payment_status === "FAILED").length,
    totalRevenue: payments
      .filter((p) => p.payment_status === "PAID")
      .reduce((sum, p) => sum + Number(p.amount_paid), 0),
  };

  // ── Filtered list ──────────────────────────────────────────
  const filteredPayments = payments.filter((p) => {
    const name = p.student
      ? `${p.student.firstName} ${p.student.lastName}`.toLowerCase()
      : "";
    const ref = p.payment_reference.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || name.includes(q) || ref.includes(q);
    const matchStatus =
      statusFilter === "ALL" || p.payment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Status filter tabs ─────────────────────────────────────
  const filterTabs = [
    { key: "ALL", label: "All", count: stats.total },
    { key: "PENDING", label: "Pending", count: stats.pending },
    { key: "PAID", label: "Paid", count: stats.paid },
    { key: "FAILED", label: "Failed", count: stats.failed },
  ];

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" />

      {/* Receipt Modal */}
      {receiptPayment && (
        <ReceiptModal
          payment={receiptPayment}
          onClose={() => setReceiptPayment(null)}
        />
      )}

      <div className="space-y-8">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/25">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Student Payments
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  GovPay integrated payment management
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchPayments}
            disabled={loading}
            id="btn-refresh-payments"
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-all font-semibold text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* ── Stats Cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue</p>
              <p className="text-xl font-black text-slate-800 leading-tight">
                Rs. {stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paid</p>
              <p className="text-2xl font-black text-emerald-600 leading-tight">{stats.paid}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-black text-amber-600 leading-tight">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100 text-red-600">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Failed</p>
              <p className="text-2xl font-black text-red-500 leading-tight">{stats.failed}</p>
            </div>
          </div>
        </div>

        {/* ── Payments Table Card ─────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Table Header Controls */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg font-bold text-slate-800">Payment Transactions</h2>
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    id={`filter-${tab.key.toLowerCase()}`}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      statusFilter === tab.key
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                    <span className="ml-1.5 opacity-70">({tab.count})</span>
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="search-payments"
                  type="text"
                  placeholder="Search by name or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-500" />
                <p className="text-sm font-medium">Loading payment records...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <TrendingUp className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-medium">No payment records found.</p>
                <p className="text-xs mt-1">Payments will appear here after student enrollment.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Payment Reference</th>
                    <th className="px-6 py-4">Fees Breakdown</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((p) => {
                    const studentName = p.student
                      ? `${p.student.firstName} ${p.student.lastName}`
                      : `Student #${p.student_id}`;
                    const courseBatch = p.student
                      ? `${p.student.course} / ${p.student.batch}`
                      : "—";

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50/60 transition-all group"
                      >
                        {/* Student */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-sm">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-800">{studentName}</div>
                              <div className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                                {courseBatch}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Payment Reference */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Hash className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                              {p.payment_reference}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(p.created_at).toLocaleDateString("en-LK")}
                          </div>
                        </td>

                        {/* Fees */}
                        <td className="px-6 py-4">
                          <div className="text-xs text-slate-600 space-y-0.5">
                            <div>
                              <span className="text-slate-400">Reg:</span>{" "}
                              <span className="font-semibold">
                                Rs. {Number(p.registration_fee).toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">Course:</span>{" "}
                              <span className="font-semibold">
                                Rs. {Number(p.course_fee).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <div className="font-black text-slate-800 text-sm">
                            Rs. {Number(p.full_amount_payable).toLocaleString()}
                          </div>
                          {p.payment_status === "PAID" && (
                            <div className="text-[10px] text-emerald-600 font-semibold">
                              Paid: Rs. {Number(p.amount_paid).toLocaleString()}
                            </div>
                          )}
                        </td>

                        {/* Transaction */}
                        <td className="px-6 py-4">
                          {p.transaction_id ? (
                            <div className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 max-w-[140px] truncate">
                              {p.transaction_id}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">—</span>
                          )}
                          {p.paid_at && (
                            <div className="text-[10px] text-slate-400 mt-1">
                              {new Date(p.paid_at).toLocaleString("en-LK", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={p.payment_status} />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Pay with GovPay */}
                            {p.payment_status === "PENDING" && (
                              <button
                                id={`btn-pay-${p.id}`}
                                onClick={() => handleInitiatePayment(p)}
                                disabled={initiatingId === p.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg shadow-sm shadow-emerald-500/20 transition-all disabled:opacity-60"
                                title="Pay with GovPay"
                              >
                                {initiatingId === p.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <ExternalLink className="w-3.5 h-3.5" />
                                )}
                                Pay via GovPay
                              </button>
                            )}

                            {/* Verify Payment */}
                            {(p.payment_status === "PENDING" || p.payment_status === "FAILED") && (
                              <button
                                id={`btn-verify-${p.id}`}
                                onClick={() => handleVerifyPayment(p.payment_reference)}
                                disabled={verifyingRef === p.payment_reference}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-60"
                                title="Verify payment status"
                              >
                                {verifyingRef === p.payment_reference ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-3.5 h-3.5" />
                                )}
                                Verify
                              </button>
                            )}

                            {/* View Receipt */}
                            {p.payment_status === "PAID" && (
                              <button
                                id={`btn-receipt-${p.id}`}
                                onClick={() => setReceiptPayment(p)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-all"
                                title="View receipt"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                Receipt
                              </button>
                            )}

                            {/* Retry for failed */}
                            {p.payment_status === "FAILED" && (
                              <button
                                id={`btn-retry-${p.id}`}
                                onClick={() => handleInitiatePayment(p)}
                                disabled={initiatingId === p.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded-lg transition-all disabled:opacity-60"
                                title="Retry payment"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Retry
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer */}
          {!loading && filteredPayments.length > 0 && (
            <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Showing {filteredPayments.length} of {payments.length} records</span>
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Payment status is updated only via verified GovPay callback.
              </span>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
