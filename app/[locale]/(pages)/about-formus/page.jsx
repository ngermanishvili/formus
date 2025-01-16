import Footer5 from "@/components/footers/Footer1";
import Nav from "@/components/headers/components/Nav";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import React from "react";

const AboutFormus = () => {
  return (
    <>
      <Header1 /> <MobailHeader1 />
      <div className="flex flex-col items-center w-full py-10">
        {/* Hero Image Container with max-width and center alignment */}
        <div className="w-full flex justify-center mb-8 px-4">
          <div className="w-full max-w-[1100px] ">
            <img
              src="/assets/imgs/page/homepage5/banner.png"
              alt="Formus Building Complex"
              className="w-full max-h-[800px] object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Title Section */}
        <div className="w-full max-w-6xl px-4">
          <h2 className="text-4xl font-bold mb-6">About Formus</h2>

          {/* First Text Section */}
          <div className="mb-12">
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
              ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas
              accumsan lacus vel facilisis. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Cupiditate doloremque nesciunt
              excepturi, laudantium at illo eum illum iste quidem inventore
              autem velit a obcaecati earum veritatis. Necessitatibus voluptas
              minus aspernatur.
            </p>
          </div>

          {/* Middle Section with Text and Right Image */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="flex-1">
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
                ipsum suspendisse ultrices gravida. Risus commodo viverra
                maecenas accumsan lacus vel facilisis. Lorem ipsum, dolor sit
                amet consectetur adipisicing elit. Saepe necessitatibus fugit
                blanditiis. Voluptatibus suscipit perferendis laborum maxime
                aliquam odio id, sed deleniti repudiandae ea earum et, eum rerum
                explicabo? Non. Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Ab ullam laboriosam pariatur ut vero labore
                itaque minus possimus veniam. Itaque vero assumenda iure labore
                maiores iusto consequuntur incidunt in ipsum, autem doloremque
                voluptatum fugit delectus. Reiciendis nisi deserunt excepturi
                sint!
              </p>
            </div>
            <div className="relative">
              <div className="w-72 h-72 rounded-full overflow-hidden">
                <img
                  src="/assets/imgs/page/homepage5/banner.png"
                  alt="Building Detail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 right-0 bg-white p-2 rounded-full shadow-lg">
                <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Bottom Section with Left Image and Text */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-72 h-72 rounded-full overflow-hidden">
              <img
                src="/assets/imgs/page/homepage5/banner.png"
                alt="Building Detail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
                ipsum suspendisse ultrices gravida. Risus commodo viverra
                maecenas accumsan lacus vel facilisis. Lorem, ipsum dolor sit
                amet consectetur adipisicing elit. Ea nam explicabo doloremque
                delectus, ex reprehenderit provident modi sapiente dolor saepe,
                corporis corrupti expedita id in culpa earum quasi voluptatum
                ipsa, illum quas rerum recusandae voluptas. Itaque nostrum
                corrupti recusandae totam? Deleniti aut praesentium officiis
                ducimus rerum magni vero, ipsam natus?
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer5 />
    </>
  );
};

export default AboutFormus;
