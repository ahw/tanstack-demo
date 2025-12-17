import classNames from "classnames";
import type { ReactNode } from "react";

export function FormGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={classNames("flex flex-col gap-1", className)}>
      {children}
    </div>
  );
}
