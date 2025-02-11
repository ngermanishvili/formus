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

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/contactinfo");
        const data = await res.json();
        setContactInfo([data.data]); // wrapping in array since we expect single object
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
        <h1 className="text-2xl font-bold">საკონტაქტო ინფორმაცია</h1>
        <Link href="/admin/dashboard/contact/create">
          <Button>დამატება</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>მისამართი (ქართულად)</TableHead>
            <TableHead>მისამართი (ინგლისურად)</TableHead>
            <TableHead>ტელეფონი</TableHead>
            <TableHead>ელ-ფოსტა</TableHead>
            <TableHead>რუკის URL</TableHead>
            <TableHead>მოქმედებები</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contactInfo.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.address_line_ge}</TableCell>
              <TableCell>{item.address_line_en}</TableCell>
              <TableCell>{item.phone_number}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell className="max-w-xs truncate">
                {item.map_url}
              </TableCell>
              <TableCell>
                <Link href={`/admin/dashboard/contact/${item.id}/edit`}>
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
