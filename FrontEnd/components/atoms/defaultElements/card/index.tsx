"use client";

import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`border border-line bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return <div className={`mb-2 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: CardProps) {
  return <h3 className={`luca-h3 ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: CardProps) {
  return <p className={`text-sm text-mute ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`my-2 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardProps) {
  return <div className={`mt-4 ${className}`}>{children}</div>;
}
