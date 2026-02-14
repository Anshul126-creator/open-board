import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import {
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  Send,
  LogOut,
  Menu
} from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { useIsMobile } from '../components/ui/use-mobile';

export function AdminLayout() {
  const { logout, currentUser } = useData();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/centers', icon: Building2, label: 'Centers' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/subjects', icon: BookOpen, label: 'Subjects' },
    { to: '/admin/sessions', icon: Calendar, label: 'Sessions' },
    { to: '/admin/fees', icon: DollarSign, label: 'Fee Structure' },
    { to: '/admin/timetables', icon: FileText, label: 'Timetables' },
    { to: '/admin/results', icon: Send, label: 'Publish Results' }
  ];

  const renderNavLinks = () => (
    <nav className="flex-1 space-y-1 overflow-y-auto p-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
          onClick={() => {
            if (isMobile) {
              setIsSidebarOpen(false);
            }
          }}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-xl">Admin Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">{currentUser?.name}</p>
      </div>
      {renderNavLinks()}
      <div className="border-t border-gray-200 p-4">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="flex w-full flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Admin Panel</p>
            <p className="text-base font-semibold">{currentUser?.name}</p>
          </div>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-r-0 p-0">
              {sidebarContent}
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
