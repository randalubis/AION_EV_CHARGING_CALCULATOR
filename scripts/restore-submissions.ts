/**
 * Restore station_submissions rows from a JSON backup produced by
 * `scripts/backup-submissions.ts`.
 *
 * Idempotent: uses upsert keyed by `id`, so re-running with the same
 * backup file is safe.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/restore-submissions.ts <backup-file>
 *
 * Example:
 *   node --env-file=.env.local --import tsx scripts/restore-submissions.ts \
 *     backups/submissions-2026-05-04T17-23-45.json
 */

import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node --env-file=.env.local --import tsx scripts/restore-submissions.ts <backup-file>');
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

interface BackupPayload {
  exportedAt: string;
  sourceUrl: string;
  table: string;
  rowCount: number;
  rows: Record<string, unknown>[];
}

async function main() {
  console.log(`Reading ${filePath}`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const payload = JSON.parse(raw) as BackupPayload;

  if (payload.table !== 'station_submissions') {
    console.error(`Refusing to restore: backup is for table "${payload.table}", not station_submissions.`);
    process.exit(1);
  }

  const rows = payload.rows ?? [];
  console.log(`  exportedAt: ${payload.exportedAt}`);
  console.log(`  sourceUrl:  ${payload.sourceUrl}`);
  console.log(`  rows:       ${rows.length}`);
  console.log(`Target:     ${SUPABASE_URL}`);

  if (rows.length === 0) {
    console.log('Nothing to restore.');
    return;
  }

  console.log(`Upserting ${rows.length} row${rows.length === 1 ? '' : 's'} into station_submissions...`);

  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { error } = await supabase
      .from('station_submissions')
      .upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`✗ batch ${i}-${i + chunk.length} failed:`, error);
      process.exit(1);
    }
    inserted += chunk.length;
    process.stdout.write(`  ${inserted}/${rows.length}\r`);
  }
  console.log();
  console.log('✓ Restore complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
