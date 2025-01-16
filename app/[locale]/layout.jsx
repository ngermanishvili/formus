"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

export default function LocaleLayout({ children, params: { locale } }) {
  const [messages, setMessages] = useState({});
  const path = usePathname();

  useEffect(() => {
    // ვტვირთავთ თარგმანებს
    import(`../../messages/${locale}.json`)
      .then((messages) => {
        setMessages(messages.default);
      })
      .catch(() => {
        console.error(`Failed to load messages for locale: ${locale}`);
      });

    // Bootstrap-ის ჩატვირთვა
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm");
    }

    // WOW.js ინიციალიზაცია
    const { WOW } = require("wowjs");
    const wow = new WOW({
      live: false,
      mobile: false,
    });
    wow.init();
  }, [locale, path]);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
