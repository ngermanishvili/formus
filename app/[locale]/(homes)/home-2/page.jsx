import Footer2 from "@/components/footers/Footer2";
import Header2 from "@/components/headers/Header2";

import Blogs from "@/components/homes/common/blogs/Blogs";
import DownloadApp from "@/components/homes/home-2/DownloadApp";
import Facts from "@/components/homes/home-2/Facts";
import Feet from "@/components/homes/home-2/Feet";
import Hero from "@/components/homes/home-2/Hero";
import Partners from "@/components/homes/common/partners/Partners2";
import Process from "@/components/common/process/Process2";
import Service from "@/components/homes/home-2/Service";
import Testimonials from "@/components/homes/home-2/Testimonials";
import MobailHeader1 from "@/components/headers/MobailHeader1";
export const metadata = {
  title:
    "Home 2 || Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
  description:
    "Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
};

export default function page() {
  return (
    <>
      <Header2 /> <MobailHeader1 />
      <main className="main">
        <Hero />
        <Process />
        <Service />
        <Feet />
        <Facts />
        <Testimonials />
        <Blogs />
        <Partners />
        <DownloadApp />
      </main>
      <Footer2 />
    </>
  );
}
