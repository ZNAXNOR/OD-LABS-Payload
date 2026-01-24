import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum_pages_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum_pages_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum_pages_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum_pages_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum_pages_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum_pages_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum_pages_blocks_project_showcase_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_project_showcase_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum__pages_v_blocks_project_showcase_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_project_showcase_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_blogs_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_blogs_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum_blogs_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum_blogs_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_blogs_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_blogs_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum_blogs_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum_blogs_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum_blogs_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum_blogs_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum_services_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_services_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum_services_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum_services_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_services_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_services_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum_services_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum_services_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum_services_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum_services_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum__services_v_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__services_v_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum__services_v_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum__services_v_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__services_v_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__services_v_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum__services_v_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum__services_v_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum__services_v_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum__services_v_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum_contacts_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_contacts_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum_contacts_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum_contacts_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_contacts_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_contacts_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum_contacts_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum_contacts_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum_contacts_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum_contacts_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TABLE "pages_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_link_type" "link_type" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "link_appearance" DEFAULT 'default',
  	"priority" "enum_pages_blocks_hero_actions_priority" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum_pages_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum_pages_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum_pages_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum_pages_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum_pages_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum_pages_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum_pages_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum_pages_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_project_showcase_projects_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"technology" varchar
  );
  
  CREATE TABLE "pages_blocks_project_showcase_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"category" varchar,
  	"project_link_link_type" "link_type" DEFAULT 'reference',
  	"project_link_link_new_tab" boolean,
  	"project_link_link_url" varchar,
  	"project_link_link_label" varchar,
  	"project_link_link_appearance" "link_appearance" DEFAULT 'default',
  	"github_url" varchar,
  	"live_url" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_project_showcase_filter_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" varchar
  );
  
  CREATE TABLE "pages_blocks_project_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum_pages_blocks_project_showcase_layout" DEFAULT 'grid',
  	"columns" "enum_pages_blocks_project_showcase_columns" DEFAULT '3',
  	"enable_filtering" boolean DEFAULT true,
  	"show_load_more" boolean DEFAULT false,
  	"items_per_page" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_link_type" "link_type" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "link_appearance" DEFAULT 'default',
  	"priority" "enum__pages_v_blocks_hero_actions_priority" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum__pages_v_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum__pages_v_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum__pages_v_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum__pages_v_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum__pages_v_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum__pages_v_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum__pages_v_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum__pages_v_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_showcase_projects_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"technology" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_showcase_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"category" varchar,
  	"project_link_link_type" "link_type" DEFAULT 'reference',
  	"project_link_link_new_tab" boolean,
  	"project_link_link_url" varchar,
  	"project_link_link_label" varchar,
  	"project_link_link_appearance" "link_appearance" DEFAULT 'default',
  	"github_url" varchar,
  	"live_url" varchar,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_showcase_filter_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum__pages_v_blocks_project_showcase_layout" DEFAULT 'grid',
  	"columns" "enum__pages_v_blocks_project_showcase_columns" DEFAULT '3',
  	"enable_filtering" boolean DEFAULT true,
  	"show_load_more" boolean DEFAULT false,
  	"items_per_page" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar
  );
  
  CREATE TABLE "blogs_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_link_type" "link_type" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "link_appearance" DEFAULT 'default',
  	"priority" "enum_blogs_blocks_hero_actions_priority" DEFAULT 'primary'
  );
  
  CREATE TABLE "blogs_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_blogs_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum_blogs_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum_blogs_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum_blogs_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum_blogs_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum_blogs_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum_blogs_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum_blogs_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum_blogs_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_link_type" "link_type" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "link_appearance" DEFAULT 'default',
  	"priority" "enum__blogs_v_blocks_hero_actions_priority" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__blogs_v_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum__blogs_v_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum__blogs_v_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum__blogs_v_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum__blogs_v_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum__blogs_v_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum__blogs_v_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum__blogs_v_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum__blogs_v_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar
  );
  
  CREATE TABLE "services_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_link_type" "link_type" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "link_appearance" DEFAULT 'default',
  	"priority" "enum_services_blocks_hero_actions_priority" DEFAULT 'primary'
  );
  
  CREATE TABLE "services_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_services_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum_services_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum_services_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum_services_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum_services_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum_services_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum_services_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum_services_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum_services_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_link_type" "link_type" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "link_appearance" DEFAULT 'default',
  	"priority" "enum__services_v_blocks_hero_actions_priority" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__services_v_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum__services_v_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum__services_v_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum__services_v_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum__services_v_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum__services_v_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum__services_v_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum__services_v_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum__services_v_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "contacts_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar
  );
  
  CREATE TABLE "contacts_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_link_type" "link_type" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "link_appearance" DEFAULT 'default',
  	"priority" "enum_contacts_blocks_hero_actions_priority" DEFAULT 'primary'
  );
  
  CREATE TABLE "contacts_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_contacts_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum_contacts_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum_contacts_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum_contacts_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum_contacts_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum_contacts_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum_contacts_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum_contacts_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum_contacts_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"block_name" varchar
  );
  
  CREATE TABLE "contacts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "_contacts_v_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_link_type" "link_type" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "link_appearance" DEFAULT 'default',
  	"priority" "enum__contacts_v_blocks_hero_actions_priority" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__contacts_v_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum__contacts_v_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum__contacts_v_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum__contacts_v_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum__contacts_v_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum__contacts_v_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum__contacts_v_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum__contacts_v_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum__contacts_v_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contacts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  DROP TABLE "colors" CASCADE;
  DROP TABLE "actions" CASCADE;
  DROP TABLE "hero_block" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "filter_cats" CASCADE;
  DROP TABLE "proj_showcase" CASCADE;
  DROP TABLE "_colors_v" CASCADE;
  DROP TABLE "_actions_v" CASCADE;
  DROP TABLE "_hero_block_v" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_filter_cats_v" CASCADE;
  DROP TABLE "_proj_showcase_v" CASCADE;
  ALTER TABLE "pages_blocks_hero_gradient_config_colors" ADD CONSTRAINT "pages_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_actions" ADD CONSTRAINT "pages_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_showcase_projects_technologies" ADD CONSTRAINT "pages_blocks_project_showcase_projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_project_showcase_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_showcase_projects" ADD CONSTRAINT "pages_blocks_project_showcase_projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_showcase_projects" ADD CONSTRAINT "pages_blocks_project_showcase_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_project_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_showcase_filter_categories" ADD CONSTRAINT "pages_blocks_project_showcase_filter_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_project_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_showcase" ADD CONSTRAINT "pages_blocks_project_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_gradient_config_colors" ADD CONSTRAINT "_pages_v_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_actions" ADD CONSTRAINT "_pages_v_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_showcase_projects_technologies" ADD CONSTRAINT "_pages_v_blocks_project_showcase_projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_project_showcase_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_showcase_projects" ADD CONSTRAINT "_pages_v_blocks_project_showcase_projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_showcase_projects" ADD CONSTRAINT "_pages_v_blocks_project_showcase_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_project_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_showcase_filter_categories" ADD CONSTRAINT "_pages_v_blocks_project_showcase_filter_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_project_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_showcase" ADD CONSTRAINT "_pages_v_blocks_project_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_hero_gradient_config_colors" ADD CONSTRAINT "blogs_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_hero_actions" ADD CONSTRAINT "blogs_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_hero" ADD CONSTRAINT "blogs_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_blocks_hero" ADD CONSTRAINT "blogs_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_hero_gradient_config_colors" ADD CONSTRAINT "_blogs_v_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_hero_actions" ADD CONSTRAINT "_blogs_v_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_hero" ADD CONSTRAINT "_blogs_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_hero" ADD CONSTRAINT "_blogs_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_hero_gradient_config_colors" ADD CONSTRAINT "services_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_hero_actions" ADD CONSTRAINT "services_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_hero" ADD CONSTRAINT "services_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_hero" ADD CONSTRAINT "services_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_hero_gradient_config_colors" ADD CONSTRAINT "_services_v_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_hero_actions" ADD CONSTRAINT "_services_v_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_hero" ADD CONSTRAINT "_services_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_hero" ADD CONSTRAINT "_services_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_hero_gradient_config_colors" ADD CONSTRAINT "contacts_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_hero_actions" ADD CONSTRAINT "contacts_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_hero" ADD CONSTRAINT "contacts_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_blocks_hero" ADD CONSTRAINT "contacts_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_hero_gradient_config_colors" ADD CONSTRAINT "_contacts_v_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_hero_actions" ADD CONSTRAINT "_contacts_v_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_hero" ADD CONSTRAINT "_contacts_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_hero" ADD CONSTRAINT "_contacts_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_gradient_config_colors_order_idx" ON "pages_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_gradient_config_colors_parent_id_idx" ON "pages_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_actions_order_idx" ON "pages_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_actions_parent_id_idx" ON "pages_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_media_idx" ON "pages_blocks_hero" USING btree ("media_id");
  CREATE INDEX "pages_blocks_project_showcase_projects_technologies_order_idx" ON "pages_blocks_project_showcase_projects_technologies" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_showcase_projects_technologies_parent_id_idx" ON "pages_blocks_project_showcase_projects_technologies" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_showcase_projects_order_idx" ON "pages_blocks_project_showcase_projects" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_showcase_projects_parent_id_idx" ON "pages_blocks_project_showcase_projects" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_showcase_projects_image_idx" ON "pages_blocks_project_showcase_projects" USING btree ("image_id");
  CREATE INDEX "pages_blocks_project_showcase_filter_categories_order_idx" ON "pages_blocks_project_showcase_filter_categories" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_showcase_filter_categories_parent_id_idx" ON "pages_blocks_project_showcase_filter_categories" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_showcase_order_idx" ON "pages_blocks_project_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_showcase_parent_id_idx" ON "pages_blocks_project_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_showcase_path_idx" ON "pages_blocks_project_showcase" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_gradient_config_colors_order_idx" ON "_pages_v_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_gradient_config_colors_parent_id_idx" ON "_pages_v_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_actions_order_idx" ON "_pages_v_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_actions_parent_id_idx" ON "_pages_v_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_media_idx" ON "_pages_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_project_showcase_projects_technologies_order_idx" ON "_pages_v_blocks_project_showcase_projects_technologies" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_showcase_projects_technologies_parent_id_idx" ON "_pages_v_blocks_project_showcase_projects_technologies" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_showcase_projects_order_idx" ON "_pages_v_blocks_project_showcase_projects" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_showcase_projects_parent_id_idx" ON "_pages_v_blocks_project_showcase_projects" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_showcase_projects_image_idx" ON "_pages_v_blocks_project_showcase_projects" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_project_showcase_filter_categories_order_idx" ON "_pages_v_blocks_project_showcase_filter_categories" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_showcase_filter_categories_parent_id_idx" ON "_pages_v_blocks_project_showcase_filter_categories" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_showcase_order_idx" ON "_pages_v_blocks_project_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_showcase_parent_id_idx" ON "_pages_v_blocks_project_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_showcase_path_idx" ON "_pages_v_blocks_project_showcase" USING btree ("_path");
  CREATE INDEX "blogs_blocks_hero_gradient_config_colors_order_idx" ON "blogs_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "blogs_blocks_hero_gradient_config_colors_parent_id_idx" ON "blogs_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_hero_actions_order_idx" ON "blogs_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "blogs_blocks_hero_actions_parent_id_idx" ON "blogs_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_hero_order_idx" ON "blogs_blocks_hero" USING btree ("_order");
  CREATE INDEX "blogs_blocks_hero_parent_id_idx" ON "blogs_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_hero_path_idx" ON "blogs_blocks_hero" USING btree ("_path");
  CREATE INDEX "blogs_blocks_hero_media_idx" ON "blogs_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_blogs_v_blocks_hero_gradient_config_colors_order_idx" ON "_blogs_v_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_hero_gradient_config_colors_parent_id_idx" ON "_blogs_v_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_hero_actions_order_idx" ON "_blogs_v_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_hero_actions_parent_id_idx" ON "_blogs_v_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_hero_order_idx" ON "_blogs_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_hero_parent_id_idx" ON "_blogs_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_hero_path_idx" ON "_blogs_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_hero_media_idx" ON "_blogs_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "services_blocks_hero_gradient_config_colors_order_idx" ON "services_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "services_blocks_hero_gradient_config_colors_parent_id_idx" ON "services_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_hero_actions_order_idx" ON "services_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "services_blocks_hero_actions_parent_id_idx" ON "services_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_hero_order_idx" ON "services_blocks_hero" USING btree ("_order");
  CREATE INDEX "services_blocks_hero_parent_id_idx" ON "services_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_hero_path_idx" ON "services_blocks_hero" USING btree ("_path");
  CREATE INDEX "services_blocks_hero_media_idx" ON "services_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_services_v_blocks_hero_gradient_config_colors_order_idx" ON "_services_v_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_hero_gradient_config_colors_parent_id_idx" ON "_services_v_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_hero_actions_order_idx" ON "_services_v_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_hero_actions_parent_id_idx" ON "_services_v_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_hero_order_idx" ON "_services_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_hero_parent_id_idx" ON "_services_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_hero_path_idx" ON "_services_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_hero_media_idx" ON "_services_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "contacts_blocks_hero_gradient_config_colors_order_idx" ON "contacts_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "contacts_blocks_hero_gradient_config_colors_parent_id_idx" ON "contacts_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_hero_actions_order_idx" ON "contacts_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "contacts_blocks_hero_actions_parent_id_idx" ON "contacts_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_hero_order_idx" ON "contacts_blocks_hero" USING btree ("_order");
  CREATE INDEX "contacts_blocks_hero_parent_id_idx" ON "contacts_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_hero_path_idx" ON "contacts_blocks_hero" USING btree ("_path");
  CREATE INDEX "contacts_blocks_hero_media_idx" ON "contacts_blocks_hero" USING btree ("media_id");
  CREATE INDEX "contacts_rels_order_idx" ON "contacts_rels" USING btree ("order");
  CREATE INDEX "contacts_rels_parent_idx" ON "contacts_rels" USING btree ("parent_id");
  CREATE INDEX "contacts_rels_path_idx" ON "contacts_rels" USING btree ("path");
  CREATE INDEX "contacts_rels_pages_id_idx" ON "contacts_rels" USING btree ("pages_id");
  CREATE INDEX "contacts_rels_blogs_id_idx" ON "contacts_rels" USING btree ("blogs_id");
  CREATE INDEX "contacts_rels_services_id_idx" ON "contacts_rels" USING btree ("services_id");
  CREATE INDEX "contacts_rels_legal_id_idx" ON "contacts_rels" USING btree ("legal_id");
  CREATE INDEX "contacts_rels_contacts_id_idx" ON "contacts_rels" USING btree ("contacts_id");
  CREATE INDEX "_contacts_v_blocks_hero_gradient_config_colors_order_idx" ON "_contacts_v_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_hero_gradient_config_colors_parent_id_idx" ON "_contacts_v_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_hero_actions_order_idx" ON "_contacts_v_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_hero_actions_parent_id_idx" ON "_contacts_v_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_hero_order_idx" ON "_contacts_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_hero_parent_id_idx" ON "_contacts_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_hero_path_idx" ON "_contacts_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_contacts_v_blocks_hero_media_idx" ON "_contacts_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_contacts_v_rels_order_idx" ON "_contacts_v_rels" USING btree ("order");
  CREATE INDEX "_contacts_v_rels_parent_idx" ON "_contacts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_contacts_v_rels_path_idx" ON "_contacts_v_rels" USING btree ("path");
  CREATE INDEX "_contacts_v_rels_pages_id_idx" ON "_contacts_v_rels" USING btree ("pages_id");
  CREATE INDEX "_contacts_v_rels_blogs_id_idx" ON "_contacts_v_rels" USING btree ("blogs_id");
  CREATE INDEX "_contacts_v_rels_services_id_idx" ON "_contacts_v_rels" USING btree ("services_id");
  CREATE INDEX "_contacts_v_rels_legal_id_idx" ON "_contacts_v_rels" USING btree ("legal_id");
  CREATE INDEX "_contacts_v_rels_contacts_id_idx" ON "_contacts_v_rels" USING btree ("contacts_id");
  DROP TYPE "public"."enum_actions_priority";
  DROP TYPE "public"."enum_hero_block_variant";
  DROP TYPE "public"."enum_hero_block_code_snippet_language";
  DROP TYPE "public"."enum_hero_block_code_snippet_theme";
  DROP TYPE "public"."content_side";
  DROP TYPE "public"."media_type";
  DROP TYPE "public"."enum_hero_block_gradient_config_animation";
  DROP TYPE "public"."enum_hero_block_settings_theme";
  DROP TYPE "public"."enum_hero_block_settings_height";
  DROP TYPE "public"."enum_hero_block_settings_overlay_color";
  DROP TYPE "public"."enum_proj_showcase_layout";
  DROP TYPE "public"."enum_proj_showcase_columns";
  DROP TYPE "public"."enum__actions_v_priority";
  DROP TYPE "public"."enum__hero_block_v_variant";
  DROP TYPE "public"."enum__hero_block_v_code_snippet_language";
  DROP TYPE "public"."enum__hero_block_v_code_snippet_theme";
  DROP TYPE "public"."enum__hero_block_v_gradient_config_animation";
  DROP TYPE "public"."enum__hero_block_v_settings_theme";
  DROP TYPE "public"."enum__hero_block_v_settings_height";
  DROP TYPE "public"."enum__hero_block_v_settings_overlay_color";
  DROP TYPE "public"."enum__proj_showcase_v_layout";
  DROP TYPE "public"."enum__proj_showcase_v_columns";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_hero_block_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum_hero_block_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum_hero_block_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum_hero_block_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum_hero_block_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum_hero_block_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum_hero_block_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum_proj_showcase_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum_proj_showcase_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__actions_v_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__hero_block_v_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum__hero_block_v_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum__hero_block_v_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__hero_block_v_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum__hero_block_v_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum__hero_block_v_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum__hero_block_v_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum__proj_showcase_v_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum__proj_showcase_v_columns" AS ENUM('2', '3', '4');
  CREATE TABLE "colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar
  );
  
  CREATE TABLE "actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_link_type" "link_type" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "link_appearance" DEFAULT 'default',
  	"priority" "enum_actions_priority" DEFAULT 'primary'
  );
  
  CREATE TABLE "hero_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_hero_block_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum_hero_block_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum_hero_block_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "content_side" DEFAULT 'left',
  	"split_layout_media_type" "media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum_hero_block_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum_hero_block_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum_hero_block_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum_hero_block_settings_overlay_color" DEFAULT 'black',
  	"block_name" varchar
  );
  
  CREATE TABLE "projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"category" varchar,
  	"project_link_link_type" "link_type" DEFAULT 'reference',
  	"project_link_link_new_tab" boolean,
  	"project_link_link_url" varchar,
  	"project_link_link_label" varchar,
  	"project_link_link_appearance" "link_appearance" DEFAULT 'default',
  	"github_url" varchar,
  	"live_url" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "filter_cats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" varchar
  );
  
  CREATE TABLE "proj_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum_proj_showcase_layout" DEFAULT 'grid',
  	"columns" "enum_proj_showcase_columns" DEFAULT '3',
  	"enable_filtering" boolean DEFAULT true,
  	"show_load_more" boolean DEFAULT false,
  	"items_per_page" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "_colors_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_actions_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_link_type" "link_type" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "link_appearance" DEFAULT 'default',
  	"priority" "enum__actions_v_priority" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hero_block_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__hero_block_v_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum__hero_block_v_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum__hero_block_v_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "content_side" DEFAULT 'left',
  	"split_layout_media_type" "media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum__hero_block_v_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum__hero_block_v_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum__hero_block_v_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum__hero_block_v_settings_overlay_color" DEFAULT 'black',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"category" varchar,
  	"project_link_link_type" "link_type" DEFAULT 'reference',
  	"project_link_link_new_tab" boolean,
  	"project_link_link_url" varchar,
  	"project_link_link_label" varchar,
  	"project_link_link_appearance" "link_appearance" DEFAULT 'default',
  	"github_url" varchar,
  	"live_url" varchar,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_filter_cats_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_proj_showcase_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum__proj_showcase_v_layout" DEFAULT 'grid',
  	"columns" "enum__proj_showcase_v_columns" DEFAULT '3',
  	"enable_filtering" boolean DEFAULT true,
  	"show_load_more" boolean DEFAULT false,
  	"items_per_page" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "pages_blocks_hero_actions" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_project_showcase_projects_technologies" CASCADE;
  DROP TABLE "pages_blocks_project_showcase_projects" CASCADE;
  DROP TABLE "pages_blocks_project_showcase_filter_categories" CASCADE;
  DROP TABLE "pages_blocks_project_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_actions" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_project_showcase_projects_technologies" CASCADE;
  DROP TABLE "_pages_v_blocks_project_showcase_projects" CASCADE;
  DROP TABLE "_pages_v_blocks_project_showcase_filter_categories" CASCADE;
  DROP TABLE "_pages_v_blocks_project_showcase" CASCADE;
  DROP TABLE "blogs_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "blogs_blocks_hero_actions" CASCADE;
  DROP TABLE "blogs_blocks_hero" CASCADE;
  DROP TABLE "_blogs_v_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "_blogs_v_blocks_hero_actions" CASCADE;
  DROP TABLE "_blogs_v_blocks_hero" CASCADE;
  DROP TABLE "services_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "services_blocks_hero_actions" CASCADE;
  DROP TABLE "services_blocks_hero" CASCADE;
  DROP TABLE "_services_v_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "_services_v_blocks_hero_actions" CASCADE;
  DROP TABLE "_services_v_blocks_hero" CASCADE;
  DROP TABLE "contacts_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "contacts_blocks_hero_actions" CASCADE;
  DROP TABLE "contacts_blocks_hero" CASCADE;
  DROP TABLE "contacts_rels" CASCADE;
  DROP TABLE "_contacts_v_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "_contacts_v_blocks_hero_actions" CASCADE;
  DROP TABLE "_contacts_v_blocks_hero" CASCADE;
  DROP TABLE "_contacts_v_rels" CASCADE;
  ALTER TABLE "colors" ADD CONSTRAINT "colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "actions" ADD CONSTRAINT "actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_block" ADD CONSTRAINT "hero_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_block" ADD CONSTRAINT "hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proj_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "filter_cats" ADD CONSTRAINT "filter_cats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proj_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proj_showcase" ADD CONSTRAINT "proj_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_colors_v" ADD CONSTRAINT "_colors_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hero_block_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_actions_v" ADD CONSTRAINT "_actions_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hero_block_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hero_block_v" ADD CONSTRAINT "_hero_block_v_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hero_block_v" ADD CONSTRAINT "_hero_block_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proj_showcase_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_filter_cats_v" ADD CONSTRAINT "_filter_cats_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proj_showcase_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proj_showcase_v" ADD CONSTRAINT "_proj_showcase_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "colors_order_idx" ON "colors" USING btree ("_order");
  CREATE INDEX "colors_parent_id_idx" ON "colors" USING btree ("_parent_id");
  CREATE INDEX "actions_order_idx" ON "actions" USING btree ("_order");
  CREATE INDEX "actions_parent_id_idx" ON "actions" USING btree ("_parent_id");
  CREATE INDEX "hero_block_order_idx" ON "hero_block" USING btree ("_order");
  CREATE INDEX "hero_block_parent_id_idx" ON "hero_block" USING btree ("_parent_id");
  CREATE INDEX "hero_block_path_idx" ON "hero_block" USING btree ("_path");
  CREATE INDEX "hero_block_media_idx" ON "hero_block" USING btree ("media_id");
  CREATE INDEX "projects_order_idx" ON "projects" USING btree ("_order");
  CREATE INDEX "projects_parent_id_idx" ON "projects" USING btree ("_parent_id");
  CREATE INDEX "projects_image_idx" ON "projects" USING btree ("image_id");
  CREATE INDEX "filter_cats_order_idx" ON "filter_cats" USING btree ("_order");
  CREATE INDEX "filter_cats_parent_id_idx" ON "filter_cats" USING btree ("_parent_id");
  CREATE INDEX "proj_showcase_order_idx" ON "proj_showcase" USING btree ("_order");
  CREATE INDEX "proj_showcase_parent_id_idx" ON "proj_showcase" USING btree ("_parent_id");
  CREATE INDEX "proj_showcase_path_idx" ON "proj_showcase" USING btree ("_path");
  CREATE INDEX "_colors_v_order_idx" ON "_colors_v" USING btree ("_order");
  CREATE INDEX "_colors_v_parent_id_idx" ON "_colors_v" USING btree ("_parent_id");
  CREATE INDEX "_actions_v_order_idx" ON "_actions_v" USING btree ("_order");
  CREATE INDEX "_actions_v_parent_id_idx" ON "_actions_v" USING btree ("_parent_id");
  CREATE INDEX "_hero_block_v_order_idx" ON "_hero_block_v" USING btree ("_order");
  CREATE INDEX "_hero_block_v_parent_id_idx" ON "_hero_block_v" USING btree ("_parent_id");
  CREATE INDEX "_hero_block_v_path_idx" ON "_hero_block_v" USING btree ("_path");
  CREATE INDEX "_hero_block_v_media_idx" ON "_hero_block_v" USING btree ("media_id");
  CREATE INDEX "_projects_v_order_idx" ON "_projects_v" USING btree ("_order");
  CREATE INDEX "_projects_v_parent_id_idx" ON "_projects_v" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_image_idx" ON "_projects_v" USING btree ("image_id");
  CREATE INDEX "_filter_cats_v_order_idx" ON "_filter_cats_v" USING btree ("_order");
  CREATE INDEX "_filter_cats_v_parent_id_idx" ON "_filter_cats_v" USING btree ("_parent_id");
  CREATE INDEX "_proj_showcase_v_order_idx" ON "_proj_showcase_v" USING btree ("_order");
  CREATE INDEX "_proj_showcase_v_parent_id_idx" ON "_proj_showcase_v" USING btree ("_parent_id");
  CREATE INDEX "_proj_showcase_v_path_idx" ON "_proj_showcase_v" USING btree ("_path");
  DROP TYPE "public"."enum_pages_blocks_hero_actions_priority";
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum_pages_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum_pages_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum_pages_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum_pages_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum_pages_blocks_hero_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_hero_settings_height";
  DROP TYPE "public"."enum_pages_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum_pages_blocks_project_showcase_layout";
  DROP TYPE "public"."enum_pages_blocks_project_showcase_columns";
  DROP TYPE "public"."enum__pages_v_blocks_hero_actions_priority";
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum__pages_v_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum__pages_v_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum__pages_v_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum__pages_v_blocks_hero_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_hero_settings_height";
  DROP TYPE "public"."enum__pages_v_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum__pages_v_blocks_project_showcase_layout";
  DROP TYPE "public"."enum__pages_v_blocks_project_showcase_columns";
  DROP TYPE "public"."enum_blogs_blocks_hero_actions_priority";
  DROP TYPE "public"."enum_blogs_blocks_hero_variant";
  DROP TYPE "public"."enum_blogs_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum_blogs_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum_blogs_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum_blogs_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum_blogs_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum_blogs_blocks_hero_settings_theme";
  DROP TYPE "public"."enum_blogs_blocks_hero_settings_height";
  DROP TYPE "public"."enum_blogs_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_actions_priority";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_variant";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_settings_theme";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_settings_height";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum_services_blocks_hero_actions_priority";
  DROP TYPE "public"."enum_services_blocks_hero_variant";
  DROP TYPE "public"."enum_services_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum_services_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum_services_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum_services_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum_services_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum_services_blocks_hero_settings_theme";
  DROP TYPE "public"."enum_services_blocks_hero_settings_height";
  DROP TYPE "public"."enum_services_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum__services_v_blocks_hero_actions_priority";
  DROP TYPE "public"."enum__services_v_blocks_hero_variant";
  DROP TYPE "public"."enum__services_v_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum__services_v_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum__services_v_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum__services_v_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum__services_v_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum__services_v_blocks_hero_settings_theme";
  DROP TYPE "public"."enum__services_v_blocks_hero_settings_height";
  DROP TYPE "public"."enum__services_v_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum_contacts_blocks_hero_actions_priority";
  DROP TYPE "public"."enum_contacts_blocks_hero_variant";
  DROP TYPE "public"."enum_contacts_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum_contacts_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum_contacts_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum_contacts_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum_contacts_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum_contacts_blocks_hero_settings_theme";
  DROP TYPE "public"."enum_contacts_blocks_hero_settings_height";
  DROP TYPE "public"."enum_contacts_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_actions_priority";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_variant";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_settings_theme";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_settings_height";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_settings_overlay_color";`)
}
