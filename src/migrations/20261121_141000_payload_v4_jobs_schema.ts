import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_jobs" ADD COLUMN IF NOT EXISTS "meta" jsonb;
  ALTER TABLE "payload_jobs" ADD COLUMN IF NOT EXISTS "processing_until" timestamp(3) with time zone;
  ALTER TABLE "payload_jobs" ADD COLUMN IF NOT EXISTS "processing_token" varchar;
  ALTER TABLE "payload_jobs" ADD COLUMN IF NOT EXISTS "concurrency_key" varchar;

  CREATE INDEX IF NOT EXISTS "payload_jobs_processing_until_idx" ON "payload_jobs" ("processing_until");
  CREATE INDEX IF NOT EXISTS "payload_jobs_queue_idx" ON "payload_jobs" ("queue");
  CREATE INDEX IF NOT EXISTS "payload_jobs_wait_until_idx" ON "payload_jobs" ("wait_until");

  ALTER TABLE "payload_jobs_log" ADD COLUMN IF NOT EXISTS "parent_task_slug" varchar;
  ALTER TABLE "payload_jobs_log" ADD COLUMN IF NOT EXISTS "parent_task_i_d" varchar;

  ALTER TABLE "users_sessions" ADD COLUMN IF NOT EXISTS "refresh_count" numeric DEFAULT 0;
  ALTER TABLE "users_sessions" ADD COLUMN IF NOT EXISTS "refreshed_at" timestamp(3) with time zone;
  ALTER TABLE "users_sessions" ADD COLUMN IF NOT EXISTS "label" varchar;
  ALTER TABLE "users_sessions" ADD COLUMN IF NOT EXISTS "type" varchar;
  ALTER TABLE "users_sessions" ADD COLUMN IF NOT EXISTS "metadata" jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "users_sessions" DROP COLUMN IF EXISTS "metadata";
  ALTER TABLE "users_sessions" DROP COLUMN IF EXISTS "type";
  ALTER TABLE "users_sessions" DROP COLUMN IF EXISTS "label";
  ALTER TABLE "users_sessions" DROP COLUMN IF EXISTS "refreshed_at";
  ALTER TABLE "users_sessions" DROP COLUMN IF EXISTS "refresh_count";

  ALTER TABLE "payload_jobs_log" DROP COLUMN IF EXISTS "parent_task_i_d";
  ALTER TABLE "payload_jobs_log" DROP COLUMN IF EXISTS "parent_task_slug";

  DROP INDEX IF EXISTS "payload_jobs_wait_until_idx";
  DROP INDEX IF EXISTS "payload_jobs_queue_idx";
  DROP INDEX IF EXISTS "payload_jobs_processing_until_idx";

  ALTER TABLE "payload_jobs" DROP COLUMN IF EXISTS "concurrency_key";
  ALTER TABLE "payload_jobs" DROP COLUMN IF EXISTS "processing_token";
  ALTER TABLE "payload_jobs" DROP COLUMN IF EXISTS "processing_until";
  ALTER TABLE "payload_jobs" DROP COLUMN IF EXISTS "meta";
  `)
}
