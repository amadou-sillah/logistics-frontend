import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useState } from 'react';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto bg-secondary-50 p-4 sm:p-6 dark:bg-secondary-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
