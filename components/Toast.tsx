/**
 * Toast 消息提示组件
 */

import { useToast } from "./ToastContext";
import styles from "@/styles/components/Toast.module.css";

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          <div className={styles.toastContent}>
            <span className={styles.toastMessage}>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
