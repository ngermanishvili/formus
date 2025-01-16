import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import Hero from "@/components/homes/home-5/Hero";
import Faq from "@/components/homes/home-5/Faq";
import DownloadApp from "@/components/common/downloadApp/DownloadApp";

export default function Page() {
  return (
    <>
      <Header1 />
      <MobailHeader1 />
      <main className="main">
        <Hero />
        <Faq />
        <DownloadApp />
      </main>
      <Footer1 />
    </>
  );
}
