import Link from "next/link";
import Image from 'next/image';

import { redirect } from 'next/navigation';

import {
  RedirectToSignIn,
  SignedOut,
  SignedIn,
} from '@clerk/nextjs'

import NoResultsGraphic from './no-results.svg';
import { api } from "@/trpc/server";
import { MainResult } from "./_components/mainResult";

export default async function Home({ searchParams }: { searchParams: { query?: string } }) {
  const query = searchParams.query;

  if (!query) {
    redirect('/');
  }
  const search = await api.post.search({ query });

  console.log(search);
  return (
    <main>
      <SignedOut>
        <RedirectToSignIn></RedirectToSignIn>
      </SignedOut>
      <SignedIn>
        <div className="flex min-h-screen min-w-screen flex-col p-10 capitalize">
          { search.length > 0 &&
            <div>
              <MainResult
                resultName={search[0]?.name ?? ''}
                relatedMatches={search[0]?.related ?? []}
              ></MainResult>

              { search.slice(1).map((res) => (
                <Link key={res.id}
                  href={`/search?query=${encodeURIComponent(res.name)}`}
                  className="underline hover:text-blue-500">
                  <h1 className="text-4xl mb-10 px-10">{res.name}</h1>
                </Link>
              )) }
            </div>
          }

          {
            search.length  === 0 &&
              <div className="flex flex-col gap-4 p-10" >
                <p>Your search - <b>{query}</b> - did not match any documents.</p>
                <p>Suggestions:</p>
                <ul>
                  <li>Make sure that all words are spelled correctly.</li>
                  <li>Try different keywords.</li>
                  <li>Try more general keywords.</li>
                </ul>
                <Image className="mx-20 my-10" src={NoResultsGraphic as string} alt="no results graphic" width={400} />
              </div>
          }
        </div>
      </SignedIn>
    </main>
  );
}
