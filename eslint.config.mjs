import globals from "globals";

export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            "indent": ["error", 2],
            "quotes": ["error", "single"],
            "semi": ["error", "always"],
            "no-trailing-spaces": "error",
            "eol-last": "error",
            "comma-dangle": ["error", "never"],
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "never"],
            "space-before-function-paren": ["error", "never"],
            "keyword-spacing": "error",
            "space-infix-ops": "error",
            "no-multiple-empty-lines": ["error", { "max": 2 }],
            "brace-style": ["error", "1tbs"],
            "curly": "error"
        }
    }
];
