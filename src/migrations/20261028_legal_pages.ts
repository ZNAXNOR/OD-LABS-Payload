import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "legal_pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "description" varchar,
      "content_mode" varchar DEFAULT 'richText' NOT NULL,
      "content" jsonb,
      "embed_script_url" varchar,
      "embed_script_id" varchar,
      "embed_container_id" varchar,
      "embed_container_class" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "legal_pages_embed_script_attributes" (
      "id" serial PRIMARY KEY NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "legal_pages"("id") ON DELETE CASCADE,
      "name" varchar NOT NULL,
      "value" varchar
    );
  `)

  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "legal_pages_slug_idx" ON "legal_pages" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "legal_pages_embed_script_attributes_order_idx" ON "legal_pages_embed_script_attributes" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "legal_pages_embed_script_attributes_parent_id_idx" ON "legal_pages_embed_script_attributes" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "legal_pages_embed_script_attributes" CASCADE;
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "legal_pages" CASCADE;
  `)
}
