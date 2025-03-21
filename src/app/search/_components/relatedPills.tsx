import Link from "next/link";

export function RelatedPills({ relatedMatches }: { relatedMatches: string[] }) {
  return ( <div className="flex flex-row min-w-full whitespace-nowrap flex-wrap smaller:flex-nowrap smaller:overflow-scroll">
    {relatedMatches.map((match, key) => (
      <Link
        key={key+match}
        href={`/search?query=${encodeURIComponent(match)}`}
        className="bg-accent py-3 px-5 font-sm mr-5 rounded-max text-white hover:bg-accent/90 mb-4">
        {match}
      </Link>
    ))}
  </div>);
}
