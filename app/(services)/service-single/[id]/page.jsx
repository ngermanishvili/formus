import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import Breadcumb from "@/components/service/serviceSingle/Breadcumb";
import Features1 from "@/components/service/serviceSingle/Features1";
import Features2 from "@/components/service/serviceSingle/Features2";
import SearchBox from "@/components/service/serviceSingle/SearchBox";
import { allServices } from "@/data/services";
import React from "react";

export default function page({ params }) {
  const service =
    allServices.filter((elm) => elm.id == params.id)[0] || allServices[0];
  return (
    <>
      <Header1 /> <MobailHeader1 />
      <main className="main">
        <Breadcumb service={service} />
        <SearchBox service={service} />
        <Features1 />
        <Features2 />
      </main>
      <Footer1 />
    </>
  );
}
