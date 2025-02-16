// app/[locale]/layout.js
"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import Providers from "@/components/progressbar/progress-bar";
import StickySocial from "@/components/socials/sticky-socials";
import { firaGO } from "./fonts";
import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";

export default function LocaleLayout({ children, params: { locale } }) {
  const [messages, setMessages] = useState({});
  const path = usePathname();

  useEffect(() => {
    const loadResources = async () => {
      try {
        const messages = await import(`../messages/${locale}.json`);
        setMessages(messages.default);

        if (typeof window !== "undefined") {
          await import("bootstrap/dist/js/bootstrap.esm");
          const { WOW } = require("wowjs");
          new WOW({
            live: false,
            mobile: false,
          }).init();
        }
      } catch (error) {
        console.error(`Failed to load resources: ${error}`);
      }
    };

    loadResources();
  }, [locale, path]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header5 />
      <div className={firaGO.variable}>
        <Providers>{children}</Providers>
        <StickySocial />
        <Toaster />
        <Footer1 />
      </div>
    </NextIntlClientProvider>
  );
}
