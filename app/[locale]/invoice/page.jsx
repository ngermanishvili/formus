import Invoice from "@/components/Invoice";

export const metadata = {
  title:
    "Invoice || Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
  description:
    "Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
};
export default function page() {
  return (
    <>
      <main className="main">
        <Invoice />
      </main>
    </>
  );
}
