import { AlertTriangle, X, CalendarX } from "lucide-react";

interface MaintenanceWarning {
  title: string;
  description?: string;
  facilityType: string;
  facilityName: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
}

interface Props {
  warnings: MaintenanceWarning[];
  onClose: () => void;
}

export default function MaintenanceWarningModal({ warnings, onClose }: Props) {
  if (warnings.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[fadeIn_0.2s_ease]">
        
        {/* Header */}
        <div className="flex items-center gap-3 p-5 bg-amber-50 border-b border-amber-200">
          <div className="p-2 bg-amber-100 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-amber-900">Temporarily Inactive</h2>
            <p className="text-sm text-amber-700">This facility is under scheduled maintenance</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          {warnings.map((m, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <CalendarX className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 text-sm">{m.title}</p>
                <p className="text-[10px] text-brand-600 font-bold uppercase tracking-tight mt-0.5">
                  Target: {m.facilityType} — {m.facilityName}
                </p>
                {m.description && (
                  <p className="text-xs text-slate-500 mt-0.5 italic">"{m.description}"</p>
                )}
                <div className="flex gap-3 mt-2">
                  <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    📅 {m.dateFrom} → {m.dateTo}
                  </span>
                  <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    🕐 {m.timeFrom} – {m.timeTo}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <p className="text-xs text-slate-500 text-center pt-1">
            Please choose a different date or contact admin for assistance.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
          >
            Understood, Change Date
          </button>
        </div>
      </div>
    </div>
  );
}
