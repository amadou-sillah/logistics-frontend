import { Bell, Search, User, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { useSocketIO } from '../../hooks/useWebSocket';
import { useNavigate } from 'react-router-dom';

export default function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Real-time notifications via Socket.IO
  const { messages } = useSocketIO('notification');
  useEffect(() => {
    if (messages.length) {
      setNotifications((prev) => [...prev, ...messages]);
    }
  }, [messages]);

  // Fetch initial notifications
  useEffect(() => {
    api.get('/notifications')
      .then((res) => setNotifications(res.data))
      .catch(console.error);
  }, []);

  // Search handler with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          const res = await api.get(`/search?q=${searchQuery}`);
          setSearchResults(res.data);
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search failed', error);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-secondary-200 bg-white/80 px-6 backdrop-blur-sm dark:border-secondary-800 dark:bg-secondary-900/80">
      <div className="flex flex-1 items-center" ref={searchRef}>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Search shipments, orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
            className="w-full rounded-lg border border-secondary-200 bg-secondary-50 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
          />
          <AnimatePresence>
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-full mt-2 max-h-64 overflow-y-auto rounded-lg border border-secondary-200 bg-white shadow-lg dark:border-secondary-700 dark:bg-secondary-900"
              >
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="cursor-pointer px-4 py-2 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                    onClick={() => {
                      navigate(`/app/tracking/${item.id}`);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                  >
                    <p className="text-sm font-medium">{item.trackingNumber}</p>
                    <p className="text-xs text-secondary-500">{item.customer}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full p-2"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 rounded-xl border border-secondary-200 bg-white p-4 shadow-lg dark:border-secondary-700 dark:bg-secondary-900"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Notifications</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNotifications([])}
                    className="text-xs text-secondary-400"
                  >
                    Clear all
                  </Button>
                </div>
                <div className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-secondary-400">No new notifications</p>
                  ) : (
                    notifications.slice(0, 10).map((notif, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-secondary-50 p-2 text-sm dark:bg-secondary-800"
                      >
                        {notif.message}
                        <span className="ml-2 text-xs text-secondary-400">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button variant="ghost" size="sm" className="rounded-full p-2">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}