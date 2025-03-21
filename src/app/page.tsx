"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import InputField from "@/app/components/TextInput";
import Link from "next/link";
import clsx from "clsx";

export default function SearchClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">

        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] mb-5">
          TrigifySearch
        </h1>

        <div className="flex flex-col items-center mb-5 w-[50vw]">
          <InputField
            type="text"
            placeholder="Search for job titles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onEnter={() => router.push(`/search?query=${encodeURIComponent(searchQuery)}`) }
          />

          <Link
            className={clsx("flex max-w-xs flex-col my-8 rounded-xl bg-accent py-2 px-4 hover:border hover:border-white",
              searchQuery ? "cursor-pointer" : "cursor-default pointer-events-none",
            )}
            href={`/search?query=${encodeURIComponent(searchQuery)}`}
          >
            Search
          </Link>
        </div>
      </div>
    </main>
  );
}
