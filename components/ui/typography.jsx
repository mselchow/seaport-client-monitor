import { cn } from "@/lib/utils";

const TypographyH3 = ({ className, children, ...props }) => (
    <h3
        className={cn(className, "scroll-m-20 text-2xl font-semibold")}
        {...props}
    >
        {children}
    </h3>
);

const TypographyH4 = ({ className, children, ...props }) => (
    <h4
        className={cn(
            className,
            "scroll-m-20 text-xl font-semibold tracking-tight"
        )}
        {...props}
    >
        {children}
    </h4>
);

const TypographySmall = ({ className, children, ...props }) => (
    <small
        className={cn(className, "text-sm font-normal leading-none")}
        {...props}
    >
        {children}
    </small>
);

export { TypographyH3, TypographyH4, TypographySmall };
