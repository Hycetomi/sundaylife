import { createContext, useCallback, useContext, useReducer } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

type ToastAction =
  | { type: 'ADD'; toast: Toast }
  | { type: 'REMOVE'; id: string };

// ── Config ────────────────────────────────────────────────────────────────────

const TOAST_CONFIG: Record<ToastType, {
  icon: React.ElementType;
  bar: string;
  iconColor: string;
  bg: string;
}> = {
  success: {
    icon:      CheckCircle2,
    bar:       'bg-fluorescence',
    iconColor: 'text-fluorescence',
    bg:        'bg-bitter-liquorice',
  },
  error: {
    icon:      XCircle,
    bar:       'bg-hot-red',
    iconColor: 'text-hot-red',
    bg:        'bg-bitter-liquorice',
  },
  warning: {
    icon:      AlertTriangle,
    bar:       'bg-waxy-corn',
    iconColor: 'text-waxy-corn',
    bg:        'bg-bitter-liquorice',
  },
  info: {
    icon:      Info,
    bar:       'bg-astral-blue',
    iconColor: 'text-sky-300',
    bg:        'bg-bitter-liquorice',
  },
};

// ── Reducer ───────────────────────────────────────────────────────────────────

const toastReducer = (state: Toast[], action: ToastAction): Toast[] => {
  switch (action.type) {
    case 'ADD':    return [action.toast, ...state].slice(0, 5);
    case 'REMOVE': return state.filter(t => t.id !== action.id);
    default:       return state;
  }
};

// ── Context ───────────────────────────────────────────────────────────────────

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Single toast item ─────────────────────────────────────────────────────────

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const cfg = TOAST_CONFIG[toast.type];
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 48, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.9 }}
      transition={{ duration: 0.2, type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'relative overflow-hidden w-full max-w-sm rounded-xl border border-white/10 shadow-2xl',
        cfg.bg,
      )}
    >
      {/* Left accent bar */}
      <div className={cn('absolute left-0 top-0 bottom-0 w-1', cfg.bar)} />

      <div className="flex items-start gap-3 px-4 py-3.5 pl-5">
        <Icon size={16} className={cn('flex-shrink-0 mt-0.5', cfg.iconColor)} />
        <div className="flex-1 min-w-0">
          <p className="font-cabinet font-bold text-sm text-pink-swirl leading-snug">{toast.title}</p>
          {toast.description && (
            <p className="font-general text-xs text-pink-swirl/50 mt-0.5 leading-relaxed">
              {toast.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-pink-swirl/30 hover:text-pink-swirl transition-colors mt-0.5"
        >
          <X size={13} />
        </button>
      </div>
    </motion.div>
  );
};

// ── Provider ──────────────────────────────────────────────────────────────────

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    dispatch({ type: 'ADD', toast: { ...toast, id } });
    setTimeout(() => removeToast(id), toast.duration ?? 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2.5 w-full max-w-sm pointer-events-none"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map(toast => (
              <div key={toast.id} className="pointer-events-auto">
                <ToastItem toast={toast} onRemove={removeToast} />
              </div>
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');

  return {
    success: (title: string, description?: string, duration?: number) =>
      ctx.addToast({ type: 'success', title, description, duration }),
    error: (title: string, description?: string, duration?: number) =>
      ctx.addToast({ type: 'error', title, description, duration }),
    warning: (title: string, description?: string, duration?: number) =>
      ctx.addToast({ type: 'warning', title, description, duration }),
    info: (title: string, description?: string, duration?: number) =>
      ctx.addToast({ type: 'info', title, description, duration }),
  };
};
