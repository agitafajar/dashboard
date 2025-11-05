"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

type ToastVariant = "default" | "success" | "destructive";

type ToastOptions = {
  title?: string;
  description?: string;
  duration?: number; // ms
  variant?: ToastVariant;
};

type ToastItem = ToastOptions & { id: string };

type ToastContextValue = {
  toasts: ToastItem[];
  toast: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = genId();
      const item: ToastItem = {
        id,
        title: opts.title,
        description: opts.description,
        variant: opts.variant ?? "default",
        duration: opts.duration ?? 4000,
      };
      setToasts((prev) => [...prev, item]);
      if (item.duration && item.duration > 0) {
        window.setTimeout(() => dismiss(id), item.duration);
      }
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({ toasts, toast, dismiss, clear }),
    [toasts, toast, dismiss, clear]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return { toast: ctx.toast, dismiss: ctx.dismiss, clear: ctx.clear };
}

function ToastCard({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: (id: string) => void;
}) {
  const variantStyle =
    item.variant === "destructive"
      ? "border-red-300 bg-red-50"
      : item.variant === "success"
      ? "border-green-300 bg-green-50"
      : "border-slate-200 bg-white";

  const titleColor =
    item.variant === "destructive"
      ? "text-red-700"
      : item.variant === "success"
      ? "text-green-700"
      : "text-slate-900";

  return (
    <div
      role="status"
      className={`pointer-events-auto w-80 rounded-md border shadow-sm p-3 ${variantStyle}`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          {item.title && (
            <div className={`font-medium ${titleColor}`}>{item.title}</div>
          )}
          {item.description && (
            <div className="text-sm text-slate-600">{item.description}</div>
          )}
        </div>
        <button
          type="button"
          className="ml-2 rounded p-1 text-slate-500 hover:bg-slate-100"
          onClick={() => onClose(item.id)}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function Toaster() {
  const ctx = useContext(ToastContext);
  // Render hanya di client, dan jika ada toast
  if (typeof window === "undefined" || !ctx || ctx.toasts.length === 0)
    return null;

  const container = (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {ctx.toasts.map((t) => (
        <ToastCard key={t.id} item={t} onClose={ctx.dismiss} />
      ))}
    </div>
  );

  return createPortal(container, document.body);
}
