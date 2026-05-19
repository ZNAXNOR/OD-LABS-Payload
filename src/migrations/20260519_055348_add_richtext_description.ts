import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_feature_block_items" ALTER COLUMN "description" SET DATA TYPE jsonb USING (
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
  ALTER TABLE "_pages_v_blocks_feature_block_items" ALTER COLUMN "description" SET DATA TYPE jsonb USING (
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
  );`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_feature_block_items" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "_pages_v_blocks_feature_block_items" ALTER COLUMN "description" SET DATA TYPE varchar;`)
}
