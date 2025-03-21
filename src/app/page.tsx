import Link from "next/link";


import { LatestPost } from "@/app/_components/post";
import { api, HydrateClient } from "@/trpc/server";

type ImageDetails = {
  alt: string;
  avg_color: string;
  height: number;
  id: number;
  liked: boolean;
  photographer: string;
  photographer_id: number;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
  };
  url: string;
  width: number;
};

export default async function Home() {
  const hello = await api.post.hello({ text: "from ya mova" });


  const URL = `https://api.pexels.com/v1/search?query=nature&per_page=1&page=1`;

  const res = await fetch(URL, {
    headers: {
      'Authorization': process.env.NEXT_PEXELS_API_KEY
    },
  })

  const {photos} : { photos: ImageDetails[] } = await res.json();

  console.log(photos)


  // void api.post.getLatest.prefetch();
  // const [latestPost] = api.post.getLatest.useSuspenseQuery();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="/search?test=ya"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
          </div>

          <LatestPost />
        </div>
      </main>
    </HydrateClient>
  );
}
