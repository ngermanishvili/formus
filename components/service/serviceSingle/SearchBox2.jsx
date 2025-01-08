import Image from "next/image";
import OrtachalaHills from "@/public/assets/imgs/ortachala/ortachala-hills.jpg";

export default function SearchBox2({ service }) {
  return (
    <section className="section">
      <div className="banner-image-service relative h-[400px] w-full overflow-hidden">
        <Image
          src={OrtachalaHills.src}
          alt="luxride"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
