"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import InputField from "@/app/components/TextInput";

export function SearchBar({defaultValue}: {defaultValue: string}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(defaultValue || "");

  return (

    <div className="flex flex-col items-center w-[50vw] absolute top-[-65px] mt-[calc(15px/2)] left-20 smaller:left-2">
      <InputField
        type="text"
        placeholder="Search for job titles"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onEnter={() => router.push(`/search?query=${encodeURIComponent(searchQuery)}`) }
      />
    </div>
  );
}
