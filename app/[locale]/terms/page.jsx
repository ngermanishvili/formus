"use client";
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Header5 from "@/components/headers/Header5";
import MobileHeader1 from "@/components/headers/MobailHeader1";

const TermsConditions = () => {
  const searchParams = useSearchParams();
  const marketingTermsRef = useRef(null);

  useEffect(() => {
    // თუ URL-ში არის section=marketing, დავსქროლოთ მესამე სექციაზე
    if (searchParams.get("section") === "marketing") {
      setTimeout(() => {
        marketingTermsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [searchParams]);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-8 mt-[80px]">
        <h1 className="text-2xl font-bold">წესები და პირობები</h1>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. ზოგადი დებულებები</h2>
            <p className="text-gray-600">
              ამ ვებგვერდის გამოყენებით თქვენ ეთანხმებით ქვემოთ მოცემულ წესებსა
              და პირობებს. გთხოვთ, ყურადღებით გაეცნოთ მათ სერვისის
              გამოყენებამდე. Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Sequi qui aliquam molestias, corporis repudiandae beatae ex
              quidem nulla rerum veniam, facere aut nihil magni, dicta ad
              doloribus perferendis nemo. Ipsa sed quae id maiores quasi
              excepturi molestias perspiciatis eos? Magni numquam quis iusto
              facere laboriosam corporis ipsa iste omnis Lorem ipsum dolor sit
              amet consectetur, adipisicing elit. Quas officia ullam qui
              pariatur repudiandae obcaecati neque reprehenderit, ipsam quasi.
              Reiciendis nisi maiores, temporibus iure, ipsum odio, dolores
              itaque libero doloremque quidem obcaecati soluta. Illo sunt
              quisquam voluptatum dolores eligendi? Eligendi delectus doloribus
              harum quasi porro ipsum ea esse vero vitae! a. Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Ratione molestiae
              necessitatibus asperiores aut sunt. Commodi, nostrum debitis
              possimus exercitationem dolorem voluptatum molestias velit
              officiis maiores sit, itaque eius porro vel officia. Tempore
              accusantium et, quis ut totam ratione fuga nostrum deserunt at
              provident hic aliquid sed atque culpa asperiores natus. Neque
              laudantium laboriosam dolor quia quae, sequi aut alias aliquam.
              Inventore atque voluptatem ducimus cumque ex alias. Earum minus
              veniam voluptatibus praesentium. Perspiciatis neque sequi quisquam
              dignissimos quidem esse cumque aperiam iste, facilis nam, culpa id
              quaerat alias atque, qui placeat ipsam doloremque? Nulla nemo
              temporibus, alias hic quibusdam explicabo. Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Sequi quidem maiores
              repudiandae? Tempore quaerat saepe minima, quis culpa non eum
              laudantium. Perspiciatis odio, consectetur blanditiis, placeat,
              voluptatum molestias numquam recusandae provident assumenda harum
              ut? Sunt quam, blanditiis corrupti, laboriosam nostrum eos
              asperiores placeat animi aut facere doloribus atque eius obcaecati
              dignissimos modi doloremque. Sit labore suscipit consequuntur?
              Reiciendis voluptatum blanditiis nam excepturi architecto? Eum
              perferendis ut adipisci cupiditate. Odio illo est maiores
              exercitationem quia voluptatibus, deleniti officiis esse veniam
              iure, sequi consequatur accusantium molestiae enim quod? Totam
              sint esse excepturi laudantium dolorum deserunt, quo molestiae
              corporis porro maxime, officiis doloremque iusto, ipsam neque
              consequatur adipisci dignissimos dolores debitis officia! At atque
              dolor velit deleniti ea? Ab amet nulla voluptates tempore aliquam
              excepturi deserunt incidunt praesentium, harum inventore
              distinctio beatae nobis, itaque quibusdam earum voluptatibus
              deleniti nostrum similique iure architecto, aut perspiciatis.
              Sequi incidunt ratione voluptas eveniet voluptatem enim, fugit
              praesentium illo aliquam nostrum quisquam blanditiis esse dolor
              nesciunt amet obcaecati cumque id quae ad ipsum? Sint aliquam
              tempore ducimus reiciendis consectetur voluptatibus velit totam
              repudiandae delectus? Facilis doloribus rerum debitis earum!
              Ducimus, veniam nostrum totam aliquid in sit provident et maxime?
              Itaque animi laudantium quibusdam delectus sit quisquam temporibus
              placeat. reprehenderit, ipsam quasi. Reiciendis nisi maiores,
              temporibus iure, ipsum odio, dolores itaque libero doloremque
              quidem obcaecati soluta. Illo sunt quisquam voluptatum dolores
              eligendi? Eligendi delectus doloribus harum quasi porro ipsum ea
              esse vero vitae! a. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Ratione molestiae necessitatibus asperiores aut
              sunt. Commodi, nostrum debitis possimus exercitationem dolorem
              voluptatum molestias velit officiis maiores sit, itaque eius porro
              vel officia. Tempore accusantium et, quis ut totam ratione fuga
              nostrum deserunt at provident hic aliquid sed atque culpa
              asperiores natus. Neque laudantium laboriosam dolor quia quae,
              sequi aut alias aliquam. Inventore atque voluptatem ducimus cumque
              ex alias. Earum minus veniam voluptatibus praesentium.
              Perspiciatis neque sequi quisquam dignissimos quidem esse cumque
              aperiam iste, facilis nam, culpa id quaerat alias atque, qui
              placeat ipsam doloremque? Nulla nemo temporibus, alias hic
              quibusdam explicabo. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Sequi quidem maiores repudiandae? Tempore
              quaerat saepe minima, quis culpa non eum laudantium. Perspiciatis
              odio, consectetur blanditiis, placeat, voluptatum molestias
              numquam recusandae provident assumenda harum ut? Sunt quam,
              blanditiis corrupti, laboriosam nostrum eos asperiores placeat
              animi aut facere doloribus atque eius obcaecati dignissimos modi
              doloremque. Sit labore suscipit consequuntur? Reiciendis
              voluptatum blanditiis nam excepturi architecto? Eum perferendis ut
              adipisci cupiditate. Odio illo est maiores exercitationem quia
              voluptatibus, deleniti officiis esse veniam iure, sequi
              consequatur accusantium molestiae enim quod? Totam sint esse
              excepturi laudantium dolorum deserunt, quo molestiae corporis
              porro maxime, officiis doloremque iusto, ipsam neque consequatur
              adipisci dignissimos dolores debitis officia! At atque dolor velit
              deleniti ea? Ab amet nulla voluptates tempore aliquam excepturi
              deserunt incidunt praesentium, harum inventore distinctio beatae
              nobis, itaque quibusdam earum voluptatibus deleniti nostrum
              similique iure architecto, aut perspiciatis. Sequi incidunt
              ratione voluptas eveniet voluptatem enim, fugit praesentium illo
              aliquam nostrum quisquam blanditiis esse dolor nesciunt amet
              obcaecati cumque id quae ad ipsum? Sint aliquam tempore ducimus
              reiciendis consectetur voluptatibus velit totam repudiandae
              delectus? Facilis doloribus rerum debitis earum! Ducimus, veniam
              nostrum totam aliquid in sit provident et maxime? Itaque animi
              laudantium quibusdam delectus sit quisquam temporibus placeat.
              reprehenderit, ipsam quasi. Reiciendis nisi maiores, temporibus
              iure, ipsum odio, dolores itaque libero doloremque quidem
              obcaecati soluta. Illo sunt quisquam voluptatum dolores eligendi?
              Eligendi delectus doloribus harum quasi porro ipsum ea esse vero
              vitae! a. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Ratione molestiae necessitatibus asperiores aut sunt. Commodi,
              nostrum debitis possimus exercitationem dolorem voluptatum
              molestias velit officiis maiores sit, itaque eius porro vel
              officia. Tempore accusantium et, quis ut totam ratione fuga
              nostrum deserunt at provident hic aliquid sed atque culpa
              asperiores natus. Neque laudantium laboriosam dolor quia quae,
              sequi aut alias aliquam. Inventore atque voluptatem ducimus cumque
              ex alias. Earum minus veniam voluptatibus praesentium.
              Perspiciatis neque sequi quisquam dignissimos quidem esse cumque
              aperiam iste, facilis nam, culpa id quaerat alias atque, qui
              placeat ipsam doloremque? Nulla nemo temporibus, alias hic
              quibusdam explicabo. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Sequi quidem maiores repudiandae? Tempore
              quaerat saepe minima, quis culpa non eum laudantium. Perspiciatis
              odio, consectetur blanditiis, placeat, voluptatum molestias
              numquam recusandae provident assumenda harum ut? Sunt quam,
              blanditiis corrupti, laboriosam nostrum eos asperiores placeat
              animi aut facere doloribus atque eius obcaecati dignissimos modi
              doloremque. Sit labore suscipit consequuntur? Reiciendis
              voluptatum blanditiis nam excepturi architecto? Eum perferendis ut
              adipisci cupiditate. Odio illo est maiores exercitationem quia
              voluptatibus, deleniti officiis esse veniam iure, sequi
              consequatur accusantium molestiae enim quod? Totam sint esse
              excepturi laudantium dolorum deserunt, quo molestiae corporis
              porro maxime, officiis doloremque iusto, ipsam neque consequatur
              adipisci dignissimos dolores debitis officia! At atque dolor velit
              deleniti ea? Ab amet nulla voluptates tempore aliquam excepturi
              deserunt incidunt praesentium, harum inventore distinctio beatae
              nobis, itaque quibusdam earum voluptatibus deleniti nostrum
              similique iure architecto, aut perspiciatis. Sequi incidunt
              ratione voluptas eveniet voluptatem enim, fugit praesentium illo
              aliquam nostrum quisquam blanditiis esse dolor nesciunt amet
              obcaecati cumque id quae ad ipsum? Sint aliquam tempore ducimus
              reiciendis consectetur voluptatibus velit totam repudiandae
              delectus? Facilis doloribus rerum debitis earum! Ducimus, veniam
              nostrum totam aliquid in sit provident et maxime? Itaque animi
              laudantium quibusdam delectus sit quisquam temporibus placeat.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. მომსახურების პირობები</h2>
            <p className="text-gray-600">
              ჩვენ ვიტოვებთ უფლებას, ნებისმიერ დროს შევცვალოთ ან შევწყვიტოთ
              სერვისის ნებისმიერი ნაწილი წინასწარი შეტყობინების გარეშე.
            </p>
          </section>

          <section ref={marketingTermsRef} className="space-y-3">
            <h2 className="text-xl font-semibold">
              3. მარკეტინგული კომუნიკაციის პირობები
            </h2>
            <p className="text-gray-600">
              თქვენი თანხმობით, ჩვენ შეგვიძლია გამოვიყენოთ თქვენი საკონტაქტო
              ინფორმაცია მარკეტინგული მიზნებისთვის, მათ შორის პრომო
              შეთავაზებების, ახალი პროდუქტებისა და მომსახურების შესახებ
              ინფორმაციის გასაგზავნად. თქვენ შეგიძლიათ ნებისმიერ დროს უარი თქვათ
              მარკეტინგულ კომუნიკაციაზე.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
