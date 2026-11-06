import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "preview_step_title" varchar DEFAULT 'Review & submit';
  ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "preview_step_description" jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "forms" DROP COLUMN IF EXISTS "preview_step_title";
  ALTER TABLE "forms" DROP COLUMN IF EXISTS "preview_step_description";
  `)
}
