import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import Hero from "@/components/homes/home-5/Hero";
import Faq from "@/components/homes/home-5/Faq";
import DownloadApp from "@/components/common/downloadApp/DownloadApp";
import Image from "next/image";
import Shape from "@/public/assets/shapes/home/3.png";

export const metadata = {
  title: "FORMUS | ფორმუსი - სამშენებლო კომპანია ",
  description:
    "ფორმუსი სამშენებლო კომპანია, რომელიც გთავაზობთ სრულყოფილ სამშენებლო მომსახურებას და სამშენებლო პროექტებს სრულყოფილი სამშენებლო მომსახურების სფეროში.",
};

export default function Page() {
  return (
    <>
      <Header1 />
      <MobailHeader1 />
      <main className="main">
        <Hero />
        <div className="relative">
          <Faq />
          <div className="absolute bottom-[-200px] sm:bottom-[-150px] md:bottom-[-180px] lg:bottom-[-200px] left-0 right-0 z-10">
            <DownloadApp />
          </div>
          <div className="absolute bottom-[-200px] sm:bottom-[-80px] md:bottom-[-80px] lg:bottom-[50px] left-[-20px] right-0 z-0">
            <Image
              src={Shape}
              alt="Decorative shape"
              width={200}
              height={200}
              className="mt-[50px]"
            />
          </div>
        </div>
      </main>
      <Footer1 />
    </>
  );
}
