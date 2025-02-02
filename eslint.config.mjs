import tsParser from "@typescript-eslint/parser";

export default [
    {
        files: ["src/**/*.ts", "src/**/*.tsx"],
        languageOptions: {
            parser: tsParser,
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];
