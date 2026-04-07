import { AlertCircle, CheckCircle, HelpCircle, X } from 'lucide-react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'success' | 'info';
  confirmText?: string;
  cancelText?: string;
  isConfirm?: boolean;
}

export default function CustomModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirm = true
}: CustomModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertCircle className="w-6 h-6 text-red-600" />,
          bg: 'bg-red-50',
          border: 'border-red-100',
          button: 'bg-red-600 hover:bg-red-700 shadow-red-200'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
          bg: 'bg-emerald-50',
          border: 'border-emerald-100',
          button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
        };
      default:
        return {
          icon: <HelpCircle className="w-6 h-6 text-brand-600" />,
          bg: 'bg-brand-50',
          border: 'border-brand-100',
          button: 'bg-brand-600 hover:bg-brand-700 shadow-brand-200'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div className={`p-3 rounded-2xl ${styles.bg} ${styles.border} border`}>
              {styles.icon}
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {title}
          </h3>
          <p className="text-slate-500 leading-relaxed font-medium">
            {message}
          </p>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
          {isConfirm && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all active:scale-95"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-white transition-all shadow-lg active:scale-95 ${styles.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
