import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn"

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, ...props }, ref) => {
        return (
            <label className="relative inline-flex h-5 w-5 items-center justify-center">
                <input
                    ref={ref}
                    type="checkbox"
                    className={cn(
                        "peer h-5 w-5 appearance-none rounded border-2 border-input bg-background transision-colors focus-visible:outline-none focus-visible:ring-ring focus-visiblel:focus:ring-offset-2 checked:border-primary checked:bg-primary disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    {...props}
                />
                <Check className="pointer-events-none absolute h-3.5 w-3.5 scale-0 text-primary-foreground transition-transform peer-checked:scale-100" />
            </label>
        );
    }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };