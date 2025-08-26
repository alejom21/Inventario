/** @type {import('tailwindcss').Config} */
export const content = [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
    extend: {
        colors: {
            primary: "#2563eb",
            secondary: "#1e293b",
            accent: "#facc15",
        },
        borderRadius: {
            xl: "1rem",
            "2xl": "1.5rem",
        },
    },
};
export const plugins = [];
