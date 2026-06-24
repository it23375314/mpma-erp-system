import {
  CheckCircle2,
  ReceiptText,
  X,
} from "lucide-react";
import type { StudentPaymentSummary } from "../types/student";

interface ReceiptModalProps {
  payment: StudentPaymentSummary;
  studentName: string;
  onClose: () => void;
}

export default function ReceiptModal({ payment, studentName, onClose }: ReceiptModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <ReceiptText className="w-7 h-7" />
            <h2 className="text-xl font-bold">Payment Receipt</h2>
          </div>
          <p className="text-emerald-100 text-sm">MPMA ERP System — Official Receipt</p>
        </div>

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
}
