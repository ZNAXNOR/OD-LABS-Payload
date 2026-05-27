import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "sect_left" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "sect_right" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "_sect_v_left" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_sect_v_right" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "sect" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "sect" ALTER COLUMN "variant" SET DEFAULT 'secondary'::text;
  DROP TYPE "public"."enum_sect_variant";
  CREATE TYPE "public"."enum_sect_variant" AS ENUM('primary', 'secondary', 'highlight');
  ALTER TABLE "sect" ALTER COLUMN "variant" SET DEFAULT 'secondary'::"public"."enum_sect_variant";
  ALTER TABLE "sect" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_sect_variant" USING "variant"::"public"."enum_sect_variant";
  ALTER TABLE "_sect_v" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_sect_v" ALTER COLUMN "variant" SET DEFAULT 'secondary'::text;
  DROP TYPE "public"."enum__sect_v_variant";
  CREATE TYPE "public"."enum__sect_v_variant" AS ENUM('primary', 'secondary', 'highlight');
  ALTER TABLE "_sect_v" ALTER COLUMN "variant" SET DEFAULT 'secondary'::"public"."enum__sect_v_variant";
  ALTER TABLE "_sect_v" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__sect_v_variant" USING "variant"::"public"."enum__sect_v_variant";
  ALTER TABLE "sect_left" ADD CONSTRAINT "sect_left_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sect"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sect_right" ADD CONSTRAINT "sect_right_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sect"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sect_v_left" ADD CONSTRAINT "_sect_v_left_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sect_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sect_v_right" ADD CONSTRAINT "_sect_v_right_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sect_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sect_left_order_idx" ON "sect_left" USING btree ("_order");
  CREATE INDEX "sect_left_parent_id_idx" ON "sect_left" USING btree ("_parent_id");
  CREATE INDEX "sect_right_order_idx" ON "sect_right" USING btree ("_order");
  CREATE INDEX "sect_right_parent_id_idx" ON "sect_right" USING btree ("_parent_id");
  CREATE INDEX "_sect_v_left_order_idx" ON "_sect_v_left" USING btree ("_order");
  CREATE INDEX "_sect_v_left_parent_id_idx" ON "_sect_v_left" USING btree ("_parent_id");
  CREATE INDEX "_sect_v_right_order_idx" ON "_sect_v_right" USING btree ("_order");
  CREATE INDEX "_sect_v_right_parent_id_idx" ON "_sect_v_right" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sect_left" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sect_right" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_sect_v_left" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_sect_v_right" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sect_left" CASCADE;
  DROP TABLE "sect_right" CASCADE;
  DROP TABLE "_sect_v_left" CASCADE;
  DROP TABLE "_sect_v_right" CASCADE;
  ALTER TABLE "sect" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "sect" ALTER COLUMN "variant" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_sect_variant";
  CREATE TYPE "public"."enum_sect_variant" AS ENUM('default', 'highlight');
  ALTER TABLE "sect" ALTER COLUMN "variant" SET DEFAULT 'default'::"public"."enum_sect_variant";
  ALTER TABLE "sect" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_sect_variant" USING "variant"::"public"."enum_sect_variant";
  ALTER TABLE "_sect_v" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_sect_v" ALTER COLUMN "variant" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__sect_v_variant";
  CREATE TYPE "public"."enum__sect_v_variant" AS ENUM('default', 'highlight');
  ALTER TABLE "_sect_v" ALTER COLUMN "variant" SET DEFAULT 'default'::"public"."enum__sect_v_variant";
  ALTER TABLE "_sect_v" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__sect_v_variant" USING "variant"::"public"."enum__sect_v_variant";`)
}
