const TypographyH3 = ({ children, ...props }) => (
    <h3
        className="scroll-m-20 text-2xl font-semibold tracking-tight"
        {...props}
    >
        {children}
    </h3>
);

const TypographyH4 = ({ children, ...props }) => (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight" {...props}>
        {children}
    </h4>
);

export { TypographyH3, TypographyH4 };
