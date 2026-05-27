import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_service_showcase_items_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"capability" varchar
  );
  
  CREATE TABLE "pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_showcase_items_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"capability" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "pages_blocks_service_showcase_items_capabilities" ADD CONSTRAINT "pages_blocks_service_showcase_items_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_showcase_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_showcase_items_capabilities" ADD CONSTRAINT "_pages_v_blocks_service_showcase_items_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_showcase_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_service_showcase_items_capabilities_order_idx" ON "pages_blocks_service_showcase_items_capabilities" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_showcase_items_capabilities_parent_id_idx" ON "pages_blocks_service_showcase_items_capabilities" USING btree ("_parent_id");
  CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "_pages_v_blocks_service_showcase_items_capabilities_order_idx" ON "_pages_v_blocks_service_showcase_items_capabilities" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_showcase_items_capabilities_parent_id_idx" ON "_pages_v_blocks_service_showcase_items_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_texts_order_parent" ON "_pages_v_texts" USING btree ("order","parent_id");
  ALTER TABLE "pages_blocks_service_showcase_items" DROP COLUMN "deliverables";
  ALTER TABLE "pages_blocks_service_showcase_items" DROP COLUMN "capabilities";
  ALTER TABLE "_pages_v_blocks_service_showcase_items" DROP COLUMN "deliverables";
  ALTER TABLE "_pages_v_blocks_service_showcase_items" DROP COLUMN "capabilities";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_service_showcase_items_capabilities" CASCADE;
  DROP TABLE "pages_texts" CASCADE;
  DROP TABLE "_pages_v_blocks_service_showcase_items_capabilities" CASCADE;
  DROP TABLE "_pages_v_texts" CASCADE;
  ALTER TABLE "pages_blocks_service_showcase_items" ADD COLUMN "deliverables" jsonb;
  ALTER TABLE "pages_blocks_service_showcase_items" ADD COLUMN "capabilities" jsonb;
  ALTER TABLE "_pages_v_blocks_service_showcase_items" ADD COLUMN "deliverables" jsonb;
  ALTER TABLE "_pages_v_blocks_service_showcase_items" ADD COLUMN "capabilities" jsonb;`)
}
