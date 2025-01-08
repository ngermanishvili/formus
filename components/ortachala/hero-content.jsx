"use client";
import Image from "next/image";

const features = [
  {
    id: 1,
    icon: "/icon1.png",
    title: "Feature 1",
    description: "Description 1",
  },
  {
    id: 2,
    icon: "/icon2.png",
    title: "Feature 2",
    description: "Description 2",
  },
  {
    id: 3,
    icon: "/icon3.png",
    title: "Feature 3",
    description: "Description 3",
  },
  {
    id: 4,
    icon: "/icon4.png",
    title: "Feature 4",
    description: "Description 4",
  },
];

export default function HeroSectionContent() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Content */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Main Title Here
          </h1>
          <p className="text-lg text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates,
            quisquam. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptates, quisquam. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Voluptates, quisquam. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Voluptates, quisquam. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Voluptates, quisquam.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates,
            quisquam. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptates, quisquam. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Voluptates, quisquam.
          </p>
        </div>

        {/* Right Grid */}
        <div className="lg:w-1/2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
