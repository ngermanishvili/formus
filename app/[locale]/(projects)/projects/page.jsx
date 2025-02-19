import Breadcumb from "@/components/service/Breadcumb";
import Services1 from "@/components/service/Services1";
import NewsShape1 from "@/public/assets/shapes/home/3.png";
import NewsShape2 from "@/public/assets/shapes/news/1.png";
import Image from "next/image";

export const metadata = {
  title: "FORMUS | პროექტები - სამშენებლო კომპანია ",
  description:
    "ფორმუსი სამშენებლო კომპანია, რომელიც გთავაზობთ სრულყოფილ სამშენებლო მომსახურებას და სამშენებლო პროექტებს სრულყოფილი სამშენებლო მომსახურების სფეროში.",
};

export default function Page() {
  return (
    <>
      <main className="main">
        <Breadcumb />
        <div className="hidden lg:block absolute top-[100px] right-0 z-0">
          {" "}
          {/* დავამატეთ hidden და lg:block */}
          <Image
            src={NewsShape2}
            alt="Decorative shape"
            width={200}
            height={200}
            className="mt-12"
          />
        </div>
        <div className="hidden lg:block absolute bottom-[600px] left-[-20px] z-0">
          {" "}
          {/* დავამატეთ hidden და lg:block */}
          <Image
            src={NewsShape1}
            alt="Decorative shape"
            width={200}
            height={200}
            className="mt-12"
          />
        </div>
        <Services1 />
      </main>
    </>
  );
}
