module.exports = {
    env: { browser: true, es2020: true, node: true },
    extends: [
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:jsx-a11y/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "next/core-web-vitals",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: { version: "detect" },
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
            typescript: {
                alwaysTryTypes: true,
            },
        },
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
            project: ["./tsconfig.json"],
        },
    },
    plugins: [
        "react-refresh",
        "react",
        "import",
        "jsx-a11y",
        "@typescript-eslint",
    ],
    rules: {
        "react-refresh/only-export-components": "warn",
        "react/prop-types": 0,
        "react/react-in-jsx-scope": 0,
        "import/no-unresolved": "error",
        "@typescript-eslint/no-empty-interface": 0,
        "@typescript-eslint/no-var-requires": 0,
        "import/order": [
            "error",
            {
                groups: [
                    "type",
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                    "object",
                ],
                "newlines-between": "always",
                alphabetize: {
                    order: "asc",
                    caseInsensitive: true,
                },
            },
        ],
    },
};
