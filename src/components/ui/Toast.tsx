"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Global event bus so `toast.success()` can be called anywhere
type ToastListener = (toast: Omit<ToastItem, "id">) => void;
type DismissListener = (id?: string) => void;

const listeners: Set<ToastListener> = new Set();
const dismissListeners: Set<DismissListener> = new Set();

export const toast = {
  success: (title: string, description?: string, duration?: number) => {
    listeners.forEach((listener) =>
      listener({ type: "success", title, description, duration }),
    );
  },
  error: (title: string, description?: string, duration?: number) => {
    listeners.forEach((listener) =>
      listener({ type: "error", title, description, duration }),
    );
  },
  warning: (title: string, description?: string, duration?: number) => {
    listeners.forEach((listener) =>
      listener({ type: "warning", title, description, duration }),
    );
  },
  info: (title: string, description?: string, duration?: number) => {
    listeners.forEach((listener) =>
      listener({ type: "info", title, description, duration }),
    );
  },
  dismiss: (id?: string) => {
    dismissListeners.forEach((listener) => listener(id));
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toastData: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toastData, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  useEffect(() => {
    const handleAdd = (toastData: Omit<ToastItem, "id">) => {
      addToast(toastData);
    };

    const handleDismiss = (id?: string) => {
      if (id) {
        removeToast(id);
      } else {
        clearToasts();
      }
    };

    listeners.add(handleAdd);
    dismissListeners.add(handleDismiss);

    return () => {
      listeners.delete(handleAdd);
      dismissListeners.delete(handleDismiss);
    };
  }, [addToast, removeToast, clearToasts]);

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, clearToasts }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return { ...context, toast };
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2.5 pointer-events-none px-4 sm:bottom-6 sm:right-6 sm:px-0"
    >
      {toasts.map((toastItem) => (
        <ToastCard
          key={toastItem.id}
          toast={toastItem}
          onDismiss={() => onDismiss(toastItem.id)}
        />
      ))}
    </div>
  );
}

const TOAST_STYLES: Record<
  ToastType,
  {
    icon: typeof CheckCircle2;
    iconClass: string;
    borderClass: string;
    bgClass: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-600 bg-emerald-100/70",
    borderClass: "border-emerald-200/80",
    bgClass: "bg-white",
  },
  error: {
    icon: AlertCircle,
    iconClass: "text-rose-600 bg-rose-100/70",
    borderClass: "border-rose-200/80",
    bgClass: "bg-white",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-600 bg-amber-100/70",
    borderClass: "border-amber-200/80",
    bgClass: "bg-white",
  },
  info: {
    icon: Info,
    iconClass: "text-sky-600 bg-sky-100/70",
    borderClass: "border-sky-200/80",
    bgClass: "bg-white",
  },
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const {
    icon: Icon,
    iconClass,
    borderClass,
    bgClass,
  } = TOAST_STYLES[toast.type];
  const duration = toast.duration ?? 4500;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      role="alert"
      className={[
        "pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl shadow-slate-900/10 ring-1 ring-black/5 transition-all duration-300 backdrop-blur-md animate-in slide-in-from-bottom-5",
        bgClass,
        borderClass,
      ].join(" ")}
    >
      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
          iconClass,
        ].join(" ")}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>

      <div className="flex-1 pt-0.5">
        <p className="text-sm font-semibold text-slate-900 leading-snug">
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            {toast.description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Close notification"
        className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
