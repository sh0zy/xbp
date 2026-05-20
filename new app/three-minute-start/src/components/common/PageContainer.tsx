import type { ReactNode } from "react";
import { classNames } from "../../lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({
  children,
  className,
  noPadding,
}: PageContainerProps) {
  return (
    <div
      className={classNames(
        "mx-auto w-full max-w-md flex-1",
        noPadding ? "" : "px-4 pb-28 pt-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
