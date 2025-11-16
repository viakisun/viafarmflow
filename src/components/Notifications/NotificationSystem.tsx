import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../Icons';
import './NotificationSystem.css';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

const notificationIcons: Record<NotificationType, typeof Icons[keyof typeof Icons]> = {
  success: Icons.checkCircle,
  warning: Icons.alertTriangle,
  error: Icons.alertCircle,
  info: Icons.info,
};

const notificationColors: Record<NotificationType, string> = {
  success: 'var(--color-accent-success)',
  warning: 'var(--color-accent-warning)',
  error: 'var(--color-accent-danger)',
  info: 'var(--color-accent-primary)',
};

export function NotificationSystem({ notifications, onClose }: NotificationSystemProps) {
  return (
    <div className="notification-container">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => onClose(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({
  notification,
  onClose
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const [progress, setProgress] = useState(100);
  const duration = notification.duration || 5000;
  const Icon = notificationIcons[notification.type];
  const color = notificationColors[notification.type];

  useEffect(() => {
    if (duration <= 0) return;

    const interval = 50; // Update every 50ms
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement;
        if (next <= 0) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      className={`notification notification-${notification.type}`}
      initial={{ x: 400, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 400, opacity: 0, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 40,
      }}
      whileHover={{ x: -5 }}
      layout
    >
      <div className="notification-icon" style={{ color }}>
        <Icon size={20} />
      </div>

      <div className="notification-content">
        <h4 className="notification-title">{notification.title}</h4>
        {notification.message && (
          <p className="notification-message">{notification.message}</p>
        )}
      </div>

      <button className="notification-close" onClick={onClose}>
        <Icons.close size={16} />
      </button>

      {duration > 0 && (
        <div className="notification-progress">
          <div
            className="notification-progress-bar"
            style={{
              width: `${progress}%`,
              background: color
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

// Global notification manager
class NotificationManager {
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private notifications: Notification[] = [];

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  add(notification: Omit<Notification, 'id'>) {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random()}`,
    };

    this.notifications = [...this.notifications, newNotification];
    this.notify();
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.notifications));
  }
}

export const notificationManager = new NotificationManager();

// Hook to use notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    return notificationManager.subscribe(setNotifications);
  }, []);

  return {
    notifications,
    addNotification: (notification: Omit<Notification, 'id'>) =>
      notificationManager.add(notification),
    removeNotification: (id: string) =>
      notificationManager.remove(id),
  };
}

// Helper functions for common notifications
export const notify = {
  success: (title: string, message?: string) =>
    notificationManager.add({ type: 'success', title, message }),

  warning: (title: string, message?: string) =>
    notificationManager.add({ type: 'warning', title, message }),

  error: (title: string, message?: string) =>
    notificationManager.add({ type: 'error', title, message }),

  info: (title: string, message?: string) =>
    notificationManager.add({ type: 'info', title, message }),
};