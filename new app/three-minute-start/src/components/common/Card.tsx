import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "../../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export function Card({ children, padded = true, className, ...rest }: CardProps) {
  return (
    <div
      className={classNames(
        "rounded-2xl bg-white shadow-soft ring-1 ring-ink-100 dark:bg-ink-800 dark:ring-ink-700",
        padded ? "p-4" : "",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
