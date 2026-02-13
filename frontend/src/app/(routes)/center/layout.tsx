'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/app/contexts/DataProvider';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  UserPlus,
  BookMarked,
  DollarSign,
  FileCheck,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

export default function CenterLayout({ children }: { children: React.ReactNode }) {
  const { logout, currentUser, centers } = useData();
  const router = useRouter();

  const center = centers.find(c => c.id === currentUser?.centerId);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const navItems = [
    { href: '/center', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/center/register', icon: UserPlus, label: 'Register Student' },
    { href: '/center/marks', icon: BookMarked, label: 'Enter Marks' },
    { href: '/center/payments', icon: DollarSign, label: 'Payment Tracking' },
    { href: '/center/admit-cards', icon: FileCheck, label: 'Admit Cards' }
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
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
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
        {children}
      </main>
    </div>
  );
}
