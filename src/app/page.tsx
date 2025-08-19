import AuthorsSection from "@/components/AuthorsSection";
import Footer from "@/components/Footer";
import PodcastSection from "@/components/PodcastSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const posts = [
  {
    image: "/post1.png",
    alt: "Hope dies last",
    title: "Hope dies last",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas dui id ornare arcu odio ut sem. Cras ornare arcu dui vivamus arcu felis bibendum ut. Porttitor leo a diam.",
    author: "Cristofer Vaccaro",
    date: "September 22, 2022",
    read: "50 Min",
    category: "Art",
  },
  {
    image: "/post1.png",
    alt: "The best art museums",
    title: "The best art museums",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit at tempore consectetur autem, ab necessitatibus magnam ullam enim sequi nostrum. Animi quos, labore sunt obcaecati aut cupiditate quae.",
    author: "Louise Jensen",
    date: "Mar 28, 2022",
    read: "10 Min",
    category: "Sculptures",
  },
  {
    image: "/post1.png",
    alt: "The devil is in the details",
    title: "The devil is in the details",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis soluta suscipit temporibus sapiente eius qui, vel totam assumenda quibusdam! Itaque nesciunt sed recusandae doloribus! Numquam, sed!",
    author: "Jane Cooper",
    date: "Mar 28, 2022",
    read: "35 Min",
    category: "Art",
  },
  {
    image: "/post1.png",
    alt: "An indestructible hope",
    title: "An indestructible hope",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fuga ex, recusandae repellendus ut voluptate nostrum molestiae laborum ullam quod, nesciunt minima a officia, expedita voluptatibus.",
    author: "Louise Jensen",
    date: "Mar 30, 2022",
    read: "12 Min",
    category: "Art",
  },
  {
    image: "/post1.png",
    alt: "Street art festival",
    title: "Street art festival",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam, sint delectus eveniet a aperiam, voluptatum aliquam error autem, saepe fuga adipisci rerum maiores ratione quasi. Et!",
    author: "Cristofer Vaccaro",
    date: "Mar 28, 2022",
    read: "5 Min",
    category: "Street Art",
  },
  {
    image: "/post1.png",
    alt: "The chains of our lives",
    title: "The chains of our lives",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae magni repellat explicabo? Atque libero commodi consectetur voluptatum maxime suscipit quaerat. Minima, vero praesentium. Voluptates, harum delectus?",
    author: "Louise Jensen",
    date: "Mar 28, 2022",
    read: "30 Min",
    category: "Sculptures",
  },
];

export default function Home() {
  return (
    <div className="">
      <div className="container relative mx-auto my-4 w-full p-6 md:p-0">
        <Image
          src="/HeadlineArt&Life.png"
          alt="Headline Art & Life"
          width={1920}
          height={1080}
          className="h-auto w-full object-cover"
        />
      </div>

      <div className="container mx-auto flex items-center overflow-hidden bg-black">
        <span className="p-5 text-lg font-bold tracking-wider text-white">
          NEWS TICKER+++
        </span>

        <div className="relative flex-1 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block">
            <span className="mx-8 text-base text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
              recusandae corrupti, quasi obcaecati quam ratione cumque quae
              dolores illum minima alias nesciunt cum modi, sequi aut placeat
              assumenda ducimus inventore, repudiandae eius voluptatum? Sunt
              nobis sed beatae labore dolorum sit.
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex w-full gap-8 py-16">
        <div className="flex-1">
          <h1 className="text-8xl font-bold uppercase leading-none">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-7">
              <div className="flex items-center gap-3">
                <p className="font-semibold">Text</p>
                <span className="underline">Cristofer Vaccaro</span>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">Date</p>
                <span className="underline">September 22, 2022</span>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">Read</p>
                <span className="underline">50 Min</span>
              </div>
            </div>
            <button className="rounded-full border border-black px-3 py-1">
              Street Art
            </button>
          </div>
        </div>
      </div>

      <div className="container relative mx-auto w-full">
        <Image
          src="/hero_img.png"
          alt="banner"
          width={1920}
          height={1080}
          className="h-auto w-full object-cover"
        />
      </div>

      <div className="container mx-auto flex gap-24 py-16">
        {/* left side */}
        <div className="w-3/4">
          {posts.map((post, idx) => (
            <div key={idx}>
              <div className="flex gap-12 py-12">
                <Image
                  src={post.image}
                  alt={post.alt}
                  width={240}
                  height={240}
                />
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col gap-5">
                    <h1 className="text-3xl font-bold">{post.title}</h1>
                    <p className="text-base">{post.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-7">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">Text</p>
                        <span className="underline">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">Date</p>
                        <span className="underline">{post.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">Read</p>
                        <span className="underline">{post.read}</span>
                      </div>
                    </div>
                    <button className="rounded-full border border-black px-3 py-1 uppercase">
                      {post.category}
                    </button>
                  </div>
                </div>
              </div>

              {/* divider */}
              {idx < posts.length - 1 && (
                <div className="h-[1px] w-full border border-black" />
              )}
            </div>
          ))}
        </div>

        {/* right side */}
        <div className="w-1/4">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold uppercase">Printmagazine</h3>
            <p className="text-5xl font-bold tracking-widest">03/2022</p>
            <Image
              src="/fyrre.png"
              alt="Magazine Cover 3/22"
              width={356}
              height={445}
              className=""
            />
            <Button className="w-full rounded-none border border-black bg-black py-8 uppercase text-white transition-all duration-300 ease-in-out hover:bg-white hover:text-black">
              Buy now
            </Button>
          </div>

          <div className="mt-16 flex flex-col">
            <h3 className="text-base font-bold uppercase">Popular posts</h3>

            {[
              {
                number: "01",
                title: "Street art festival",
                author: "Cristofer Vaccaro",
              },
              { number: "02", title: "Hope dies last", author: "Anne Henry" },
              {
                number: "03",
                title: "Artists who want to rise above",
                author: "Anna Nielsen",
              },
            ].map((post, idx, arr) => (
              <div key={idx}>
                <div className="py-7">
                  <div className="flex gap-8">
                    <p className="text-2xl font-bold">{post.number}</p>
                    <div className="space-y-3">
                      <p className="text-2xl font-bold">{post.title}</p>
                      <div className="space-x-2 text-sm">
                        <span className="font-bold">Author</span>
                        <span className="underline">{post.author}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {idx < arr.length - 1 && (
                  <div className="h-[1px] w-full border border-black" />
                )}
              </div>
            ))}
          </div>

          <Card className="mt-16 rounded-none border-0 bg-zinc-100 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-bold uppercase">
                Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-3xl font-bold text-black">
                Design News to your inbox
              </CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 rounded-none">
              <Input
                placeholder="Email"
                className="rounded-none border-0 bg-white py-7 text-start shadow-none"
              />
              <Button className="w-full rounded-none p-7">SIGN UP</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="container mx-auto h-[1px] w-full border border-black" />

      {/* PODCAST */}
      <PodcastSection />

      <div className="container mx-auto mt-24 h-[1px] w-full border border-black" />

      {/* AUTHORS */}
      <AuthorsSection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
