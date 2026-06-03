import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Spinner } from "@/components/ui/spinner";
import { tw } from "@/utils/tw";

export const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium text-sm outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-loading:select-none data-loading:text-transparent [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-3.5",
        withIcon: "h-9 pr-4 pl-3.5",
        icon: "size-9",
      },
      variant: {
        default:
          "border-gradient-invert bg-gradient-invert text-foreground-invert *:data-[slot=button-loading-indicator]:text-foreground-invert",
        destructive:
          "border-gradient-invert bg-destructive text-foreground-invert *:data-[slot=button-loading-indicator]:text-foreground-invert",
        "destructive-secondary":
          "border-gradient bg-destructive-gradient text-destructive-foreground *:data-[slot=button-loading-indicator]:text-destructive",
        secondary:
          "border-gradient bg-gradient text-foreground *:data-[slot=button-loading-indicator]:text-foreground",
      },
    },
  }
);

export interface ButtonProps extends useRender.ComponentProps<"button"> {
  loading?: boolean;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
}

export const Button = ({
  className,
  variant,
  size,
  render,
  children,
  loading = false,
  disabled: disabledProp,
  ...props
}: ButtonProps): React.ReactElement => {
  const isDisabled: boolean = Boolean(loading || disabledProp);
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] =
    render ? undefined : "button";

  const defaultProps = {
    children: (
      <>
        {children}
        {loading && (
          <Spinner
            className="pointer-events-none absolute"
            data-slot="button-loading-indicator"
          />
        )}
      </>
    ),
    className: tw(buttonVariants({ className, size, variant })),
    "aria-disabled": loading || undefined,
    "data-loading": loading ? "" : undefined,
    "data-slot": "button",
    disabled: isDisabled,
    type: typeValue,
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
};
