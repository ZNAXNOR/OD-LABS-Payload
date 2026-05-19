import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_comparison_left_items_icon" AS ENUM('architecture', 'foundation', 'communication', 'speed', 'groups', 'experiment');
  CREATE TYPE "public"."enum_pages_blocks_comparison_right_items_icon" AS ENUM('architecture', 'foundation', 'communication', 'speed', 'groups', 'experiment');
  CREATE TYPE "public"."enum__pages_v_blocks_comparison_left_items_icon" AS ENUM('architecture', 'foundation', 'communication', 'speed', 'groups', 'experiment');
  CREATE TYPE "public"."enum__pages_v_blocks_comparison_right_items_icon" AS ENUM('architecture', 'foundation', 'communication', 'speed', 'groups', 'experiment');
  ALTER TABLE "pages_blocks_comparison_left_items" ADD COLUMN "icon" "enum_pages_blocks_comparison_left_items_icon" DEFAULT 'architecture';
  ALTER TABLE "pages_blocks_comparison_right_items" ADD COLUMN "icon" "enum_pages_blocks_comparison_right_items_icon" DEFAULT 'architecture';
  ALTER TABLE "_pages_v_blocks_comparison_left_items" ADD COLUMN "icon" "enum__pages_v_blocks_comparison_left_items_icon" DEFAULT 'architecture';
  ALTER TABLE "_pages_v_blocks_comparison_right_items" ADD COLUMN "icon" "enum__pages_v_blocks_comparison_right_items_icon" DEFAULT 'architecture';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_comparison_left_items" DROP COLUMN "icon";
  ALTER TABLE "pages_blocks_comparison_right_items" DROP COLUMN "icon";
  ALTER TABLE "_pages_v_blocks_comparison_left_items" DROP COLUMN "icon";
  ALTER TABLE "_pages_v_blocks_comparison_right_items" DROP COLUMN "icon";
  DROP TYPE "public"."enum_pages_blocks_comparison_left_items_icon";
  DROP TYPE "public"."enum_pages_blocks_comparison_right_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_comparison_left_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_comparison_right_items_icon";`)
}
