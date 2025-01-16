import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import Breadcumb from "@/components/service/Breadcumb";
import Services3 from "@/components/service/Services3";

export const metadata = {
  title:
    "Service Grid 3 || Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
  description:
    "Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
};

export default function page() {
  return (
    <>
      <Header1 /> <MobailHeader1 />
      <main className="main">
        <Breadcumb />
        <Services3 />
      </main>
      <Footer1 />
    </>
  );
}
