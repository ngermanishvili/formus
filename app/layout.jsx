// app/layout.js
import { DM_Sans } from "next/font/google";
import "../public/assets/scss/style.scss";
import "./globals.css";

const DM_SansFont = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--dm-saans-font",
});

export default function RootLayout({ children }) {
  return (
    <html className={DM_SansFont.variable}>
      <body>{children}</body>
    </html>
  );
}
