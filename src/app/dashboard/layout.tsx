import Sidebar from './Sidebar';
import { AuthProvider } from '@/lib/authContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-canvas-soft">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
