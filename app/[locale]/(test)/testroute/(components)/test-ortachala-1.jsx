"use client";
import React, { useState, memo, useCallback, useTransition } from "react";
import Header1 from "@/components/headers/Header1";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

// შევქმნათ მარტივი className მერჯერი
const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const BLOCKS = {
  A: {
    id: "A",
    image: "/assets/polygon-ld1.jpg",
    title: "A ბლოკი",
    description: "ორთაჭალის A ბლოკი",
    polygons: [
      {
        title: "A-1",
        points: "925,1735 925,1982 2574,2077 2578,1779",
        status: "გაყიდულია",
        price: "1200$",
        area: "85კვ.მ",
        rooms: "3",
        floor: "5",
      },
      // დანარჩენი A ბლოკის ბინები...
    ],
  },
  B: {
    id: "B",
    image: "/assets/ortachala-mtavari.png",
    title: "B ბლოკი",
    description: "ორთაჭალის B ბლოკი",
    polygons: [
      {
        title: "კომერციული ფართი",
        points: "925,1735 925,1982 2574,2077 2578,1779",
        status: "გაყიდულია",
        price: "1500$",
        area: "120კვ.მ",
        rooms: "საოფისე",
        floor: "1",
      },
      {
        title: "სართული 2",
        points:
          "3511,1901 3503,1861 3455,1944 3388,1952 2661,1996 2661,2079 3396,2036 3455,2028",
        status: "გაყიდულია",
        price: "1300$",
        area: "75კვ.მ",
        rooms: "2",
        floor: "2",
      },
      {
        title: "სართული 3",
        points:
          "3511,1838 3499,1786 3459,1842 3205,1850 2661,1870 2661,1993 3205,1961 3459,1945",
        status: "გაყიდულია",
        price: "1250$",
        area: "80კვ.მ",
        rooms: "3",
        floor: "3",
      },
      {
        title: "სართული 4",
        points:
          "3507,1769 3499,1717 3455,1753 3249,1761 2661,1773 2661,1868 3249,1848 3459,1836",
        status: "გაყიდულია",
        price: "1400$",
        area: "85კვ.მ",
        rooms: "3",
        floor: "4",
      },
      {
        title: "სართული 5",
        points:
          "2395,1720 2613,1751 3451,1735 3507,1696 3507,1632 2613,1648 2395,1636",
        status: "გაყიდულია",
        price: "1350$",
        area: "82კვ.მ",
        rooms: "3",
        floor: "5",
      },
      {
        title: "სართული 6",
        points:
          "2383,1627 2621,1635 3455,1631 3511,1623 3511,1548 3455,1532 3205,1532 2661,1528 2383,1540",
        status: "გაყიდულია",
        price: "1280$",
        area: "78კვ.მ",
        rooms: "2",
        floor: "6",
      },
      {
        title: "სართული 7",
        points:
          "2391,1532 2613,1520 3396,1528 3511,1540 3507,1473 3459,1433 3205,1425 2617,1409 2391,1445",
        status: "გაყიდულია",
        price: "1320$",
        area: "81კვ.მ",
        rooms: "3",
        floor: "7",
      },
      {
        title: "სართული 8",
        points:
          "2391,1436 2613,1404 3447,1428 3507,1468 3507,1396 3451,1325 3201,1317 2617,1293 2391,1353",
        status: "გაყიდულია",
        price: "1380$",
        area: "84კვ.მ",
        rooms: "3",
        floor: "8",
      },
      {
        title: "სართული 9",
        points:
          "2391,1343 2629,1288 3388,1315 3455,1319 3507,1391 3511,1319 3459,1224 3392,1212 2617,1181 2391,1260",
        status: "გაყიდულია",
        price: "1420$",
        area: "87კვ.მ",
        rooms: "3",
        floor: "9",
      },
      {
        title: "სართული 10",
        points:
          "2387,1252 2621,1173 3396,1200 3455,1212 3507,1308 3511,1244 3459,1121 3396,1109 2617,1065 2387,1165",
        status: "გაყიდულია",
        price: "1450$",
        area: "89კვ.მ",
        rooms: "3",
        floor: "10",
      },
      {
        title: "სართული 11",
        points:
          "2383,1161 2617,1050 3451,1104 3507,1227 3507,1172 3455,1017 3400,991 3026,969 2625,939 2387,1065",
        status: "გაყიდულია",
        price: "1480$",
        area: "91კვ.მ",
        rooms: "3",
        floor: "11",
      },
      {
        title: "სართული 12",
        points:
          "2387,1065 2621,934 3392,985 3455,1013 3507,1164 3511,1088 3451,890 3253,878 2617,830 2383,973",
        status: "გაყიდულია",
        price: "1520$",
        area: "93კვ.მ",
        rooms: "3",
        floor: "12",
      },
      {
        title: "სართული 13",
        points:
          "2387,970 2617,819 3364,879 3455,891 3511,1073 3511,1010 3459,788 3368,780 2613,708 2383,883",
        status: "გაყიდულია",
        price: "1550$",
        area: "95კვ.მ",
        rooms: "4",
        floor: "13",
      },
      {
        title: "სართული 14",
        points:
          "2387,882 2617,703 3392,779 3455,783 3515,1013 3511,902 3455,684 3388,672 3034,632 2617,584 2383,787",
        status: "გაყიდულია",
        price: "1580$",
        area: "97კვ.მ",
        rooms: "4",
        floor: "14",
      },
      {
        title: "სართული 15",
        points:
          "2383,782 2629,584 3396,667 3455,679 3515,901 3515,857 3455,584 3360,564 3034,524 2812,496 2609,472 2383,695",
        status: "გაყიდულია",
        price: "1600$",
        area: "100კვ.მ",
        rooms: "4",
        floor: "15",
      },
    ],
  },
};

const ApartmentDialog = memo(({ isOpen, onClose, apartment }) => {
  if (!apartment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {apartment.title}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground">
                  ფართი
                </p>
                <h3 className="text-2xl font-bold mt-1">{apartment.area}</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground">
                  ფასი
                </p>
                <h3 className="text-2xl font-bold mt-1">{apartment.price}</h3>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    ოთახები
                  </p>
                  <p className="text-lg font-semibold mt-1">
                    {apartment.rooms}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    სართული
                  </p>
                  <p className="text-lg font-semibold mt-1">
                    {apartment.floor}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    სტატუსი
                  </p>
                  <Badge
                    variant={
                      apartment.status === "გაყიდულია"
                        ? "destructive"
                        : "success"
                    }
                    className="mt-1"
                  >
                    {apartment.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ApartmentDialog.displayName = "ApartmentDialog";

const Polygon = memo(({ data, isHovered, onHover, onClick }) => (
  <g>
    <polygon
      points={data.points}
      title={data.title}
      className={classNames(
        "fill-transparent stroke-transparent transition-all duration-300 cursor-pointer",
        data.status === "გაყიდულია"
          ? "hover:fill-red-500/30 hover:stroke-red-500"
          : "hover:fill-green-500/30 hover:stroke-green-500",
        "stroke-2"
      )}
      onClick={() => onClick(data)}
      onMouseEnter={() => onHover(data)}
      onMouseLeave={() => onHover(null)}
    />
    {isHovered && (
      <motion.polygon
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        points={data.points}
        className={classNames(
          "stroke-2 fill-none",
          data.status === "გაყიდულია" ? "stroke-red-500" : "stroke-green-500"
        )}
      />
    )}
  </g>
));

Polygon.displayName = "Polygon";

const InfoCard = memo(({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <Card className="w-80 backdrop-blur-sm bg-white/95 shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{data.title}</h3>
            <Badge
              variant={data.status === "გაყიდულია" ? "destructive" : "success"}
            >
              {data.status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">ფართი</p>
              <p className="font-semibold">{data.area}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ფასი</p>
              <p className="font-semibold">{data.price}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

InfoCard.displayName = "InfoCard";

const BlockImage = memo(({ block }) => (
  <motion.img
    key={block.id}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    src={block.image}
    alt={`Block ${block.id}`}
    className="w-full h-full object-contain"
  />
));

BlockImage.displayName = "BlockImage";

const OrtachalaPolygon = () => {
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState("B");
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleBlockChange = useCallback((value) => {
    startTransition(() => {
      setSelectedBlock(value);
      setHoveredPolygon(null);
      setSelectedApartment(null);
    });
  }, []);

  const handlePolygonClick = useCallback((apartment) => {
    setSelectedApartment(apartment);
  }, []);

  const currentBlock = BLOCKS[selectedBlock];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header1 />
      <div className="container mx-auto py-6">
        <Tabs
          defaultValue={selectedBlock}
          onValueChange={handleBlockChange}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            {Object.values(BLOCKS).map((block) => (
              <TabsTrigger
                key={block.id}
                value={block.id}
                className={classNames(
                  "data-[state=active]:shadow-lg",
                  isPending && "opacity-50 cursor-not-allowed"
                )}
                disabled={isPending}
              >
                {block.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.values(BLOCKS).map((block) => (
            <TabsContent key={block.id} value={block.id}>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {block.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <div className="flex-grow relative w-full">
        <AnimatePresence mode="wait">
          <BlockImage block={currentBlock} />
        </AnimatePresence>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <svg
              className="w-full h-full"
              viewBox="0 0 4496 2596"
              preserveAspectRatio="xMidYMid meet"
            >
              <AnimatePresence>
                {currentBlock.polygons.map((polygon) => (
                  <Polygon
                    key={polygon.title}
                    data={polygon}
                    isHovered={hoveredPolygon?.title === polygon.title}
                    onHover={setHoveredPolygon}
                    onClick={handlePolygonClick}
                  />
                ))}
              </AnimatePresence>
            </svg>
          </div>
        </div>
        <AnimatePresence>
          {hoveredPolygon && <InfoCard data={hoveredPolygon} />}
        </AnimatePresence>
      </div>

      <ApartmentDialog
        isOpen={!!selectedApartment}
        onClose={() => setSelectedApartment(null)}
        apartment={selectedApartment}
      />
    </div>
  );
};

export default OrtachalaPolygon;
