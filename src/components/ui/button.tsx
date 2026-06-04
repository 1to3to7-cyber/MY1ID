"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rwanda-blue focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-rwanda-blue text-white hover:bg-rwanda-blue/90 shadow-lg shadow-rwanda-blue/20",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline:
          "border border-glass-border bg-glass text-white hover:bg-glass-hover",
        secondary:
          "bg-dark-800 text-white hover:bg-dark-700 border border-glass-border",
        ghost: "text-dark-300 hover:text-white hover:bg-glass-hover",
        link: "text-rwanda-blue underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-rwanda-green via-rwanda-yellow to-rwanda-blue text-white font-semibold hover:opacity-90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
