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
        <div className="hidden lg:block  absolute top-[100px] right-0 z-0">
          <img
            src="/assets/shapes/news/1.png"
            alt="Decorative shape"
            className="mt-12  lg:w-[150px] xl:w-[150px]  2xl:w-[200px] min-[1900px]:w-[300px] "
          />
        </div>
        <div className="hidden lg:block absolute bottom-[400px] left-[-20px] z-0">
          <img
            src="/assets/shapes/news/3.png"
            alt="Decorative shape"
            className="mt-12 lg:w-[150px] xl:w-[150px] 2xl:w-[200px] min-[1900px]:w-[300px]"
          />
        </div>

        <Blogs1 />
      </main>
    </>
  );
}
