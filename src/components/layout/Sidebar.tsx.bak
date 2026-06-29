import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  UserCircle,
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

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      className="relative flex h-full flex-col border-r border-secondary-200 bg-white dark:border-secondary-800 dark:bg-secondary-900"
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
            LogiTrack
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-full p-1"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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

      <div className="border-t border-secondary-200 p-4 dark:border-secondary-800">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <UserCircle className="h-8 w-8 text-secondary-400" />
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
    </motion.aside>
  );
}
