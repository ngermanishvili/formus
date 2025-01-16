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
    <html>
      <head></head>
      <body className={DM_SansFont.variable}>{children}</body>
    </html>
  );
}
