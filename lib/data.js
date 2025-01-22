// lib/data.js
export async function getRoutes() {
    try {
        // აბსოლუტური URL-ის შექმნა
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_API_URL
                ? process.env.NEXT_PUBLIC_API_URL
                : 'http://localhost:3000';

        const url = new URL('/api/navigation', baseUrl).toString();

        const res = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
            // Next.js 13+ Server Components-ისთვის
            next: {
                revalidate: 0
            }
        });

        const data = await res.json();

        if (data.status === "success" && Array.isArray(data.data)) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching routes:", error);
        return [];
    }
}