import { DM_Sans } from "next/font/google";
import "../public/assets/scss/style.scss";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/progressbar/progress-bar";

const DM_SansFont = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--dm-saans-font",
});

export default function RootLayout({ children }) {
  return children; // Just pass children through
}
