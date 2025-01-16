"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const path = usePathname();

  useEffect(() => {
    const { WOW } = require("wowjs");
    const wow = new WOW({
      live: false,
      mobile: false,
    });
    wow.init();
  }, [path]);

  return children;
}
