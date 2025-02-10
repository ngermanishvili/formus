"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HeroContentPage() {
  const [heroContent, setHeroContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/hero-content");
        const data = await res.json();
        setHeroContent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hero კონტენტი</h1>
        <Link href="/admin/dashboard/hero-content/create">
          <Button>დამატება</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>სურათი</TableHead>
            <TableHead>სათაური (GE)</TableHead>
            <TableHead>სათაური (EN)</TableHead>
            <TableHead>აღწერა (GE)</TableHead>
            <TableHead>აღწერა (EN)</TableHead>
            <TableHead>მოქმედებები</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {heroContent.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <img
                  src={item.image_url}
                  alt={item.title_ge}
                  className="w-20 h-20 object-cover rounded"
                />
              </TableCell>
              <TableCell>{item.title_ge}</TableCell>
              <TableCell>{item.title_en}</TableCell>
              <TableCell className="max-w-xs truncate">
                {item.description_ge}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {item.description_en}
              </TableCell>
              <TableCell>
                <Link href={`/admin/dashboard/hero-content/${item.id}/edit`}>
                  <Button variant="outline" size="sm">
                    რედაქტირება
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
