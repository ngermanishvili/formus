import SearchForm from "@/components/search/search-form";
import Image from "next/image";

export default function DownloadApp() {
  return (
    <section className="section  bg-download-3 bg-lime-600">
      <div className="container-sub">
        <h2 className="heading-44-medium color-white mb-20 wow fadeInUp">
          Find Your Dream House
        </h2>
        <SearchForm />
      </div>
    </section>
  );
}
