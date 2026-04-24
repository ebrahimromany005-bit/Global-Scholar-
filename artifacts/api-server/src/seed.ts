import { db, countriesTable, opportunitiesTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { COUNTRIES } from "./seed-data/countries";
import { generateOpportunities } from "./seed-data/opportunities";

async function seed() {
  // eslint-disable-next-line no-console
  console.log("Seeding countries…");
  await db.execute(sql`TRUNCATE TABLE opportunities RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE countries RESTART IDENTITY CASCADE`);

  await db.insert(countriesTable).values(COUNTRIES);
  // eslint-disable-next-line no-console
  console.log(`Inserted ${COUNTRIES.length} countries`);

  // eslint-disable-next-line no-console
  console.log("Generating opportunities…");
  const opportunities = generateOpportunities(COUNTRIES);
  // eslint-disable-next-line no-console
  console.log(`Generated ${opportunities.length} opportunities`);

  // Insert in chunks to avoid query size limits
  const chunkSize = 500;
  for (let i = 0; i < opportunities.length; i += chunkSize) {
    const chunk = opportunities.slice(i, i + chunkSize);
    await db.insert(opportunitiesTable).values(chunk);
  }
  // eslint-disable-next-line no-console
  console.log(`Inserted ${opportunities.length} opportunities`);

  // eslint-disable-next-line no-console
  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
