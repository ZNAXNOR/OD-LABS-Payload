import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "meta_show_seo_image_in_mega_menu" boolean DEFAULT false;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "meta_show_css_preview_in_mega_menu" boolean DEFAULT true;

    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "meta_show_seo_image_in_mega_menu" boolean DEFAULT true;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "meta_show_css_preview_in_mega_menu" boolean DEFAULT true;

    ALTER TABLE "legal_pages" ADD COLUMN IF NOT EXISTS "meta_show_seo_image_in_mega_menu" boolean DEFAULT false;
    ALTER TABLE "legal_pages" ADD COLUMN IF NOT EXISTS "meta_show_css_preview_in_mega_menu" boolean DEFAULT true;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "meta_show_seo_image_in_mega_menu";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "meta_show_css_preview_in_mega_menu";

    ALTER TABLE "posts" DROP COLUMN IF EXISTS "meta_show_seo_image_in_mega_menu";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "meta_show_css_preview_in_mega_menu";

    ALTER TABLE "legal_pages" DROP COLUMN IF EXISTS "meta_show_seo_image_in_mega_menu";
    ALTER TABLE "legal_pages" DROP COLUMN IF EXISTS "meta_show_css_preview_in_mega_menu";
  `)
}
