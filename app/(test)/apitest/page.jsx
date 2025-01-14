// app/page.js
"use client";

import { Button } from "bootstrap/dist/js/bootstrap.esm";
import { useEffect, useState } from "react";

export default function Home() {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [apartments, setApartments] = useState([]);

  const changeStatusButton = (status) => {
    switch (status) {
      case "sold":
        return "text-red-500";
      case "reserved":
        return "text-yellow-500";
      case "available":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  // ბლოკების წამოღება
  useEffect(() => {
    fetch("/api/buildings")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setBlocks(data.data);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // ბინების წამოღება
  useEffect(() => {
    if (selectedBlock) {
      fetch(`/api/buildings/${selectedBlock}/apartments`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setApartments(data.data);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedBlock]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">ბინების ძებნა</h1>

      {/* ბლოკების სია */}
      <div className="mb-4">
        {blocks.map((block) => (
          <button
            key={block.block_id}
            onClick={() => setSelectedBlock(block.block_id)}
            className={`mr-2 p-2 ${
              selectedBlock === block.block_id
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {block.block_name}
          </button>
        ))}
      </div>

      {/* ბინების სია */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apartments.map((apt) => (
          <div key={apt.apartment_id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-bold">ბინა {apt.apartment_number}</h2>
            <p>სართული: {apt.floor}</p>
            <p>საერთო ფართი: {apt.total_area} მ²</p>
            {apt.living_room_area && <p>მისაღები: {apt.living_room_area} მ²</p>}
            {apt.bedroom_area && <p>საძინებელი: {apt.bedroom_area} მ²</p>}
            {apt.status === "sold" && <p className="text-red-500">გაყიდულია</p>}
            {apt.status === "reserved" && (
              <p className="text-yellow-500">დაჯავშნილია</p>
            )}
            {apt.status === "available" && (
              <p className="text-green-500">ხელმისაწვდომია</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
