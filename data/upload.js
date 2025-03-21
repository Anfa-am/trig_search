// @ts-ignore

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const dataPath = path.join(__dirname, 'sanitized_job_titles.json'); // Adjust the path if necessary


const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

function abbreviate(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}


async function main() {
  for (const job of data) {
    const existingJob = await prisma.jobTitle.findUnique({
      where: { name: job.name }
    });

    if (!existingJob) {
      await prisma.jobTitle.create({
        data: {
          name: job.name,
          abbreviation: abbreviate(job.name),
          related: job.top_related_titles,
        }
      });
    } else {
      const mergedRelatedTitles = Array.from(new Set([
        ...existingJob.related,
        ...job.top_related_titles
      ]));

      await prisma.jobTitle.update({
        where: { name: job.name },
        data: {
          abbreviation: abbreviate(job.name),
          related: mergedRelatedTitles,
        }
      });
    }
  }
  console.log('Data has been uploaded');
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });

