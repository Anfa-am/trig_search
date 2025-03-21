import Link from "next/link";

import {
  RedirectToSignIn,
  SignedOut,
  SignedIn,
} from '@clerk/nextjs'

import { LatestPost } from "./_components/post";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from ya mova" });

  // void api.post.getLatest.prefetch();
  // const [latestPost] = api.post.getLatest.useSuspenseQuery();

  return (
    <HydrateClient>
      <SignedOut>
        <RedirectToSignIn></RedirectToSignIn>
      </SignedOut>
      <SignedIn>
        <main className="flex min-h-screen min-w-screen flex-col">
          search res
          { hello.greeting }
          <LatestPost />
        </main>
      </SignedIn>
    </HydrateClient>
  );
}
