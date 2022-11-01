import { Config } from "tailwindcss";

const colors = require("tailwindcss/colors");

export default <Config>{
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    safelist: [
        {
            pattern:
                /bg-(pink|purple|indigo|sky|teal|green|yellow|orange|gray|primary)-(100|300|600|900)/,
            variants: ["dark"],
        },
        {
            pattern:
                /text-(pink|purple|indigo|sky|teal|green|yellow|orange|gray|primary)-(50|800|900)/,
            variants: ["dark"],
        },
    ],
    darkMode: "media",
    theme: {
        colors: {
            transparent: colors.transparent,
            black: colors.black,
            gray: colors.zinc,
            white: colors.white,
            success: colors.emerald,
            danger: colors.rose,
            primary: colors.green,

            pink: colors.pink,
            purple: colors.purple,
            indigo: colors.indigo,
            sky: colors.sky,
            teal: colors.teal,
            green: colors.green,
            yellow: colors.yellow,
            orange: colors.orange,
        },
        minWidth: {
            0: "0",
            "1/4": "25vw",
            "1/2": "50vw",
            "3/4": "75vw",
            full: "100%",
        },
        minHeight: {
            "4rem": "4rem",
        },
        extend: {
            gridTemplateColumns: {
                "table-4": "minmax(50%, 4fr) repeat(3, minmax(7%, 1fr))",
                "table-4-sm": "minmax(60vw, 4fr) repeat(3, minmax(128px, 3fr))",
                "table-5":
                    "minmax(50%, 4fr) minmax(7%, 2fr) minmax(13%, 3fr) repeat(2, minmax(5%, 1fr))",
                "table-5-sm":
                    "minmax(60vw, 4fr) minmax(96px, 2fr) minmax(128px, 3fr) repeat(2, minmax(64px, 1fr))",
            },
        },
    },
    variants: {
        extend: {
            dropShadow: ["dark"],
        },
    },
    plugins: [
        require("@tailwindcss/aspect-ratio"),
        require("@tailwindcss/typography"),
        require("@tailwindcss/forms"),
    ],
};
