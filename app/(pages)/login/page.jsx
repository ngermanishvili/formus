import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import Login from "@/components/otherPages/Login";
import React from "react";

export const metadata = {
  title:
    "Login || Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
  description:
    "Lixride Chauffeur Limousine Transport and Car Hire Nextjs Template",
};
export default function page() {
  return (
    <>
      <Header1 /> <MobailHeader1 />
      <main className="main">
        <Login />
      </main>
      <Footer1 />
    </>
  );
}
