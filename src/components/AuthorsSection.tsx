import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

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
]

const AuthorsSection = () => {
  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="py-10 text-8xl font-bold uppercase">Authors</h1>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold uppercase">All Authors</h3>
          <ArrowRight className="size-5" />
        </div>
      </div>

      {/* Grid authors */}
      <div className="grid grid-cols-2">
        {authors.map((author, idx) => (
          <Card
            key={idx}
            className="flex w-full items-center gap-10 border border-black p-7 rounded-none shadow-none"
          >
            <CardContent className="flex items-center gap-10 p-0">
              {/* Avatar */}
              <div className="relative size-[150px] overflow-hidden rounded-full">
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
                <div className="flex items-center gap-5 text-sm">
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
  )
}

export default AuthorsSection
