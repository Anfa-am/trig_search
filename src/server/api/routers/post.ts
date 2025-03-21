import { z } from "zod";
import { PrismaClient } from '@prisma/client';
import type { JobTitle } from '@prisma/client';


import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";


type RankedJobTitle = JobTitle & {
  score: number;
};

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }): Promise<RankedJobTitle[]> => {
    const { query } = input;

    if (!query || query.trim() === '') {
      return [];
    }

    // First search: exact matches in name (highest priority)
    const exactNameMatches: JobTitle[] = await prisma.jobTitle.findMany({
      where: {
        name: {
          equals: query,
          mode: 'insensitive',
        },
      },
    });

    // Second search: fuzzy matches in name
    const fuzzyNameMatches: JobTitle[] = await prisma.jobTitle.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
        id: {
          notIn: exactNameMatches.map(match => match.id),
        },
      },
    });

    // Third search: fuzzy matches in abbreviation
    const abbreviationMatches: JobTitle[] = await prisma.jobTitle.findMany({
      where: {
        abbreviation: {
          contains: query,
          mode: 'insensitive',
        },
        id: {
          notIn: [...exactNameMatches, ...fuzzyNameMatches].map(match => match.id),
        },
      },
    });

    // Fourth search: fuzzy matches in related array
    const relatedMatches: JobTitle[] = await prisma.jobTitle.findMany({
      where: {
        related: {
          has: query,
        },
        id: {
          notIn: [...exactNameMatches, ...fuzzyNameMatches, ...abbreviationMatches].map(match => match.id),
        },
      },
    });

    // Combine all results with weightings for ranking
    const rankedResults: RankedJobTitle[] = [
      ...exactNameMatches.map(match => ({ ...match, score: 100 })),
      ...fuzzyNameMatches.map(match => ({ ...match, score: 75 })),
      ...abbreviationMatches.map(match => ({ ...match, score: 50 })),
      ...relatedMatches.map(match => ({ ...match, score: 25 })),
    ];

    // Sort by score (highest first)
    return rankedResults.sort((a, b) => b.score - a.score);
  }),
});
