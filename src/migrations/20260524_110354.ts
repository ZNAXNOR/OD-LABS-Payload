import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_art_pf_steps_icon" AS ENUM('none', 'GitCommitHorizontal', 'FlaskConical', 'Rocket');
  CREATE TYPE "public"."enum__art_pf_steps_v_icon" AS ENUM('none', 'GitCommitHorizontal', 'FlaskConical', 'Rocket');
  ALTER TABLE "pages_blocks_artifact_block_items" ALTER COLUMN "width" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_artifact_block_items" ALTER COLUMN "width" SET DEFAULT 'oneThird'::text;
  ALTER TABLE "_pages_v_blocks_artifact_block_items" ALTER COLUMN "width" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_artifact_block_items" ALTER COLUMN "width" SET DEFAULT 'oneThird'::text;
  DROP TYPE "public"."wd";
  CREATE TYPE "public"."wd" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  ALTER TABLE "pages_blocks_artifact_block_items" ALTER COLUMN "width" SET DEFAULT 'oneThird'::"public"."wd";
  ALTER TABLE "pages_blocks_artifact_block_items" ALTER COLUMN "width" SET DATA TYPE "public"."wd" USING "width"::"public"."wd";
  ALTER TABLE "_pages_v_blocks_artifact_block_items" ALTER COLUMN "width" SET DEFAULT 'oneThird'::"public"."wd";
  ALTER TABLE "_pages_v_blocks_artifact_block_items" ALTER COLUMN "width" SET DATA TYPE "public"."wd" USING "width"::"public"."wd";
  ALTER TABLE "art_pf_steps" ADD COLUMN "icon" "enum_art_pf_steps_icon" DEFAULT 'none';
  ALTER TABLE "art_pf_steps" ADD COLUMN "highlight" boolean DEFAULT false;
  ALTER TABLE "_art_pf_steps_v" ADD COLUMN "icon" "enum__art_pf_steps_v_icon" DEFAULT 'none';
  ALTER TABLE "_art_pf_steps_v" ADD COLUMN "highlight" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_artifact_block_items" ALTER COLUMN "width" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_artifact_block_items" ALTER COLUMN "width" SET DEFAULT 'oneThird'::text;
  ALTER TABLE "_pages_v_blocks_artifact_block_items" ALTER COLUMN "width" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_artifact_block_items" ALTER COLUMN "width" SET DEFAULT 'oneThird'::text;
  DROP TYPE "public"."wd";
  CREATE TYPE "public"."wd" AS ENUM('oneThird', 'twoThirds', 'half', 'full');
  ALTER TABLE "pages_blocks_artifact_block_items" ALTER COLUMN "width" SET DEFAULT 'oneThird'::"public"."wd";
  ALTER TABLE "pages_blocks_artifact_block_items" ALTER COLUMN "width" SET DATA TYPE "public"."wd" USING "width"::"public"."wd";
  ALTER TABLE "_pages_v_blocks_artifact_block_items" ALTER COLUMN "width" SET DEFAULT 'oneThird'::"public"."wd";
  ALTER TABLE "_pages_v_blocks_artifact_block_items" ALTER COLUMN "width" SET DATA TYPE "public"."wd" USING "width"::"public"."wd";
  ALTER TABLE "art_pf_steps" DROP COLUMN "icon";
  ALTER TABLE "art_pf_steps" DROP COLUMN "highlight";
  ALTER TABLE "_art_pf_steps_v" DROP COLUMN "icon";
  ALTER TABLE "_art_pf_steps_v" DROP COLUMN "highlight";
  DROP TYPE "public"."enum_art_pf_steps_icon";
  DROP TYPE "public"."enum__art_pf_steps_v_icon";`)
}
