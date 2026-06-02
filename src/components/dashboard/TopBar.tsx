import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationPanel from './NotificationPanel';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':           'My Tasks',
  '/dashboard/triage':    'Triage Queue',
  '/dashboard/spaces':    'Knowledge Base',
  '/dashboard/lifehouse': 'My Lifehouse',
  '/dashboard/admin':     'Admin',
};

interface Props {
  onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: Props) => {
  const { pathname } = useLocation();
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();
  const [panelOpen, setPanelOpen] = useState(false);

  const title = PAGE_TITLES[pathname] ?? 'Dashboard';
  const initials = profile?.full_name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?';

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 flex-shrink-0 relative">
      {/* Left: mobile menu + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-pink-swirl/60 hover:text-pink-swirl"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-cabinet font-bold text-lg text-pink-swirl">{title}</h1>
      </div>

      {/* Right: notification bell + avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setPanelOpen(v => !v)}
            className="relative text-pink-swirl/60 hover:text-pink-swirl transition-colors p-1"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-hot-red rounded-full flex items-center justify-center font-cabinet font-bold text-[10px] text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {panelOpen && (
              <NotificationPanel onClose={() => setPanelOpen(false)} />
            )}
          </AnimatePresence>
        </div>

        <div className="w-8 h-8 rounded-full bg-waxy-corn flex items-center justify-center">
          <span className="font-cabinet font-bold text-xs text-bitter-liquorice">{initials}</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
