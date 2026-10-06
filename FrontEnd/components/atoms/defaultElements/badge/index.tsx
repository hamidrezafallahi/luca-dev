"use client";

import * as React from 'react';

import { cn } from '@/lib/utils'; // اگر از کلاس‌های ترکیبی استفاده می‌کنید

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | "accent";
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  default: "border border-[#c9c9c4] bg-paper text-mute",
  destructive: "border border-error text-error bg-white",
  outline: "border border-ink text-ink bg-white",
  secondary: "border border-line bg-white text-ink",
  success: "border border-ink bg-ink text-white",
  warning: "border border-[#c9c9c4] bg-paper text-mute",
  accent: "border border-primary bg-primary text-white",
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 min-h-[26px] font-medium text-xs whitespace-nowrap",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";
