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

    const rankedResults: RankedJobTitle[] = [
      ...exactNameMatches.map(match => ({ ...match, score: 100 })),
      ...relatedMatches.map(match => ({ ...match, score: 75 })),
      ...fuzzyNameMatches.map(match => ({ ...match, score: 50 })),
      ...abbreviationMatches.map(match => ({ ...match, score: 25 })),
    ];

    const a= rankedResults.sort((a, b) => b.score - a.score);
    console.log(a)
return a
  }),
});
