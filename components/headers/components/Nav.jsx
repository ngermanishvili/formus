"use client";
import { menuItems } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  return (
    <>
      {menuItems.map((elm, i) => (
        <li key={i} className="has-children">
          <a
            className={`active ${
              elm.subMenu.some(
                (elm3) => pathname.split("/")[1] == elm3.link.split("/")[1]
              )
                ? "active-link"
                : ""
            } `}
          >
            {elm.title}
          </a>
          <ul className="sub-menu">
            {elm.subMenu.map((elm2, i2) => (
              <li key={i2}>
                <Link
                  className={
                    pathname.split("/")[1] == elm2.link.split("/")[1]
                      ? "active-link"
                      : ""
                  }
                  href={elm2.link}
                >
                  {elm2.title}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
      <li>
        <Link href="/media">Media</Link>
      </li>
      <li>
        <Link href="/about-formus">About</Link>
      </li>
      <li>
        <Link href="/projects">Projects</Link>
      </li>

      <li>
        <Link href="/contact">Contact</Link>
      </li>
    </>
  );
}
