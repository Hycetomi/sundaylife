import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BellOff, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface Props {
  onClose: () => void;
}

const NotificationPanel = ({ onClose }: Props) => {
  const { notifications, loading, markRead, markAllRead } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      key="notif-panel"
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-80 bg-[#1c3828] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="font-cabinet font-bold text-sm text-pink-swirl uppercase tracking-wider">Notifications</span>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-pink-swirl/50 hover:text-waxy-corn transition-colors font-general"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-2">
            {[1, 2].map(i => <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse" />)}
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center py-10 text-pink-swirl/30">
            <BellOff size={28} strokeWidth={1} className="mb-2" />
            <p className="font-general text-sm">You're all caught up.</p>
          </div>
        )}

        {!loading && notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => markRead(n.id)}
            className="w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors group"
          >
            <p className="font-general text-sm text-pink-swirl/80 group-hover:text-pink-swirl">{n.message}</p>
            <p className="font-general text-xs text-pink-swirl/30 mt-0.5">
              {new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationPanel;
