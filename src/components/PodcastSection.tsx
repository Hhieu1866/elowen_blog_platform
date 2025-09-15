"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Ep05 from "../../public/ep05.png";
import Ep04 from "../../public/ep04.png";
import Ep03 from "../../public/ep03.png";
import { motion } from "framer-motion";

// data podcasts
const podcasts = [
  {
    img: Ep05,
    alt: "The Problem of today’s cultural development",
    title: "The Problem of today’s cultural development",
    date: "January 21, 2022",
    duration: "45 Min",
  },
  {
    img: Ep04,
    alt: "The hidden messages of Jack Nielson",
    title: "The hidden messages of Jack Nielson",
    date: "January 21, 2022",
    duration: "1h 4Min",
  },
  {
    img: Ep03,
    alt: "Behind the scenes of the street art culture",
    title: "Behind the scenes of the street art culture",
    date: "January 21, 2022",
    duration: "56 Min",
  },
];

const PodcastSection = () => {
  return (
    <div className="px-6 md:px-48">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="py-10 text-4xl font-bold uppercase md:text-6xl lg:text-8xl"
        >
          Podcasts
        </motion.h1>
        <Button variant="link" className="flex h-auto items-center gap-2 p-0">
          <span className="hidden text-base font-bold uppercase md:block">
            All Episodes
          </span>
          <ArrowRight className="size-5" />
        </Button>
      </div>

      {/* Grid podcasts */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {podcasts.map((pod, idx) => (
          <Card
            key={idx}
            className="flex w-full flex-col gap-8 rounded-none border border-black p-6 shadow-none md:p-11"
          >
            {/* Image */}
            <div className="overflow-hidden">
              <Image
                src={pod.img}
                alt={pod.alt}
                width={1920}
                height={1080}
                className="h-auto w-full transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </div>

            {/* Title */}
            <CardHeader className="p-0">
              <CardTitle className="text-3xl font-bold">{pod.title}</CardTitle>
            </CardHeader>

            {/* Meta */}
            <CardFooter className="flex flex-col items-start gap-3 p-0 text-sm md:flex-row md:items-center md:gap-7">
              <div className="space-x-2">
                <span className="font-bold">Date</span>
                <span>{pod.date}</span>
              </div>
              <div className="space-x-2">
                <span className="font-bold">Duration</span>
                <span>{pod.duration}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PodcastSection;
