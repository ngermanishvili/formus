"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Menu,
  X,
  Images,
  Folders,
  Building,
  LogOut,
  Contact2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          credentials: "include",
        });
        if (!res.ok) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      }
    };

    checkAuth();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    {
      title: "მთავარი დაფა",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },

    {
      title: "ბლოგები",
      href: "/admin/dashboard/blog",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: "სლაიდერები",
      href: "/admin/dashboard/sliders",
      icon: <Images className="w-5 h-5" />,
    },
    {
      title: "მთავარი გვერდის კონტენტი",
      href: "/admin/dashboard/hero-content",
      icon: <Images className="w-5 h-5" />,
    },
    {
      title: "პროექტები",
      href: "/admin/dashboard/projects",
      icon: <Folders className="w-5 h-5" />,
    },
    {
      title: "ჩვენ შესახებ",
      href: "/admin/dashboard/about",
      icon: <Building className="w-5 h-5" />,
    },
    {
      title: "კონტაქტი",
      href: "/admin/dashboard/contact",
      icon: <Contact2Icon className="w-5 h-5" />,
    },
    {
      title: "სოციალური ქსელები",
      href: "/admin/dashboard/social-content",
      icon: <Contact2Icon className="w-5 h-5" />,
    },
    {
      title: "გალერეა",
      href: "/admin/dashboard/gallery-photos",
      icon: <Contact2Icon className="w-5 h-5" />,
    },

    // {
    //   title: "როუტების მართვა",
    //   href: "/admin/dashboard/navigation",
    //   icon: <Navigation className="w-5 h-5" />,
    // },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Backdrop for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">ადმინ პანელი</h1>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 mx-2 px-4 py-3 rounded-lg text-sm transition-colors
                  ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              გამოსვლა
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
