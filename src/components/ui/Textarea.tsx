import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, required, rows = 3, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={inputId}
          required={required}
          rows={rows}
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 resize-none',
            'text-pink-swirl font-general text-sm outline-none',
            'focus:border-waxy-corn/50 placeholder:text-pink-swirl/20 transition-colors',
            error && 'border-hot-red/50',
            className,
          )}
          {...props}
        />
        {error && <p className="font-general text-xs text-hot-red">{error}</p>}
        {hint && !error && <p className="font-general text-xs text-pink-swirl/30">{hint}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
