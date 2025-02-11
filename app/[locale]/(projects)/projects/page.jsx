import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
import Breadcumb from "@/components/service/Breadcumb";
import Services1 from "@/components/service/Services1";
export const metadata = {
  title: "FORMUS | ფორმუსი - სამშენებლო კომპანია ",
  description:
    "ფორმუსი სამშენებლო კომპანია, რომელიც გთავაზობთ სრულყოფილ სამშენებლო მომსახურებას და სამშენებლო პროექტებს სრულყოფილი სამშენებლო მომსახურების სფეროში.",
};

export default function Page() {
  return (
    <>
      <Header5 />
      <main className="main">
        <Breadcumb />
        <Services1 />
      </main>
      <Footer1 />
    </>
  );
}
