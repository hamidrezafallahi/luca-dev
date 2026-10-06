// import { forwardRef } from 'react';

// import { IProps } from './type';

// const CustomButton = forwardRef<HTMLButtonElement, IProps>(
//   ({ model = "ghost", className, ...props }, ref) => {
//     const defaultClassName = `rounded-lg py-3 px-5 font-medium text-nowrap
//       ${
//         model === "primary"
//           ? "bg-blue-blue text-white "
//           : model === "ghost"
//           ? " border border-white text-white "
//           : model === "lightBlue"
//           ? "border border-blue-blueBorder text-blue-blue4 text-sm bg-[linear-gradient(180deg,_rgba(255,246,239,0.76)_0%,_rgba(143,215,235,0.08)_100%)]"
//           : " font-bold text-white"
//       }
//       ${className}`;

//     return <button ref={ref} {...props} className={defaultClassName} />;
//   }
// );

// CustomButton.displayName = "CustomButton"; // برای devtools

// export default CustomButton;
import * as React from 'react';

import {
  cva,
  type VariantProps,
} from 'class-variance-authority';

import { cn } from '@lib/utils';

const buttonVariants = cva(
  "inline-flex justify-center items-center gap-2 disabled:opacity-50 focus-visible:outline-none [&_svg]:size-4 font-medium text-sm whitespace-nowrap transition-colors [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Luca: accent fill for the one primary action, ink outline for the rest
        default: "bg-primary text-white hover:brightness-110",
        destructive: "bg-error text-white hover:brightness-110",
        outline: "border border-ink bg-white text-ink hover:bg-ink hover:text-white",
        secondary: "border border-line bg-paper text-ink hover:border-ink",
        ghost: "text-ink hover:bg-paper",
        link: "text-ink underline underline-offset-[7px]",
      },
      size: {
        default: "h-11 px-[18px]",
        sm: "h-11 px-3",
        lg: "h-14 px-8 text-[15px]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp =  "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants };
