"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import Providers from "@/components/progressbar/progress-bar";
import { DM_Sans } from "next/font/google";

const DM_SansFont = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--dm-saans-font",
});

export default function LocaleLayout({ children, params: { locale } }) {
  const [messages, setMessages] = useState({});
  const path = usePathname();

  useEffect(() => {
    // Load translations
    import(`../messages/${locale}.json`)
      .then((messages) => {
        setMessages(messages.default);
      })
      .catch(() => {
        console.error(`Failed to load messages for locale: ${locale}`);
      });

    // Bootstrap loading
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm");
    }

    // WOW.js initialization
    const { WOW } = require("wowjs");
    const wow = new WOW({
      live: false,
      mobile: false,
    });
    wow.init();
  }, [locale, path]);

  return (
    <html lang={locale}>
      <body className={DM_SansFont.variable}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
