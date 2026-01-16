import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4",
  default: "h-8 w-8",
  lg: "h-12 w-12",
};

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
      </div>
    );
  }
);
Loader.displayName = "Loader";

export { Loader };
