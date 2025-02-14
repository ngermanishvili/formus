// app/[locale]/(blogs)/media/page.jsx
import Blogs1 from "@/components/blog/Blogs1";
import BreadCumb from "@/components/blog/BreadCumb";
import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
import Image from "next/image";
import NewsShape1 from "@/public/assets/shapes/home/3.png";
import NewsShape2 from "@/public/assets/shapes/news/1.png";

export const metadata = {
  title: "FORMUS | ფორმუსი - სამშენებლო კომპანია ",
  description:
    "ფორმუსი სამშენებლო კომპანია, რომელიც გთავაზობთ სრულყოფილ სამშენებლო მომსახურებას და სამშენებლო პროექტებს სრულყოფილი სამშენებლო მომსახურების სფეროში.",
};
export default function page() {
  return (
    <>
      <main className="main">
        <BreadCumb />
        <div className="absolute bottom-[-200px] sm:bottom-[-80px] md:bottom-[-80px] lg:top-[100px] right-0 z-0">
          <Image
            src={NewsShape2}
            alt="Decorative shape"
            width={200}
            height={200}
            className="mt-12"
          />
        </div>
        <div className="absolute bottom-[-200px] sm:bottom-[-80px] md:bottom-[-80px] lg:bottom-[600px] left-[-20px] right-0 z-0">
          <Image
            src={NewsShape1}
            alt="Decorative shape"
            width={200}
            height={200}
            className="mt-12"
          />
        </div>

        <Blogs1 />
      </main>
    </>
  );
}
