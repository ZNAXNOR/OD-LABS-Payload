import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "forms_rels" (
    "id" serial PRIMARY KEY,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer
  );
  CREATE INDEX IF NOT EXISTS "forms_rels_order_idx" ON "forms_rels" ("order");
  CREATE INDEX IF NOT EXISTS "forms_rels_parent_idx" ON "forms_rels" ("parent_id");
  CREATE INDEX IF NOT EXISTS "forms_rels_path_idx" ON "forms_rels" ("path");

  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "prefix" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_stored" boolean;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_transforms" jsonb;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "original_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "original_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "original_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "original_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "original_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "original_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "original_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "original__objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "original__stored" boolean;

  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_thumbnail_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_thumbnail_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_thumbnail_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_thumbnail_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_thumbnail_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_thumbnail_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_thumbnail_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_thumbnail__objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_thumbnail__stored" boolean;

  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_square_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_square_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_square_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_square_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_square_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_square_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_square_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_square__objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_square__stored" boolean;

  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_small_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_small_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_small_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_small_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_small_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_small_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_small_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_small__objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_small__stored" boolean;

  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_medium_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_medium_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_medium_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_medium_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_medium_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_medium_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_medium_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_medium__objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_medium__stored" boolean;

  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_large_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_large_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_large_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_large_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_large_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_large_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_large_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_large__objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_large__stored" boolean;

  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_xlarge_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_xlarge_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_xlarge_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_xlarge_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_xlarge_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_xlarge_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_xlarge_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_xlarge__objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_xlarge__stored" boolean;

  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_og_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_og_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_og_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_og_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_og_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_og_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_og_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_og__objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "variants_og__stored" boolean;

  UPDATE "media" SET 
    "variants_thumbnail_url" = COALESCE("variants_thumbnail_url", "sizes_thumbnail_url"),
    "variants_thumbnail_width" = COALESCE("variants_thumbnail_width", "sizes_thumbnail_width"),
    "variants_thumbnail_height" = COALESCE("variants_thumbnail_height", "sizes_thumbnail_height"),
    "variants_thumbnail_mime_type" = COALESCE("variants_thumbnail_mime_type", "sizes_thumbnail_mime_type"),
    "variants_thumbnail_filesize" = COALESCE("variants_thumbnail_filesize", "sizes_thumbnail_filesize"),
    "variants_thumbnail_filename" = COALESCE("variants_thumbnail_filename", "sizes_thumbnail_filename"),
    "variants_square_url" = COALESCE("variants_square_url", "sizes_square_url"),
    "variants_square_width" = COALESCE("variants_square_width", "sizes_square_width"),
    "variants_square_height" = COALESCE("variants_square_height", "sizes_square_height"),
    "variants_square_mime_type" = COALESCE("variants_square_mime_type", "sizes_square_mime_type"),
    "variants_square_filesize" = COALESCE("variants_square_filesize", "sizes_square_filesize"),
    "variants_square_filename" = COALESCE("variants_square_filename", "sizes_square_filename"),
    "variants_small_url" = COALESCE("variants_small_url", "sizes_small_url"),
    "variants_small_width" = COALESCE("variants_small_width", "sizes_small_width"),
    "variants_small_height" = COALESCE("variants_small_height", "sizes_small_height"),
    "variants_small_mime_type" = COALESCE("variants_small_mime_type", "sizes_small_mime_type"),
    "variants_small_filesize" = COALESCE("variants_small_filesize", "sizes_small_filesize"),
    "variants_small_filename" = COALESCE("variants_small_filename", "sizes_small_filename"),
    "variants_medium_url" = COALESCE("variants_medium_url", "sizes_medium_url"),
    "variants_medium_width" = COALESCE("variants_medium_width", "sizes_medium_width"),
    "variants_medium_height" = COALESCE("variants_medium_height", "sizes_medium_height"),
    "variants_medium_mime_type" = COALESCE("variants_medium_mime_type", "sizes_medium_mime_type"),
    "variants_medium_filesize" = COALESCE("variants_medium_filesize", "sizes_medium_filesize"),
    "variants_medium_filename" = COALESCE("variants_medium_filename", "sizes_medium_filename"),
    "variants_large_url" = COALESCE("variants_large_url", "sizes_large_url"),
    "variants_large_width" = COALESCE("variants_large_width", "sizes_large_width"),
    "variants_large_height" = COALESCE("variants_large_height", "sizes_large_height"),
    "variants_large_mime_type" = COALESCE("variants_large_mime_type", "sizes_large_mime_type"),
    "variants_large_filesize" = COALESCE("variants_large_filesize", "sizes_large_filesize"),
    "variants_large_filename" = COALESCE("variants_large_filename", "sizes_large_filename"),
    "variants_xlarge_url" = COALESCE("variants_xlarge_url", "sizes_xlarge_url"),
    "variants_xlarge_width" = COALESCE("variants_xlarge_width", "sizes_xlarge_width"),
    "variants_xlarge_height" = COALESCE("variants_xlarge_height", "sizes_xlarge_height"),
    "variants_xlarge_mime_type" = COALESCE("variants_xlarge_mime_type", "sizes_xlarge_mime_type"),
    "variants_xlarge_filesize" = COALESCE("variants_xlarge_filesize", "sizes_xlarge_filesize"),
    "variants_xlarge_filename" = COALESCE("variants_xlarge_filename", "sizes_xlarge_filename"),
    "variants_og_url" = COALESCE("variants_og_url", "sizes_og_url"),
    "variants_og_width" = COALESCE("variants_og_width", "sizes_og_width"),
    "variants_og_height" = COALESCE("variants_og_height", "sizes_og_height"),
    "variants_og_mime_type" = COALESCE("variants_og_mime_type", "sizes_og_mime_type"),
    "variants_og_filesize" = COALESCE("variants_og_filesize", "sizes_og_filesize"),
    "variants_og_filename" = COALESCE("variants_og_filename", "sizes_og_filename");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "forms_rels";
  `)
}
