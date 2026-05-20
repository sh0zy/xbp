import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "../../lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg" | "xl";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-soft",
  secondary:
    "bg-white text-brand-600 border border-brand-200 hover:bg-brand-50 dark:bg-ink-800 dark:text-brand-200 dark:border-ink-700 dark:hover:bg-ink-700",
  ghost:
    "bg-transparent text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800",
  danger:
    "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 shadow-soft",
};

const sizeClass: Record<Size, string> = {
  md: "h-11 px-4 text-base rounded-2xl",
  lg: "h-14 px-6 text-lg rounded-2xl",
  xl: "h-20 px-6 text-2xl rounded-3xl",
};

export function PrimaryButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  type = "button",
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        "inline-flex items-center justify-center font-semibold tap-highlight-none transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100",
        variantClass[variant],
        sizeClass[size],
        fullWidth ? "w-full" : "",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
