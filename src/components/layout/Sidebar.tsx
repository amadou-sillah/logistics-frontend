
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/tracking', icon: Package, label: 'Tracking' },
  { to: '/app/admin', icon: Users, label: 'Admin' },
  { to: '/app/agent', icon: Truck, label: 'Agent' },
];

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const content = (
    <>
      <div className="flex h-16 items-center justify-between px-4 shrink-0">
        {!collapsed && (
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
            LogiTrack
          </span>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex rounded-full p-1"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
          {mobileOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              twMerge(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800',
                collapsed && 'justify-center'
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-secondary-200 p-4 dark:border-secondary-800 shrink-0">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <UserCircle className="h-8 w-8 text-secondary-400 shrink-0" />
            <div className="flex-1 truncate">
              <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
              <p className="text-xs text-secondary-500">{user?.role || 'Unknown'}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="w-full justify-center" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar – always visible on desktop, slides on mobile */}
      <div
        className={`
          fixed left-0 top-0 z-50 h-full w-72 bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-800
          flex flex-col transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto   /* <-- desktop: always visible */
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}  /* mobile: slide */
        `}
      >
        {content}
      </div>
    </>
  );
}