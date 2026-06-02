import { NavLink } from 'react-router-dom';
import { CheckSquare, Inbox, BookOpen, Home, LogOut, X, Church, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

interface NavItem {
  label: string;
  href: string;
  Icon: React.ElementType;
  minRole: Role;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'My Tasks', href: '/dashboard', Icon: CheckSquare, minRole: 'Volunteer' },
  { label: 'Triage', href: '/dashboard/triage', Icon: Inbox, minRole: 'Lead' },
  { label: 'Lifehouse', href: '/dashboard/lifehouse', Icon: Church, minRole: 'Lead' },
  { label: 'Knowledge Base', href: '/dashboard/spaces', Icon: BookOpen, minRole: 'Volunteer' },
  { label: 'Admin', href: '/dashboard/admin', Icon: ShieldCheck, minRole: 'Admin' },
];

const ROLE_LEVEL: Record<Role, number> = { Volunteer: 0, Lead: 1, Admin: 2 };

interface Props {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: Props) => {
  const { profile, signOut } = useAuth();

  const initials = profile?.full_name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?';

  const visibleItems = NAV_ITEMS.filter(item =>
    (ROLE_LEVEL[profile?.role ?? 'Volunteer']) >= ROLE_LEVEL[item.minRole]
  );

  return (
    <div className="flex flex-col h-full bg-bitter-liquorice">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
        <span className="font-cabinet font-black text-xl text-pink-swirl uppercase tracking-wider">
          SundayLife
        </span>
        {onClose && (
          <button onClick={onClose} className="text-pink-swirl/60 hover:text-pink-swirl md:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Back to public site */}
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-pink-swirl/50 hover:text-pink-swirl/80 hover:bg-white/5 transition-colors font-general text-sm"
        >
          <Home size={18} />
          Public Site
        </NavLink>

        <div className="h-px bg-white/10 my-3" />

        {visibleItems.map(({ label, href, Icon }) => (
          <NavLink
            key={href}
            to={href}
            end={href === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl font-general text-sm transition-all duration-150',
                isActive
                  ? 'bg-waxy-corn/15 text-waxy-corn font-medium'
                  : 'text-pink-swirl/70 hover:text-pink-swirl hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-waxy-corn' : ''} />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-waxy-corn"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-4 py-4 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-waxy-corn flex items-center justify-center flex-shrink-0">
            <span className="font-cabinet font-bold text-sm text-bitter-liquorice">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-general text-sm text-pink-swirl truncate">{profile?.full_name}</p>
            <p className="font-general text-xs text-pink-swirl/50 truncate">{profile?.role}</p>
          </div>
          <button
            onClick={signOut}
            className="text-pink-swirl/40 hover:text-pink-swirl transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
