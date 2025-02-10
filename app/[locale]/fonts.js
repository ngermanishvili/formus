// app/[locale]/fonts.js
import localFont from "next/font/local";

export const firaGO = localFont({
    src: [
        {
            path: "../../public/fonts/firago-latin-100-normal.ttf",
            weight: "100",
            style: "normal",
        },
        {
            path: "../../public/fonts/firago-latin-100-italic.otf",
            weight: "100",
            style: "italic",
        },
        {
            path: "../../public/fonts/firago-latin-200-normal.ttf",
            weight: "200",
            style: "normal",
        },
        {
            path: "../../public/fonts/firago-latin-200-italic.ttf",
            weight: "200",
            style: "italic",
        },
        {
            path: "../../public/fonts/firago-latin-300-normal.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../../public/fonts/firago-latin-300-italic.ttf",
            weight: "300",
            style: "italic",
        },
        {
            path: "../../public/fonts/firago-latin-400-normal.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/fonts/firago-latin-400-italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../../public/fonts/firago-latin-500-normal.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../public/fonts/firago-latin-500-italic.ttf",
            weight: "500",
            style: "italic",
        },
        {
            path: "../../public/fonts/firago-latin-600-normal.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../public/fonts/firago-latin-600-italic.ttf",
            weight: "600",
            style: "italic",
        },
        {
            path: "../../public/fonts/firago-latin-700-normal.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../../public/fonts/firago-latin-700-italic.ttf",
            weight: "700",
            style: "italic",
        },
        {
            path: "../../public/fonts/firago-latin-800-normal.ttf",
            weight: "800",
            style: "normal",
        },
        {
            path: "../../public/fonts/firago-latin-800-italic.ttf",
            weight: "800",
            style: "italic",
        },
        {
            path: "../../public/fonts/firago-latin-900-normal.ttf",
            weight: "900",
            style: "normal",
        },
        {
            path: "../../public/fonts/firago-latin-900-italic.ttf",
            weight: "900",
            style: "italic",
        },
    ],
    variable: "--font-firago",
    display: "swap",
    preload: true,
});