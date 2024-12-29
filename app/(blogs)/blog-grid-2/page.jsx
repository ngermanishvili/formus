import Blogs2 from "@/components/blog/Blogs2";
import BreadCumb from "@/components/blog/BreadCumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";

export const metadata = {
  title:
    "Blog Grid 2 || Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
  description:
    "Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
};

export default function page() {
  return (
    <>
      <Header1 /> <MobailHeader1 />
      <main className="main">
        <BreadCumb />
        <Blogs2 />
      </main>
      <Footer1 />
    </>
  );
}
