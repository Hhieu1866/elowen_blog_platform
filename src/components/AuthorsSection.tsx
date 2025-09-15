import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const authors = [
  {
    name: "Jakob Grønberg",
    img: "/jakob_gronberg.png",
    job: "Artist",
    city: "Berlin",
  },
  {
    name: "Louise Jensen",
    img: "/louise_jensen.png",
    job: "Artist",
    city: "Stockholm",
  },
];

const AuthorsSection = () => {
  return (
    <div className="px-6 md:px-48">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="py-10 text-4xl font-bold uppercase md:text-8xl"
        >
          Authors
        </motion.h1>
        <div className="flex items-center gap-2">
          <h3 className="hidden text-base font-bold uppercase md:block">
            All Authors
          </h3>
          <ArrowRight className="size-5" />
        </div>
      </div>

      {/* Grid authors */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {authors.map((author, idx) => (
          <Card
            key={idx}
            className="flex w-full items-center gap-10 rounded-none border border-black p-5 shadow-none md:p-7"
          >
            <CardContent className="flex flex-col items-start gap-6 p-0 md:flex-row md:items-center md:gap-10">
              {/* Avatar */}
              <div className="relative size-32 overflow-hidden rounded-full md:size-[150px]">
                <Image
                  src={author.img}
                  alt={author.name}
                  fill
                  className="h-auto w-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-5">
                <p className="text-3xl font-bold">{author.name}</p>
                <div className="flex flex-col items-start gap-3 text-sm md:flex-row md:items-center md:gap-5">
                  <div className="flex items-center gap-1">
                    <span className="font-bold">Job</span>
                    <span>{author.job}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">City</span>
                    <span>{author.city}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AuthorsSection;
