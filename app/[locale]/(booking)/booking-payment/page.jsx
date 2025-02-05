import BookingPayment from "@/components/booking/BookingPayment";
import BookingTab from "@/components/booking/BookingTab";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";

export const metadata = {
  title: "FORMUS | ფორმუსი - სამშენებლო კომპანია ",
  description:
    "ფორმუსი სამშენებლო კომპანია, რომელიც გთავაზობთ სრულყოფილ სამშენებლო მომსახურებას და სამშენებლო პროექტებს სრულყოფილი სამშენებლო მომსახურების სფეროში.",
};

export default function page() {
  return (
    <>
      <Header1 /> <MobailHeader1 />
      <main className="main">
        <section className="section">
          <div className="container-sub">
            <BookingTab />
            <BookingPayment />
          </div>
        </section>
      </main>
      <Footer1 />
    </>
  );
}
