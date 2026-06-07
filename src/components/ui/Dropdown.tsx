import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export type DropdownEntry = DropdownItem | { separator: true };

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownEntry[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown = ({ trigger, items, align = 'left', className }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen(v => !v)}>{trigger}</div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              'absolute top-full mt-1.5 z-50 min-w-[160px]',
              'bg-[#162e22] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1',
              align === 'right' ? 'right-0' : 'left-0',
            )}
          >
            {items.map((item, i) => {
              if ('separator' in item) {
                return <div key={i} className="my-1 border-t border-white/10" />;
              }
              return (
                <button
                  key={i}
                  disabled={item.disabled}
                  onClick={() => { item.onClick(); close(); }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-4 py-2 font-general text-sm text-left',
                    'transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
                    item.danger
                      ? 'text-hot-red hover:bg-hot-red/10'
                      : 'text-pink-swirl/70 hover:text-pink-swirl hover:bg-white/5',
                  )}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
