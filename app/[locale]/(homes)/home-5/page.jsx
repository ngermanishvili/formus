import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import Partners from "@/components/common/partners/Partners";
import Blogs from "@/components/homes/home-5/Blogs";
import Cities from "@/components/homes/home-5/Cities";
import Faq from "@/components/homes/home-5/Faq";
import Feet from "@/components/homes/home-5/Feet";
import Hero from "@/components/homes/home-5/Hero";
import Service from "@/components/homes/home-5/Service";
import Testimonials from "@/components/homes/home-5/Testimonials";
import MobailHeader1 from "@/components/headers/MobailHeader1";
export const metadata = {
  title: "FORMUS | ფორმუსი - სამშენებლო კომპანია ",
  description:
    "ფორმუსი სამშენებლო კომპანია, რომელიც გთავაზობთ სრულყოფილ სამშენებლო მომსახურებას და სამშენებლო პროექტებს სრულყოფილი სამშენებლო მომსახურების სფეროში.",
};

export default function page() {
  return (
    <>
      <main className="main" style={{ maxWidth: "100vw", overflow: "hidden" }}>
        <Hero />
        <Partners />
        <div className="border-bottom"></div>
        <Feet />
        <Service />
        <Faq />
        <Cities />
        <Testimonials />
        <Blogs />
      </main>
    </>
  );
}
