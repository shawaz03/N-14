"use client";

import { useState, useCallback } from "react";
import { ToastMessage, ToastType } from "../types/toast";

export interface UseToastReturn {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "success",
      title?: string,
      duration = 3000
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newToast: ToastMessage = {
        id,
        message,
        type,
        title: title || (type === "success" ? "STATUS CONFIRMED" : type.toUpperCase()),
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  return {
    toasts,
    showToast,
    dismissToast,
  };
}
