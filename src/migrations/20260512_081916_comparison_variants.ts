import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_comparison_variant" AS ENUM('large', 'cards');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_feature_block_items_icon" AS ENUM('Rocket', 'Settings', 'Check', 'Users', 'Zap', 'Shield');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_comparison_variant" AS ENUM('large', 'cards');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_feature_block_items_icon" AS ENUM('Rocket', 'Settings', 'Check', 'Users', 'Zap', 'Shield');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE "pages_blocks_feature_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_feature_block_items_icon" DEFAULT 'Rocket',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_feature_block_items_icon" DEFAULT 'Rocket',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "enable_helper_link" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_comparison" ADD COLUMN "variant" "enum_pages_blocks_comparison_variant" DEFAULT 'large';
  ALTER TABLE "pages_blocks_comparison" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_comparison" ADD COLUMN "intro" varchar;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "enable_helper_link" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_comparison" ADD COLUMN "variant" "enum__pages_v_blocks_comparison_variant" DEFAULT 'large';
  ALTER TABLE "_pages_v_blocks_comparison" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_comparison" ADD COLUMN "intro" varchar;
  ALTER TABLE "pages_blocks_feature_block_items" ADD CONSTRAINT "pages_blocks_feature_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_block" ADD CONSTRAINT "pages_blocks_feature_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_block_items" ADD CONSTRAINT "_pages_v_blocks_feature_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_block" ADD CONSTRAINT "_pages_v_blocks_feature_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_feature_block_items_order_idx" ON "pages_blocks_feature_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_block_items_parent_id_idx" ON "pages_blocks_feature_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_block_order_idx" ON "pages_blocks_feature_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_block_parent_id_idx" ON "pages_blocks_feature_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_block_path_idx" ON "pages_blocks_feature_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_block_items_order_idx" ON "_pages_v_blocks_feature_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_block_items_parent_id_idx" ON "_pages_v_blocks_feature_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_block_order_idx" ON "_pages_v_blocks_feature_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_block_parent_id_idx" ON "_pages_v_blocks_feature_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_block_path_idx" ON "_pages_v_blocks_feature_block" USING btree ("_path");
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "helper_link_type";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "helper_link_new_tab";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "helper_link_url";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "helper_link_type";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "helper_link_new_tab";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "helper_link_url";
  DROP TYPE "public"."enum_pages_blocks_cta_helper_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_helper_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_helper_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_helper_link_type" AS ENUM('reference', 'custom');
  DROP TABLE "pages_blocks_feature_block_items" CASCADE;
  DROP TABLE "pages_blocks_feature_block" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_block" CASCADE;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "helper_link_type" "enum_pages_blocks_cta_helper_link_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "helper_link_new_tab" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "helper_link_url" varchar;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "helper_link_type" "enum__pages_v_blocks_cta_helper_link_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "helper_link_new_tab" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "helper_link_url" varchar;
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "enable_helper_link";
  ALTER TABLE "pages_blocks_comparison" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_comparison" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_comparison" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "enable_helper_link";
  ALTER TABLE "_pages_v_blocks_comparison" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_comparison" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_comparison" DROP COLUMN "intro";
  DROP TYPE "public"."enum_pages_blocks_comparison_variant";
  DROP TYPE "public"."enum_pages_blocks_feature_block_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_comparison_variant";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_items_icon";`)
}
