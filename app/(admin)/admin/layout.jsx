import { DM_Sans } from "next/font/google";
import "../../../public/assets/scss/style.scss";

import "../../../app/globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/progressbar/progress-bar";

const DM_SansFont = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--dm-saans-font",
});

export default function AdminRootLayout({ children }) {
  return (
    <html lang="ka">
      <body className={DM_SansFont.variable}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
