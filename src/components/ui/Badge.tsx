import { cn } from '@/lib/utils';

const VARIANTS = {
  default:  'bg-white/10 text-pink-swirl/70',
  success:  'bg-fluorescence/15 text-fluorescence',
  warning:  'bg-waxy-corn/15 text-waxy-corn',
  danger:   'bg-hot-red/15 text-hot-red',
  info:     'bg-astral-blue/20 text-sky-300',
  blue:     'bg-night-blue/30 text-blue-300',
  muted:    'bg-white/5 text-pink-swirl/40',
};

export interface BadgeProps {
  label: string;
  variant?: keyof typeof VARIANTS;
  className?: string;
  dot?: boolean;
}

export const Badge = ({ label, variant = 'default', className, dot }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full',
      'font-cabinet font-bold text-[10px] uppercase tracking-wider',
      VARIANTS[variant],
      className,
    )}
  >
    {dot && (
      <span className={cn('w-1.5 h-1.5 rounded-full bg-current')} />
    )}
    {label}
  </span>
);
