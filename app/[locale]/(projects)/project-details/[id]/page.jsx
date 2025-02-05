//app/[locale]/(services)/project-details/[id]/page.jsx
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
import DownloadApp from "@/components/common/downloadApp/DownloadApp";
import HeroOrtachala from "@/components/homes/home-5/hero-ortachala";
import HeroSectionContent from "@/components/ortachala/hero-content";
import FaqLeft from "@/components/ortachala/hero-content-faq";
import GreenSection from "@/components/ortachala/3d-photo";
import Footer1 from "@/components/footers/Footer1";

export const metadata = {
  title: "FORMUS | ფორმუსი - სამშენებლო კომპანია ",
  description:
    "ფორმუსი სამშენებლო კომპანია, რომელიც გთავაზობთ სრულყოფილ სამშენებლო მომსახურებას და სამშენებლო პროექტებს სრულყოფილი სამშენებლო მომსახურების სფეროში.",
};

export default function page() {
  return (
    <>
      <Header5 /> <MobailHeader1 />
      <main className="main" style={{ maxWidth: "100vw", overflow: "hidden" }}>
        <HeroOrtachala />
        <div className="border-bottom"></div>
        <HeroSectionContent />
        <FaqLeft />
        <GreenSection />
        <DownloadApp />
      </main>
      <Footer1 />
    </>
  );
}
