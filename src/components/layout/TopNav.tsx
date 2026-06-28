import { Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationBell from '../notifications/NotificationBell';

interface TopNavProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function TopNav({ setSidebarOpen }: TopNavProps) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-secondary-200 bg-white px-4 dark:border-secondary-800 dark:bg-secondary-900 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden rounded-lg p-2 text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-secondary-900 dark:text-white">
          LogiTrack
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <ThemeToggle />
        <span className="text-sm text-secondary-500 dark:text-secondary-400">
          {user?.name || 'User'}
        </span>
      </div>
    </header>
  );
}
