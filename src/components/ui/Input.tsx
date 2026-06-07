import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, className, id, required, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50"
          >
            {label}
            {required && <span className="text-hot-red ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-pink-swirl/40 pointer-events-none flex items-center">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            className={cn(
              'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5',
              'text-pink-swirl font-general text-sm outline-none',
              'focus:border-waxy-corn/50 placeholder:text-pink-swirl/20 transition-colors',
              error  && 'border-hot-red/50',
              prefix && 'pl-9',
              suffix && 'pr-9',
              className,
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-pink-swirl/40 flex items-center">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="font-general text-xs text-hot-red">{error}</p>}
        {hint && !error && <p className="font-general text-xs text-pink-swirl/30">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
