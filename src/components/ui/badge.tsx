"use client";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-rwanda-blue focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-rwanda-blue/20 text-rwanda-blue",
        secondary:
          "border-transparent bg-dark-800 text-dark-300",
        destructive:
          "border-transparent bg-red-500/20 text-red-400",
        outline: "text-dark-300 border-glass-border",
        success:
          "border-transparent bg-rwanda-green/20 text-rwanda-green",
        warning:
          "border-transparent bg-rwanda-yellow/20 text-rwanda-yellow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
