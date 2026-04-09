import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({ label, ...props }: FormFieldProps) {
  return (
    <label className="block mb-4">
      <span className="text-sm text-text-secondary mb-1 block">{label}</span>
      <input
        {...props}
        className="w-full bg-surface-light rounded-xl px-4 py-3 text-text-primary outline-none focus:ring-2 focus:ring-primary/50 transition"
      />
    </label>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}

export function TextAreaField({ label, value, onChange, rows = 3, placeholder }: TextAreaFieldProps) {
  return (
    <label className="block mb-4">
      <span className="text-sm text-text-secondary mb-1 block">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-surface-light rounded-xl px-4 py-3 text-text-primary outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
      />
    </label>
  );
}
