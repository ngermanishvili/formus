import DownloadApp from "@/components/common/downloadApp/DownloadApp2";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import BreadCumbs from "@/components/otherPages/team/BreadCumbs";
import TeamMambers from "@/components/otherPages/team/TeamMambers";

export const metadata = {
  title:
    "Our Team || Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
  description:
    "Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
};

export default function page() {
  return (
    <>
      <Header1 /> <MobailHeader1 />
      <main className="main">
        <BreadCumbs />
        <TeamMambers />
        <DownloadApp />
      </main>
      <Footer1 />
    </>
  );
}
