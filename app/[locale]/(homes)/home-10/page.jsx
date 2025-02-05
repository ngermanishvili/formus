import Footer1 from "@/components/footers/Footer1";
import Header9 from "@/components/headers/Header9";
import Blogs from "@/components/homes/common/blogs/Blogs";
import Cta from "@/components/homes/common/cta/Cta";
import Facts from "@/components/homes/home-10/Facts";
import Features from "@/components/homes/home-10/Features";
import Features2 from "@/components/homes/home-10/Features2";
import Feet from "@/components/homes/home-10/Feet";
import Hero from "@/components/homes/home-10/Hero";
import Partners from "@/components/homes/home-10/Partners";
import Process from "@/components/homes/home-10/Process";
import Services from "@/components/homes/home-10/Services";
import Testimonials from "@/components/common/testimonials/Testimonials";
import MobailHeader1 from "@/components/headers/MobailHeader1";
export const metadata = {
  title: "FORMUS | ფორმუსი - სამშენებლო კომპანია ",
  description:
    "ფორმუსი სამშენებლო კომპანია, რომელიც გთავაზობთ სრულყოფილ სამშენებლო მომსახურებას და სამშენებლო პროექტებს სრულყოფილი სამშენებლო მომსახურების სფეროში.",
};

export default function page() {
  return (
    <>
      <Header9 /> <MobailHeader1 />
      <main className="main">
        <Hero />
        <Features />
        <Feet />
        <Process />
        <Facts />
        <Services />
        <Features2 />
        <Cta />
        <Testimonials />
        <Blogs />
        <Partners />
      </main>
      <Footer1 />
    </>
  );
}
