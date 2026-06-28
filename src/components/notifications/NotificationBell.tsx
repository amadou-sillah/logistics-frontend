import { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: Notification) => !n.read).length);
    } catch (err) {
      // silent fail
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && <span className="absolute top-1 right-1 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">{unreadCount}</span>}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-800 rounded-xl shadow-xl border border-secondary-200 dark:border-secondary-700 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-secondary-500">No notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`p-4 border-b border-secondary-100 dark:border-secondary-700 ${!n.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-secondary-500">{n.message}</p>
                    <p className="text-xs text-secondary-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.read && <button onClick={() => markAsRead(n.id)} className="text-primary-600 hover:text-primary-700"><Check className="h-4 w-4" /></button>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
