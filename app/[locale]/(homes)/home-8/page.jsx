import Footer9 from "@/components/footers/Footer8";
import Header2 from "@/components/headers/Header2";
import Blogs from "@/components/homes/common/blogs/Blogs2";
import Cities from "@/components/homes/common/cities/Cities";
import Features from "@/components/homes/common/features/Features";
import Partners from "@/components/common/partners/Partners";
import Process from "@/components/common/process/Process";
import Facts from "@/components/homes/home-8/Facts";
import Features1 from "@/components/homes/home-8/Features";
import Feet from "@/components/homes/home-8/Feet";
import Hero from "@/components/homes/home-8/Hero";
import Services from "@/components/homes/home-8/Services";
import Testimonials from "@/components/homes/home-8/Testimonials";
import MobailHeader1 from "@/components/headers/MobailHeader1";
export const metadata = {
  title: "FORMUS | ფორმუსი - სამშენებლო კომპანია ",
  description:
    "ფორმუსი სამშენებლო კომპანია, რომელიც გთავაზობთ სრულყოფილ სამშენებლო მომსახურებას და სამშენებლო პროექტებს სრულყოფილი სამშენებლო მომსახურების სფეროში.",
};
export default function page() {
  return (
    <>
      <Header2 /> <MobailHeader1 />
      <main className="main">
        <Hero />
        <Features1 />
        <Feet />
        <Process />
        <Cities />
        <Services />
        <Features />
        <Facts />
        <Testimonials />
        <Blogs />
        {/* <div className="border-bottom"> */}
        <Partners />
        {/* </div> */}
      </main>
      <Footer9 />
    </>
  );
}
