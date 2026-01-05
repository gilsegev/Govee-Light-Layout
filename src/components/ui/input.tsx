import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, suffix, ...props }, ref) => {
        return (
            <div className="relative flex w-full items-center">
                <input
                    type={type}
                    className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                        suffix && "pr-8",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {suffix && (
                    <span className="absolute right-3 text-muted-foreground text-xs pointer-events-none">
                        {suffix}
                    </span>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
