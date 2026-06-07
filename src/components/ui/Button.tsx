import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const VARIANTS = {
  primary:   'bg-waxy-corn text-bitter-liquorice hover:shadow-[0_0_16px_rgba(247,181,0,0.35)]',
  secondary: 'border border-white/10 text-pink-swirl/70 hover:bg-white/5 hover:text-pink-swirl',
  ghost:     'text-pink-swirl/60 hover:text-pink-swirl hover:bg-white/5',
  danger:    'bg-hot-red/10 text-hot-red border border-hot-red/20 hover:bg-hot-red/20',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 text-base rounded-xl',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  loading?: boolean;
  icon?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconEnd,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={cn(
      'inline-flex items-center justify-center gap-2 font-cabinet font-bold transition-all',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      VARIANTS[variant],
      SIZES[size],
      className,
    )}
  >
    {loading
      ? <Loader2 size={14} className="animate-spin flex-shrink-0" />
      : icon && <span className="flex-shrink-0 flex items-center">{icon}</span>}
    {children}
    {!loading && iconEnd && <span className="flex-shrink-0 flex items-center">{iconEnd}</span>}
  </button>
);
