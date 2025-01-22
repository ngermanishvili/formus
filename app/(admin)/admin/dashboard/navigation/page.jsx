// app/(admin)/admin/dashboard/navigation/page.jsx
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

async function getNavigationData() {
  try {
    const host = headers().get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const res = await fetch(`${protocol}://${host}/api/navigation`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response:", res); // Add this debug log

    if (!res.ok) {
      console.error("Response not OK:", await res.text());
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    console.log("Fetched data:", data); // Add this debug log
    return data.data || [];
  } catch (error) {
    console.error("Error in getNavigationData:", error);
    return [];
  }
}

export default async function NavigationPage() {
  const routes = await getNavigationData();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ნავიგაციის მართვა</h1>
        <Link href="/admin/dashboard/navigation/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            დამატება
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left">გზა (Path)</th>
                <th className="px-6 py-3 text-left">ქართული</th>
                <th className="px-6 py-3 text-left">ინგლისური</th>
                <th className="px-6 py-3 text-left">სტატუსი</th>
                <th className="px-6 py-3 text-left">მოქმედება</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {routes && routes.length > 0 ? (
                routes.map((route) => (
                  <tr key={route.id}>
                    <td className="px-6 py-4">{route.path}</td>
                    <td className="px-6 py-4">{route.translations.ka}</td>
                    <td className="px-6 py-4">{route.translations.en}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          route.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {route.is_active ? "აქტიური" : "არააქტიური"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/dashboard/navigation/${route.id}/edit`}
                      >
                        <Button variant="outline" size="sm">
                          რედაქტირება
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    მონაცემები არ მოიძებნა
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
