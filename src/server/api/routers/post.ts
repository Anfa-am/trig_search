import { z } from "zod";
import { PrismaClient } from '@prisma/client';
import type { JobTitle } from '@prisma/client';

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const prisma = new PrismaClient();

type RankedJobTitle = JobTitle & {
  score: number;
};

export const postRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }): Promise<RankedJobTitle[]> => {
    const { query } = input;

    if (!query || query.trim() === '') {
      return [];
    }

    const exactNameMatches: JobTitle[] = await prisma.jobTitle.findMany({
      where: {
        name: {
          equals: query,
          mode: 'insensitive',
        },
      },
    });


   const partialNameMatches: JobTitle[] = await prisma.jobTitle.findMany({
       where: {
         name: {
           contains: query,
           mode: 'insensitive',
         },
         id: {
          notIn: [...exactNameMatches].map(match => match.id),
         },
       },
     });

   const fuzzyNameMatches: JobTitle[] = await prisma.$queryRaw`
        SELECT * FROM "JobTitle"
        WHERE name % ${query}
        AND name NOT LIKE ${query}
      `;


    const abbreviationMatches: JobTitle[] = await prisma.jobTitle.findMany({
      where: {
        abbreviation: {
          contains: query,
          mode: 'insensitive',
        },
        id: {
          notIn: [...exactNameMatches, ...fuzzyNameMatches, ...partialNameMatches].map(match => match.id),
        },
      },
    });

    const relatedMatches: JobTitle[] = await prisma.jobTitle.findMany({
      where: {
        related: {
          has: query,
        },
        id: {
          notIn: [...exactNameMatches, ...fuzzyNameMatches, ...partialNameMatches, ...abbreviationMatches].map(match => match.id),
        },
      },
    });

    const rankedResults: RankedJobTitle[] = [
      ...abbreviationMatches.map(match => ({ ...match, score: 95 })),
      ...exactNameMatches.map(match => ({ ...match, score: 90 })),
      ...partialNameMatches.map(match => ({ ...match, score: 85 })),
      ...fuzzyNameMatches.map(match => ({ ...match, score: 80 })),
      ...relatedMatches.map(match => ({ ...match, score: 75 })),
    ];

    const deduplicatedResults = new Map<string, RankedJobTitle>();

    rankedResults.forEach(result => {
      const existing = deduplicatedResults.get(result.id);
      if (!existing) {
        deduplicatedResults.set(result.id, result);
      }
    });

    const sortedResults = Array.from(deduplicatedResults.values()).sort((a, b) => b.score - a.score);

    return sortedResults;

  }),
});
