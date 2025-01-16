import Footer9 from "@/components/footers/Footer9";
import Header8 from "@/components/headers/Header8";
import Partners from "@/components/common/partners/Partners";
import Blogs from "@/components/homes/home-9/Blogs";
import DownloadApp from "@/components/homes/home-9/DownloadApp";
import Features from "@/components/homes/home-9/Features";
import Features2 from "@/components/homes/home-9/Features2";
import Features3 from "@/components/homes/home-9/Features3";
import Feet from "@/components/homes/home-9/Feet";
import Hero from "@/components/homes/home-9/Hero";
import Process from "@/components/homes/home-9/Process";
import Service from "@/components/homes/home-9/Service";
import MobailHeader1 from "@/components/headers/MobailHeader1";
export const metadata = {
  title:
    "Home 9 || Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
  description:
    "Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
};

export default function page() {
  return (
    <>
      <Header8 /> <MobailHeader1 />
      <main className="main">
        <Hero />
        <Feet />
        <Features />
        <div className="container-sub">
          <Partners />
        </div>
        <Features2 />
        <Features3 />
        <Service />
        <Blogs />
        <Process />
        <DownloadApp />
      </main>
      <Footer9 />
    </>
  );
}
