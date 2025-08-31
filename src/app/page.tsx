import AuthorsSection from "@/components/AuthorsSection";
import Footer from "@/components/Footer";
import PodcastSection from "@/components/PodcastSection";
import PostSection from "@/components/PostSection";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <div className="relative w-full px-6 py-5 md:px-48">
        <Image
          src="/HeadlineArt&Life.png"
          alt="Headline Art & Life"
          width={1920}
          height={1080}
          className="h-auto w-full object-cover"
        />
      </div>

      <div className="px-6 md:px-48">
        <div className="flex items-center overflow-hidden bg-black">
          <span className="p-3 text-sm font-bold tracking-wider text-white sm:p-5 sm:text-lg">
            NEWS TICKER+++
          </span>

          <div className="relative flex-1 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee inline-block">
              <span className="mx-4 text-xs text-white sm:mx-8 sm:text-base">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                recusandae corrupti, quasi obcaecati quam ratione cumque quae
                dolores illum minima alias nesciunt cum modi, sequi aut placeat
                assumenda ducimus inventore, repudiandae eius voluptatum? Sunt
                nobis sed beatae labore dolorum sit.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-8 px-6 py-5 md:flex-row md:px-48 md:py-16">
        <div className="flex-1">
          <h1 className="text-5xl font-bold uppercase leading-none md:text-8xl">
            Don’t close your eyes
          </h1>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <p className="text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Egestas dui id ornare arcu odio ut sem. Cras ornare arcu dui
              vivamus arcu felis bibendum ut. Porttitor leo a diam.
            </p>
          </div>
          <div className="mt-8 flex flex-col items-start justify-between md:mt-0 md:flex-row md:items-center">
            <div className="flex flex-col md:flex-row md:items-center md:gap-7">
              <div className="mb-2 flex items-center gap-2 md:mb-0">
                <p className="font-semibold">Text</p>
                <span className="underline">Cristofer Vaccaro</span>
              </div>
              <div className="mb-2 flex items-center gap-2 md:mb-0">
                <p className="font-semibold">Date</p>
                <span>September 22, 2022</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">Read</p>
                <span>50 Min</span>
              </div>
            </div>

            <Button className="btn-sweep-effect mt-3 rounded-full border border-black bg-white px-3 py-1 uppercase text-black before:bg-black hover:text-white md:mt-0">
              <span>Street Art</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative w-full px-5 md:px-48">
        <Image
          src="/hero_img.png"
          alt="banner"
          width={1920}
          height={1080}
          priority
          className="h-auto w-full object-cover"
        />
      </div>

      <PostSection />

      {/* <div className="h-px w-full border border-black px-6 md:px-48" /> */}

      <div className="mt-8 px-6 md:mt-0 md:px-48">
        <Separator className="bg-black" />
      </div>

      {/* PODCAST */}
      <PodcastSection />

      <div className="mt-8 px-6 md:mt-0 md:px-48">
        <Separator className="bg-black" />
      </div>

      {/* AUTHORS */}
      <AuthorsSection />
    </div>
  );
}
