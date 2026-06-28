import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Users, 
  Search, 
  LogOut,
  Warehouse,
  FileText,
  History,
  UserCog,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ui/ThemeToggle';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user, logout } = useAuth();

  const navLinks = [
    { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/app/tracking', icon: Search, label: 'Track Shipment' },
    { to: '/app/admin', icon: Users, label: 'Admin Panel' },
    { to: '/app/agent', icon: ClipboardList, label: 'My Tasks' },
    { to: '/app/warehouses', icon: Warehouse, label: 'Warehouses' },
    { to: '/app/agents', icon: UserCog, label: 'Manage Agents' },
    { to: '/app/reports', icon: FileText, label: 'Reports' },
    { to: '/app/audit-logs', icon: History, label: 'Audit Logs' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 transform bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center px-4 border-b border-secondary-200 dark:border-secondary-800">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">LogiTrack</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4 overflow-y-auto h-[calc(100vh-12rem)]">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-800'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-secondary-200 dark:border-secondary-800 p-4 bg-white dark:bg-secondary-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {user?.name?.[0] || 'U'}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-secondary-500">{user?.role || 'User'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
