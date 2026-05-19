import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_comparison_positive_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_comparison_positive_side" AS ENUM('left', 'right');
  ALTER TABLE "pages_blocks_comparison" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_comparison" ALTER COLUMN "variant" SET DEFAULT 'splitPanel'::text;
  DROP TYPE "public"."enum_pages_blocks_comparison_variant";
  CREATE TYPE "public"."enum_pages_blocks_comparison_variant" AS ENUM('splitPanel', 'cards');
  ALTER TABLE "pages_blocks_comparison" ALTER COLUMN "variant" SET DEFAULT 'splitPanel'::"public"."enum_pages_blocks_comparison_variant";
  ALTER TABLE "pages_blocks_comparison" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_comparison_variant" USING "variant"::"public"."enum_pages_blocks_comparison_variant";
  ALTER TABLE "_pages_v_blocks_comparison" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_comparison" ALTER COLUMN "variant" SET DEFAULT 'splitPanel'::text;
  DROP TYPE "public"."enum__pages_v_blocks_comparison_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_comparison_variant" AS ENUM('splitPanel', 'cards');
  ALTER TABLE "_pages_v_blocks_comparison" ALTER COLUMN "variant" SET DEFAULT 'splitPanel'::"public"."enum__pages_v_blocks_comparison_variant";
  ALTER TABLE "_pages_v_blocks_comparison" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_comparison_variant" USING "variant"::"public"."enum__pages_v_blocks_comparison_variant";
  
  ALTER TABLE "pages_blocks_comparison_left_items" ALTER COLUMN "description" SET DATA TYPE jsonb USING (
    CASE 
      WHEN description IS NULL THEN NULL 
      ELSE jsonb_build_object(
        'root', jsonb_build_object(
          'type', 'root',
          'children', jsonb_build_array(
            jsonb_build_object(
              'type', 'paragraph',
              'children', jsonb_build_array(
                jsonb_build_object(
                  'text', description,
                  'type', 'text',
                  'version', 1
                )
              ),
              'direction', 'ltr',
              'format', '',
              'indent', 0,
              'version', 1
            )
          ),
          'direction', 'ltr',
          'format', '',
          'indent', 0,
          'version', 1
        )
      )
    END
  );

  ALTER TABLE "pages_blocks_comparison_right_items" ALTER COLUMN "description" SET DATA TYPE jsonb USING (
    CASE 
      WHEN description IS NULL THEN NULL 
      ELSE jsonb_build_object(
        'root', jsonb_build_object(
          'type', 'root',
          'children', jsonb_build_array(
            jsonb_build_object(
              'type', 'paragraph',
              'children', jsonb_build_array(
                jsonb_build_object(
                  'text', description,
                  'type', 'text',
                  'version', 1
                )
              ),
              'direction', 'ltr',
              'format', '',
              'indent', 0,
              'version', 1
            )
          ),
          'direction', 'ltr',
          'format', '',
          'indent', 0,
          'version', 1
        )
      )
    END
  );

  ALTER TABLE "_pages_v_blocks_comparison_left_items" ALTER COLUMN "description" SET DATA TYPE jsonb USING (
    CASE 
      WHEN description IS NULL THEN NULL 
      ELSE jsonb_build_object(
        'root', jsonb_build_object(
          'type', 'root',
          'children', jsonb_build_array(
            jsonb_build_object(
              'type', 'paragraph',
              'children', jsonb_build_array(
                jsonb_build_object(
                  'text', description,
                  'type', 'text',
                  'version', 1
                )
              ),
              'direction', 'ltr',
              'format', '',
              'indent', 0,
              'version', 1
            )
          ),
          'direction', 'ltr',
          'format', '',
          'indent', 0,
          'version', 1
        )
      )
    END
  );

  ALTER TABLE "_pages_v_blocks_comparison_right_items" ALTER COLUMN "description" SET DATA TYPE jsonb USING (
    CASE 
      WHEN description IS NULL THEN NULL 
      ELSE jsonb_build_object(
        'root', jsonb_build_object(
          'type', 'root',
          'children', jsonb_build_array(
            jsonb_build_object(
              'type', 'paragraph',
              'children', jsonb_build_array(
                jsonb_build_object(
                  'text', description,
                  'type', 'text',
                  'version', 1
                )
              ),
              'direction', 'ltr',
              'format', '',
              'indent', 0,
              'version', 1
            )
          ),
          'direction', 'ltr',
          'format', '',
          'indent', 0,
          'version', 1
        )
      )
    END
  );

  ALTER TABLE "pages_blocks_comparison" ADD COLUMN "positive_side" "enum_pages_blocks_comparison_positive_side" DEFAULT 'right';
  ALTER TABLE "pages_blocks_comparison" ADD COLUMN "intro" varchar;
  ALTER TABLE "_pages_v_blocks_comparison" ADD COLUMN "positive_side" "enum__pages_v_blocks_comparison_positive_side" DEFAULT 'right';
  ALTER TABLE "_pages_v_blocks_comparison" ADD COLUMN "intro" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_comparison" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_comparison" ALTER COLUMN "variant" SET DEFAULT 'large'::text;
  DROP TYPE "public"."enum_pages_blocks_comparison_variant";
  CREATE TYPE "public"."enum_pages_blocks_comparison_variant" AS ENUM('large', 'cards');
  ALTER TABLE "pages_blocks_comparison" ALTER COLUMN "variant" SET DEFAULT 'large'::"public"."enum_pages_blocks_comparison_variant";
  ALTER TABLE "pages_blocks_comparison" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_comparison_variant" USING "variant"::"public"."enum_pages_blocks_comparison_variant";
  ALTER TABLE "_pages_v_blocks_comparison" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_comparison" ALTER COLUMN "variant" SET DEFAULT 'large'::text;
  DROP TYPE "public"."enum__pages_v_blocks_comparison_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_comparison_variant" AS ENUM('large', 'cards');
  ALTER TABLE "_pages_v_blocks_comparison" ALTER COLUMN "variant" SET DEFAULT 'large'::"public"."enum__pages_v_blocks_comparison_variant";
  ALTER TABLE "_pages_v_blocks_comparison" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_comparison_variant" USING "variant"::"public"."enum__pages_v_blocks_comparison_variant";
  ALTER TABLE "pages_blocks_comparison_left_items" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "pages_blocks_comparison_right_items" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "_pages_v_blocks_comparison_left_items" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "_pages_v_blocks_comparison_right_items" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "pages_blocks_comparison" DROP COLUMN "positive_side";
  ALTER TABLE "pages_blocks_comparison" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_comparison" DROP COLUMN "positive_side";
  ALTER TABLE "_pages_v_blocks_comparison" DROP COLUMN "intro";
  DROP TYPE "public"."enum_pages_blocks_comparison_positive_side";
  DROP TYPE "public"."enum__pages_v_blocks_comparison_positive_side";`)
}
