import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
    {
        variants: {
            variant: {
                toggler:
                    "border border-border-color shadow-sm rounded-lg",
                primary:
                    "bg-brand text-white hover:opacity-80",
                secondary:
                    "bg-gray-brand-200 text-gray-brand-600 hover:opacity-80",
                ghost:
                    "bg-transparent"
            },
            theme: {
                light: "bg-white",
                dark: "bg-grey-400"
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                xs: "h-6 rounded-full gap-1.5 px-2 has-[>svg]:px-2.5",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-12 px-6! text-base font-medium has-[>svg]:px-4",
                icon: "size-9",
                iconSm: "h-8 w-8",
                toggler: "px-2.5 py-2.5"
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
)

const Button = ({
    className,
    variant,
    size,
    theme,
    children,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants>
) => {

    return (
        <button
            className={cn(buttonVariants({ variant, size, theme, className }))}
            {...props}
        >
            {children}
        </button>
    )
}

export { Button };