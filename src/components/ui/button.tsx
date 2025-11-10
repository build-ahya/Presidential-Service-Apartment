import * as React from "react"
// Slot removed from asChild path to avoid type issues when injecting props
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-full px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const isDisabled = !!disabled || !!loading

  if (asChild) {
    // Ensure a single React element child and inject props safely
    const onlyChild = React.Children.only(children as React.ReactElement<any>)
    const content = loading ? (
      <>
        <span
          className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden="true"
        />
        {onlyChild.props?.children}
      </>
    ) : (
      onlyChild.props?.children
    )

    const mergedClassName = cn(
      buttonVariants({ variant, size, className }),
      (onlyChild.props as any)?.className
    )

    const childProps: any = {
      className: mergedClassName,
      'aria-busy': loading || undefined,
      'aria-disabled': isDisabled || undefined,
      ...props,
    }

    // Apply disabled only if the underlying element is a native button
    if (typeof onlyChild.type === 'string' && onlyChild.type === 'button') {
      childProps.disabled = isDisabled
    }

    return React.cloneElement(onlyChild, childProps, content)
  }

  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span
          className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}

export { Button, buttonVariants }
