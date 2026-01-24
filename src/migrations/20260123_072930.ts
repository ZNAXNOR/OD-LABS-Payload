import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_blogs_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum_blogs_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum_blogs_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_blogs_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_blogs_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__blogs_v_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum__blogs_v_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum__blogs_v_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__blogs_v_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__blogs_v_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_services_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum_services_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum_services_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_services_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_services_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__services_v_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum__services_v_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum__services_v_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__services_v_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__services_v_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_legal_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum_legal_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum_legal_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_legal_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_legal_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__legal_v_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum__legal_v_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum__legal_v_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__legal_v_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__legal_v_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_contacts_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum_contacts_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum_contacts_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_contacts_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_contacts_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__contacts_v_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum__contacts_v_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum__contacts_v_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__contacts_v_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__contacts_v_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_pages_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "enum_pages_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum_pages_blocks_content_columns_padding" DEFAULT 'none'
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gap" "enum_pages_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum_pages_blocks_content_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__pages_v_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "enum__pages_v_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum__pages_v_blocks_content_columns_padding" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gap" "enum__pages_v_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum__pages_v_blocks_content_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "blogs_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_blogs_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "enum_blogs_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum_blogs_blocks_content_columns_padding" DEFAULT 'none'
  );
  
  CREATE TABLE "blogs_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gap" "enum_blogs_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum_blogs_blocks_content_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__blogs_v_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "enum__blogs_v_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum__blogs_v_blocks_content_columns_padding" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gap" "enum__blogs_v_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum__blogs_v_blocks_content_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_services_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "enum_services_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum_services_blocks_content_columns_padding" DEFAULT 'none'
  );
  
  CREATE TABLE "services_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gap" "enum_services_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum_services_blocks_content_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__services_v_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "enum__services_v_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum__services_v_blocks_content_columns_padding" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gap" "enum__services_v_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum__services_v_blocks_content_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "legal_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_legal_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "enum_legal_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum_legal_blocks_content_columns_padding" DEFAULT 'none'
  );
  
  CREATE TABLE "legal_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gap" "enum_legal_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum_legal_blocks_content_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "legal_rels" (
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
  
  CREATE TABLE "_legal_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__legal_v_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "enum__legal_v_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum__legal_v_blocks_content_columns_padding" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_legal_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gap" "enum__legal_v_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum__legal_v_blocks_content_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_legal_v_rels" (
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
  
  CREATE TABLE "contacts_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_contacts_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "enum_contacts_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum_contacts_blocks_content_columns_padding" DEFAULT 'none'
  );
  
  CREATE TABLE "contacts_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gap" "enum_contacts_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum_contacts_blocks_content_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__contacts_v_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "enum__contacts_v_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum__contacts_v_blocks_content_columns_padding" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gap" "enum__contacts_v_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum__contacts_v_blocks_content_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "columns" CASCADE;
  DROP TABLE "content_block" CASCADE;
  DROP TABLE "breadcrumbs" CASCADE;
  DROP TABLE "_columns_v" CASCADE;
  DROP TABLE "_content_block_v" CASCADE;
  DROP TABLE "_breadcrumbs_v" CASCADE;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_content_columns" ADD CONSTRAINT "blogs_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_content" ADD CONSTRAINT "blogs_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_content_columns" ADD CONSTRAINT "_blogs_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_content" ADD CONSTRAINT "_blogs_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_content_columns" ADD CONSTRAINT "services_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_content" ADD CONSTRAINT "services_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_content_columns" ADD CONSTRAINT "_services_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_content" ADD CONSTRAINT "_services_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_blocks_content_columns" ADD CONSTRAINT "legal_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_blocks_content" ADD CONSTRAINT "legal_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_blocks_content_columns" ADD CONSTRAINT "_legal_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_blocks_content" ADD CONSTRAINT "_legal_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_content_columns" ADD CONSTRAINT "contacts_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_content" ADD CONSTRAINT "contacts_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_content_columns" ADD CONSTRAINT "_contacts_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_content" ADD CONSTRAINT "_contacts_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "pages_breadcrumbs_doc_idx" ON "pages_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_doc_idx" ON "_pages_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "blogs_blocks_content_columns_order_idx" ON "blogs_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "blogs_blocks_content_columns_parent_id_idx" ON "blogs_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_content_order_idx" ON "blogs_blocks_content" USING btree ("_order");
  CREATE INDEX "blogs_blocks_content_parent_id_idx" ON "blogs_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_content_path_idx" ON "blogs_blocks_content" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_content_columns_order_idx" ON "_blogs_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_content_columns_parent_id_idx" ON "_blogs_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_content_order_idx" ON "_blogs_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_content_parent_id_idx" ON "_blogs_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_content_path_idx" ON "_blogs_v_blocks_content" USING btree ("_path");
  CREATE INDEX "services_blocks_content_columns_order_idx" ON "services_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "services_blocks_content_columns_parent_id_idx" ON "services_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_content_order_idx" ON "services_blocks_content" USING btree ("_order");
  CREATE INDEX "services_blocks_content_parent_id_idx" ON "services_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_content_path_idx" ON "services_blocks_content" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_content_columns_order_idx" ON "_services_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_content_columns_parent_id_idx" ON "_services_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_content_order_idx" ON "_services_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_content_parent_id_idx" ON "_services_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_content_path_idx" ON "_services_v_blocks_content" USING btree ("_path");
  CREATE INDEX "legal_blocks_content_columns_order_idx" ON "legal_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "legal_blocks_content_columns_parent_id_idx" ON "legal_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "legal_blocks_content_order_idx" ON "legal_blocks_content" USING btree ("_order");
  CREATE INDEX "legal_blocks_content_parent_id_idx" ON "legal_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "legal_blocks_content_path_idx" ON "legal_blocks_content" USING btree ("_path");
  CREATE INDEX "legal_rels_order_idx" ON "legal_rels" USING btree ("order");
  CREATE INDEX "legal_rels_parent_idx" ON "legal_rels" USING btree ("parent_id");
  CREATE INDEX "legal_rels_path_idx" ON "legal_rels" USING btree ("path");
  CREATE INDEX "legal_rels_pages_id_idx" ON "legal_rels" USING btree ("pages_id");
  CREATE INDEX "legal_rels_blogs_id_idx" ON "legal_rels" USING btree ("blogs_id");
  CREATE INDEX "legal_rels_services_id_idx" ON "legal_rels" USING btree ("services_id");
  CREATE INDEX "legal_rels_legal_id_idx" ON "legal_rels" USING btree ("legal_id");
  CREATE INDEX "legal_rels_contacts_id_idx" ON "legal_rels" USING btree ("contacts_id");
  CREATE INDEX "_legal_v_blocks_content_columns_order_idx" ON "_legal_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_legal_v_blocks_content_columns_parent_id_idx" ON "_legal_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_blocks_content_order_idx" ON "_legal_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_legal_v_blocks_content_parent_id_idx" ON "_legal_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_blocks_content_path_idx" ON "_legal_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_legal_v_rels_order_idx" ON "_legal_v_rels" USING btree ("order");
  CREATE INDEX "_legal_v_rels_parent_idx" ON "_legal_v_rels" USING btree ("parent_id");
  CREATE INDEX "_legal_v_rels_path_idx" ON "_legal_v_rels" USING btree ("path");
  CREATE INDEX "_legal_v_rels_pages_id_idx" ON "_legal_v_rels" USING btree ("pages_id");
  CREATE INDEX "_legal_v_rels_blogs_id_idx" ON "_legal_v_rels" USING btree ("blogs_id");
  CREATE INDEX "_legal_v_rels_services_id_idx" ON "_legal_v_rels" USING btree ("services_id");
  CREATE INDEX "_legal_v_rels_legal_id_idx" ON "_legal_v_rels" USING btree ("legal_id");
  CREATE INDEX "_legal_v_rels_contacts_id_idx" ON "_legal_v_rels" USING btree ("contacts_id");
  CREATE INDEX "contacts_blocks_content_columns_order_idx" ON "contacts_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "contacts_blocks_content_columns_parent_id_idx" ON "contacts_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_content_order_idx" ON "contacts_blocks_content" USING btree ("_order");
  CREATE INDEX "contacts_blocks_content_parent_id_idx" ON "contacts_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_content_path_idx" ON "contacts_blocks_content" USING btree ("_path");
  CREATE INDEX "_contacts_v_blocks_content_columns_order_idx" ON "_contacts_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_content_columns_parent_id_idx" ON "_contacts_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_content_order_idx" ON "_contacts_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_content_parent_id_idx" ON "_contacts_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_content_path_idx" ON "_contacts_v_blocks_content" USING btree ("_path");
  DROP TYPE "public"."enum_columns_width";
  DROP TYPE "public"."enum_columns_padding";
  DROP TYPE "public"."enum_content_block_gap";
  DROP TYPE "public"."enum_content_block_alignment";
  DROP TYPE "public"."enum__columns_v_width";
  DROP TYPE "public"."enum__columns_v_padding";
  DROP TYPE "public"."enum__content_block_v_gap";
  DROP TYPE "public"."enum__content_block_v_alignment";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_content_block_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_content_block_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__columns_v_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum__columns_v_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__content_block_v_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__content_block_v_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TABLE "columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "bg_color" DEFAULT 'none',
  	"padding" "enum_columns_padding" DEFAULT 'none'
  );
  
  CREATE TABLE "content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gap" "enum_content_block_gap" DEFAULT 'medium',
  	"alignment" "enum_content_block_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "_columns_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__columns_v_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"background_color" "bg_color" DEFAULT 'none',
  	"padding" "enum__columns_v_padding" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_content_block_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gap" "enum__content_block_v_gap" DEFAULT 'medium',
  	"alignment" "enum__content_block_v_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_breadcrumbs_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_breadcrumbs" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "blogs_blocks_content_columns" CASCADE;
  DROP TABLE "blogs_blocks_content" CASCADE;
  DROP TABLE "_blogs_v_blocks_content_columns" CASCADE;
  DROP TABLE "_blogs_v_blocks_content" CASCADE;
  DROP TABLE "services_blocks_content_columns" CASCADE;
  DROP TABLE "services_blocks_content" CASCADE;
  DROP TABLE "_services_v_blocks_content_columns" CASCADE;
  DROP TABLE "_services_v_blocks_content" CASCADE;
  DROP TABLE "legal_blocks_content_columns" CASCADE;
  DROP TABLE "legal_blocks_content" CASCADE;
  DROP TABLE "legal_rels" CASCADE;
  DROP TABLE "_legal_v_blocks_content_columns" CASCADE;
  DROP TABLE "_legal_v_blocks_content" CASCADE;
  DROP TABLE "_legal_v_rels" CASCADE;
  DROP TABLE "contacts_blocks_content_columns" CASCADE;
  DROP TABLE "contacts_blocks_content" CASCADE;
  DROP TABLE "_contacts_v_blocks_content_columns" CASCADE;
  DROP TABLE "_contacts_v_blocks_content" CASCADE;
  ALTER TABLE "columns" ADD CONSTRAINT "columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_block" ADD CONSTRAINT "content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "breadcrumbs" ADD CONSTRAINT "breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "breadcrumbs" ADD CONSTRAINT "breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_columns_v" ADD CONSTRAINT "_columns_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_block_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_block_v" ADD CONSTRAINT "_content_block_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_breadcrumbs_v" ADD CONSTRAINT "_breadcrumbs_v_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_breadcrumbs_v" ADD CONSTRAINT "_breadcrumbs_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "columns_order_idx" ON "columns" USING btree ("_order");
  CREATE INDEX "columns_parent_id_idx" ON "columns" USING btree ("_parent_id");
  CREATE INDEX "content_block_order_idx" ON "content_block" USING btree ("_order");
  CREATE INDEX "content_block_parent_id_idx" ON "content_block" USING btree ("_parent_id");
  CREATE INDEX "content_block_path_idx" ON "content_block" USING btree ("_path");
  CREATE INDEX "breadcrumbs_order_idx" ON "breadcrumbs" USING btree ("_order");
  CREATE INDEX "breadcrumbs_parent_id_idx" ON "breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "breadcrumbs_doc_idx" ON "breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_columns_v_order_idx" ON "_columns_v" USING btree ("_order");
  CREATE INDEX "_columns_v_parent_id_idx" ON "_columns_v" USING btree ("_parent_id");
  CREATE INDEX "_content_block_v_order_idx" ON "_content_block_v" USING btree ("_order");
  CREATE INDEX "_content_block_v_parent_id_idx" ON "_content_block_v" USING btree ("_parent_id");
  CREATE INDEX "_content_block_v_path_idx" ON "_content_block_v" USING btree ("_path");
  CREATE INDEX "_breadcrumbs_v_order_idx" ON "_breadcrumbs_v" USING btree ("_order");
  CREATE INDEX "_breadcrumbs_v_parent_id_idx" ON "_breadcrumbs_v" USING btree ("_parent_id");
  CREATE INDEX "_breadcrumbs_v_doc_idx" ON "_breadcrumbs_v" USING btree ("doc_id");
  DROP TYPE "public"."enum_pages_blocks_content_columns_width";
  DROP TYPE "public"."enum_pages_blocks_content_columns_background_color";
  DROP TYPE "public"."enum_pages_blocks_content_columns_padding";
  DROP TYPE "public"."enum_pages_blocks_content_gap";
  DROP TYPE "public"."enum_pages_blocks_content_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_width";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_padding";
  DROP TYPE "public"."enum__pages_v_blocks_content_gap";
  DROP TYPE "public"."enum__pages_v_blocks_content_alignment";
  DROP TYPE "public"."enum_blogs_blocks_content_columns_width";
  DROP TYPE "public"."enum_blogs_blocks_content_columns_background_color";
  DROP TYPE "public"."enum_blogs_blocks_content_columns_padding";
  DROP TYPE "public"."enum_blogs_blocks_content_gap";
  DROP TYPE "public"."enum_blogs_blocks_content_alignment";
  DROP TYPE "public"."enum__blogs_v_blocks_content_columns_width";
  DROP TYPE "public"."enum__blogs_v_blocks_content_columns_background_color";
  DROP TYPE "public"."enum__blogs_v_blocks_content_columns_padding";
  DROP TYPE "public"."enum__blogs_v_blocks_content_gap";
  DROP TYPE "public"."enum__blogs_v_blocks_content_alignment";
  DROP TYPE "public"."enum_services_blocks_content_columns_width";
  DROP TYPE "public"."enum_services_blocks_content_columns_background_color";
  DROP TYPE "public"."enum_services_blocks_content_columns_padding";
  DROP TYPE "public"."enum_services_blocks_content_gap";
  DROP TYPE "public"."enum_services_blocks_content_alignment";
  DROP TYPE "public"."enum__services_v_blocks_content_columns_width";
  DROP TYPE "public"."enum__services_v_blocks_content_columns_background_color";
  DROP TYPE "public"."enum__services_v_blocks_content_columns_padding";
  DROP TYPE "public"."enum__services_v_blocks_content_gap";
  DROP TYPE "public"."enum__services_v_blocks_content_alignment";
  DROP TYPE "public"."enum_legal_blocks_content_columns_width";
  DROP TYPE "public"."enum_legal_blocks_content_columns_background_color";
  DROP TYPE "public"."enum_legal_blocks_content_columns_padding";
  DROP TYPE "public"."enum_legal_blocks_content_gap";
  DROP TYPE "public"."enum_legal_blocks_content_alignment";
  DROP TYPE "public"."enum__legal_v_blocks_content_columns_width";
  DROP TYPE "public"."enum__legal_v_blocks_content_columns_background_color";
  DROP TYPE "public"."enum__legal_v_blocks_content_columns_padding";
  DROP TYPE "public"."enum__legal_v_blocks_content_gap";
  DROP TYPE "public"."enum__legal_v_blocks_content_alignment";
  DROP TYPE "public"."enum_contacts_blocks_content_columns_width";
  DROP TYPE "public"."enum_contacts_blocks_content_columns_background_color";
  DROP TYPE "public"."enum_contacts_blocks_content_columns_padding";
  DROP TYPE "public"."enum_contacts_blocks_content_gap";
  DROP TYPE "public"."enum_contacts_blocks_content_alignment";
  DROP TYPE "public"."enum__contacts_v_blocks_content_columns_width";
  DROP TYPE "public"."enum__contacts_v_blocks_content_columns_background_color";
  DROP TYPE "public"."enum__contacts_v_blocks_content_columns_padding";
  DROP TYPE "public"."enum__contacts_v_blocks_content_gap";
  DROP TYPE "public"."enum__contacts_v_blocks_content_alignment";`)
}
