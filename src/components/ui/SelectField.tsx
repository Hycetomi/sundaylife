import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, hint, options, placeholder, className, id, required, ...props }, ref) => {
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
        <select
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            'w-full bg-[#1c3828] border border-white/10 rounded-xl px-4 py-2.5',
            'text-pink-swirl font-general text-sm outline-none',
            'focus:border-waxy-corn/50 transition-colors',
            error && 'border-hot-red/50',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="bg-bitter-liquorice">{placeholder}</option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-bitter-liquorice">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="font-general text-xs text-hot-red">{error}</p>}
        {hint && !error && <p className="font-general text-xs text-pink-swirl/30">{hint}</p>}
      </div>
    );
  },
);
SelectField.displayName = 'SelectField';
