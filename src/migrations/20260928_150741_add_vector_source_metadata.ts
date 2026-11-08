import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "odlabs_knowledge" ADD COLUMN "page_title" varchar;
  ALTER TABLE "odlabs_knowledge" ADD COLUMN "page_slug" varchar;
  ALTER TABLE "odlabs_knowledge" ADD COLUMN "section" varchar;
  ALTER TABLE "odlabs_knowledge" ADD COLUMN "block_type" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "odlabs_knowledge" DROP COLUMN "page_title";
  ALTER TABLE "odlabs_knowledge" DROP COLUMN "page_slug";
  ALTER TABLE "odlabs_knowledge" DROP COLUMN "section";
  ALTER TABLE "odlabs_knowledge" DROP COLUMN "block_type";`)
}
