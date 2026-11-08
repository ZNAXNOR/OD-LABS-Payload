import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN IF NOT EXISTS "variant" varchar DEFAULT 'default';
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN IF EXISTS "variant";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "reset_password_requested_at";
  `)
}
