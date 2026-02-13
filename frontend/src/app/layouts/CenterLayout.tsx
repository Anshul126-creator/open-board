import { Outlet, NavLink, useNavigate } from 'react-router';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import {
  LayoutDashboard,
  UserPlus,
  BookMarked,
  DollarSign,
  FileCheck,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

export function CenterLayout() {
  const { logout, currentUser, centers } = useData();
  const navigate = useNavigate();

  const center = centers.find(c => c.id === currentUser?.centerId);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navItems = [
    { to: '/center', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/center/register', icon: UserPlus, label: 'Register Student' },
    { to: '/center/marks', icon: BookMarked, label: 'Enter Marks' },
    { to: '/center/payments', icon: DollarSign, label: 'Payment Tracking' },
    { to: '/center/admit-cards', icon: FileCheck, label: 'Admit Cards' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl">Center Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">{center?.name}</p>
          <p className="text-xs text-muted-foreground">{currentUser?.name}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}