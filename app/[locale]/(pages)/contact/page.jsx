import BreadCumb from "@/components/contact/BreadCumb";
import Map from "@/components/contact/Map";
import Offices from "@/components/contact/Offices";
import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";

export default function page() {
  return (
    <>
      <Header5 />
      <main className="main">
        <BreadCumb />
        <Offices />
        <Map />
      </main>
      <Footer1 />
    </>
  );
}
