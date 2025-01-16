import FeetList2 from "@/components/fleet-list/FeetList2";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";

export const metadata = {
  title:
    "Fleet List 2 || Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
  description:
    "Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
};
export default function page() {
  return (
    <>
      <Header1 /> <MobailHeader1 />
      <main className="main">
        <FeetList2 />
      </main>
      <Footer1 />
    </>
  );
}
