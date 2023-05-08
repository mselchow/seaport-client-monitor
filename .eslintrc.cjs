module.exports = {
    env: { browser: true, es2020: true, node: true },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:jsx-a11y/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
    ],
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
                extensions: [".js", ".jsx"],
            },
        },
    },
    plugins: ["react-refresh", "react", "import", "jsx-a11y"],
    rules: {
        "react-refresh/only-export-components": "warn",
        "react/prop-types": 0,
        "react/react-in-jsx-scope": 0,
    },
};
