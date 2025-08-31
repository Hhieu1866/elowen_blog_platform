import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowDown,
  Ellipsis,
  MessageSquareText,
  SendHorizontal,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const CommentSection = () => {
  return (
    <div className="py-10 md:px-48 md:py-14">
      {/* comment section */}

      <div className="s">
        <div className="relative w-full">
          <Textarea
            placeholder="Enter your comment..."
            className="w-full resize-none border-none bg-zinc-200/70 p-5 text-lg italic focus-visible:border-0 focus-visible:ring-0"
            rows={5}
          />
          <Button
            type="button"
            className="absolute bottom-5 right-5 rounded-full border border-[#E65808] bg-[#E65808] px-5 py-2 text-white hover:bg-white hover:text-[#e66808]"
            onClick={() => {}}
          >
            Send
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Comments</h2>
          <p className="rounded-full bg-[#E65808] px-3 py-1 text-sm font-medium text-white">
            25
          </p>
        </div>

        <div>
          <div className="flex items-start gap-3">
            <div>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">Noah Pierre</p>
                <span className="text-gray-500">58 minutes ago</span>
              </div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Aspernatur ut porro quisquam voluptatibus inventore similique ex
                magnam! Voluptates, provident aut?
              </p>

              <div className="flex items-center gap-10">
                <div className="flex items-center gap-2 text-gray-700">
                  <ThumbsUp className="size-4" />
                  365
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <MessageSquareText className="size-4" />
                  Reply
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          {/* reply */}
          <div className="mt-5 space-y-2">
            <div className="ml-12 flex items-start gap-3">
              <div>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">Noah Pierre</p>
                  <span className="text-gray-500">58 minutes ago</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aspernatur ut porro quisquam voluptatibus inventore similique
                  ex magnam! Voluptates, provident aut?
                </p>

                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-2 text-gray-700">
                    <ThumbsUp className="size-4" />
                    365
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <MessageSquareText className="size-4" />
                    Reply
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <Ellipsis className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="ml-12 flex items-start gap-3">
              <div>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">Noah Pierre</p>
                  <span className="text-gray-500">58 minutes ago</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aspernatur ut porro quisquam voluptatibus inventore similique
                  ex magnam! Voluptates, provident aut?
                </p>

                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-2 text-gray-700">
                    <ThumbsUp className="size-4" />
                    365
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <MessageSquareText className="size-4" />
                    Reply
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <Ellipsis className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-zinc-300" />

        <div>
          <div className="flex items-start gap-3">
            <div>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">Noah Pierre</p>
                <span className="text-gray-500">58 minutes ago</span>
              </div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Aspernatur ut porro quisquam voluptatibus inventore similique ex
                magnam! Voluptates, provident aut?
              </p>

              <div className="flex items-center gap-10">
                <div className="flex items-center gap-2 text-gray-700">
                  <ThumbsUp className="size-4" />
                  365
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <MessageSquareText className="size-4" />
                  Reply
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          {/* reply */}
          <div className="mt-5 space-y-2">
            <div className="ml-12 flex items-start gap-3">
              <div>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">Noah Pierre</p>
                  <span className="text-gray-500">58 minutes ago</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aspernatur ut porro quisquam voluptatibus inventore similique
                  ex magnam! Voluptates, provident aut?
                </p>

                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-2 text-gray-700">
                    <ThumbsUp className="size-4" />
                    365
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <MessageSquareText className="size-4" />
                    Reply
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <Ellipsis className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="ml-12 flex items-start gap-3">
              <div>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">Noah Pierre</p>
                  <span className="text-gray-500">58 minutes ago</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aspernatur ut porro quisquam voluptatibus inventore similique
                  ex magnam! Voluptates, provident aut?
                </p>

                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-2 text-gray-700">
                    <ThumbsUp className="size-4" />
                    365
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <MessageSquareText className="size-4" />
                    Reply
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <Ellipsis className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            className="flex items-center gap-1 text-[#E65808]"
          >
            <p className="font-semibold">Show more </p>
            <ArrowDown className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
