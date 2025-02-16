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
import { InitialLoading } from "./InitialLoading";

export default function LocaleLayout({ children, params: { locale } }) {
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const path = usePathname();

  useEffect(() => {
    setIsLoading(true);
    let timeoutId;

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

          // Ensure minimum 4 seconds display time for loading screen
          timeoutId = setTimeout(() => {
            setIsLoading(false);
          }, 4000);
        }
      } catch (error) {
        console.error(`Failed to load resources: ${error}`);
        setIsLoading(false);
      }
    };

    loadResources();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [locale, path]);

  return (
    <>
      {isLoading && <InitialLoading />}
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Header5 />
        <div className={firaGO.variable}>
          <Providers>{children}</Providers>
          <StickySocial />
          <Toaster />
          <Footer1 />
        </div>
      </NextIntlClientProvider>
    </>
  );
}
