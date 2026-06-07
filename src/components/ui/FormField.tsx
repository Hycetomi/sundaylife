import { cn } from '@/lib/utils';

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export const FormField = ({ label, error, hint, required, children, className, htmlFor }: FormFieldProps) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    {label && (
      <label
        htmlFor={htmlFor}
        className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50"
      >
        {label}
        {required && <span className="text-hot-red ml-0.5">*</span>}
      </label>
    )}
    {children}
    {error && <p className="font-general text-xs text-hot-red">{error}</p>}
    {hint && !error && <p className="font-general text-xs text-pink-swirl/30">{hint}</p>}
  </div>
);
