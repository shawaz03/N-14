export type ToastType = "success" | "info" | "error" | "warning";

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}
