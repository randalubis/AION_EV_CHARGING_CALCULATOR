/**
 * Backup user-submitted station entries from Supabase to a local JSON file.
 *
 * Why only station_submissions: the other tables in our schema (stations,
 * connectors) are reproducible from the PLN scraper CSV via
 * `scripts/ingest-spklu.ts`. station_submissions is the only table holding
 * data that can't be regenerated, so it's the only one worth backing up
 * before tearing down the Supabase project.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/backup-submissions.ts
 *
 * Output: backups/submissions-YYYY-MM-DDTHH-MM-SS.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY in environment.');
  console.error('Run with:  node --env-file=.env.local --import tsx scripts/backup-submissions.ts');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const PAGE_SIZE = 1000;

async function fetchAll(table: string): Promise<unknown[]> {
  const all: unknown[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase.from(table).select('*').range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return all;
}

async function main() {
  console.log(`Connecting to ${SUPABASE_URL}`);

  const submissions = await fetchAll('station_submissions');
  console.log(`Fetched ${submissions.length} submission${submissions.length === 1 ? '' : 's'}`);

  const dir = path.join(process.cwd(), 'backups');
  fs.mkdirSync(dir, { recursive: true });

  // Filename-safe ISO timestamp at second precision: 2026-05-04T17-23-45
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outFile = path.join(dir, `submissions-${timestamp}.json`);

  const payload = {
    exportedAt: new Date().toISOString(),
    sourceUrl: SUPABASE_URL,
    table: 'station_submissions',
    rowCount: submissions.length,
    rows: submissions,
  };

  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
  console.log(`✓ Wrote ${outFile}`);

  if (submissions.length === 0) {
    console.log('  (table is empty — file kept as a snapshot for reference)');
  } else {
    console.log(`  Restore later via:`);
    console.log(`  node --env-file=.env.local --import tsx scripts/restore-submissions.ts ${outFile}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
