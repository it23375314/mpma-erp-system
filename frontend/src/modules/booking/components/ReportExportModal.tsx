import { useState } from "react";
import { X, Calendar, FileText, Download, Filter } from "lucide-react";

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filters: { startDate: string; endDate: string; scope: string }) => void;
  type: 'Transport' | 'Classroom' | 'Auditorium';
  options: any[]; // Vehicles or Classrooms
}

export default function ReportExportModal({ isOpen, onClose, onExport, type, options }: ReportExportModalProps) {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    scope: "all"
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(filters);
    onClose();
  };

  const getScopeLabel = () => {
    if (type === 'Transport') return 'Specific Vehicle';
    if (type === 'Classroom') return 'Specific Classroom';
    return 'Auditorium Scope';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Export Report</h3>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{type} Module</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Start Date <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  End Date <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            {type !== 'Auditorium' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  {getScopeLabel()}
                </label>
                <select
                  value={filters.scope}
                  onChange={(e) => setFilters({ ...filters, scope: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All {type === 'Transport' ? 'Vehicles' : 'Classrooms'}</option>
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} {opt.number ? `(${opt.number})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3.5 rounded-2xl shadow-lg shadow-brand-500/20 transition-all font-bold"
              >
                <Download className="w-5 h-5" />
                Generate PDF Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
