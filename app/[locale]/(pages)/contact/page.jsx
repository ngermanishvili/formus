import BreadCumb from "@/components/contact/BreadCumb";
import Map from "@/components/contact/Map";
import Offices from "@/components/contact/Offices";
import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
export const metadata = {
  title: "FORMUS | კონტაქტი - Formus სამშენებლო კომპანია",
  description:
    "ფორმუსი სამშენებლო კომპანია, რომელიც გთავაზობთ სრულყოფილ სამშენებლო მომსახურებას და სამშენებლო პროექტებს სრულყოფილი სამშენებლო მომსახურების სფეროში.",
};

export default function page() {
  return (
    <>
      <Header5 />
      <main className="main">
        <BreadCumb />
        <Offices />
      </main>
      <Footer1 />
    </>
  );
}
