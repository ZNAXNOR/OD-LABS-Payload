import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "forms_blocks_checkbox" ADD COLUMN IF NOT EXISTS "placeholder" varchar;
  ALTER TABLE "forms_blocks_country" ADD COLUMN IF NOT EXISTS "placeholder" varchar;
  ALTER TABLE "forms_blocks_date" ADD COLUMN IF NOT EXISTS "placeholder" varchar;
  ALTER TABLE "forms_blocks_email" ADD COLUMN IF NOT EXISTS "placeholder" varchar;
  ALTER TABLE "forms_blocks_number" ADD COLUMN IF NOT EXISTS "placeholder" varchar;
  ALTER TABLE "forms_blocks_radio" ADD COLUMN IF NOT EXISTS "placeholder" varchar;
  ALTER TABLE "forms_blocks_state" ADD COLUMN IF NOT EXISTS "placeholder" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN IF NOT EXISTS "placeholder" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN IF NOT EXISTS "placeholder" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "forms_blocks_checkbox" DROP COLUMN IF EXISTS "placeholder";
  ALTER TABLE "forms_blocks_country" DROP COLUMN IF EXISTS "placeholder";
  ALTER TABLE "forms_blocks_date" DROP COLUMN IF EXISTS "placeholder";
  ALTER TABLE "forms_blocks_email" DROP COLUMN IF EXISTS "placeholder";
  ALTER TABLE "forms_blocks_number" DROP COLUMN IF EXISTS "placeholder";
  ALTER TABLE "forms_blocks_radio" DROP COLUMN IF EXISTS "placeholder";
  ALTER TABLE "forms_blocks_state" DROP COLUMN IF EXISTS "placeholder";
  ALTER TABLE "forms_blocks_text" DROP COLUMN IF EXISTS "placeholder";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN IF EXISTS "placeholder";
  `)
}
