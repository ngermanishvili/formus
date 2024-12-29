import Image from "next/image";
import Link from "next/link";

export default function Faq() {
  return (
    <section className="relative bg-white">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 px-12 lg:px-24 py-12">
          <h2 className="text-4xl font-bold text-black mb-6">How It Works</h2>
          <p className="text-gray-600 text-lg">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat
            nam numquam eaque vitae accusamus maxime ut quia nihil sequi dolore
            illo soluta recusandae necessitatibus, deserunt, ab, dolorum ullam
            possimus maiores?
          </p>
          <Link className="mt-8" href="/faq">
            <span className="text-lg text-white bg-black p-2 rounded-sm mt-8">
              Learn More
            </span>
          </Link>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 relative h-[600px]">
          <Image
            src="/assets/imgs/page/homepage5/banner.png"
            alt="Luxride"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
