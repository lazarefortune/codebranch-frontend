import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface ErrorMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

const ErrorMessage = React.forwardRef<HTMLDivElement, ErrorMessageProps>(
  ({ className, message, children, ...props }, ref) => {
    if (!message && !children) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 text-base text-destructive",
          className
        )}
        {...props}
      >
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{message || children}</span>
      </div>
    );
  }
);
ErrorMessage.displayName = "ErrorMessage";

export { ErrorMessage };
