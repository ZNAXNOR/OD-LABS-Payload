import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vector_bulk_embeddings_runs_status" AS ENUM('queued', 'running', 'succeeded', 'failed', 'canceled');
  CREATE TYPE "public"."enum_vector_bulk_embeddings_batches_status" AS ENUM('queued', 'running', 'succeeded', 'failed', 'canceled', 'retried');
  ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'payloadcms-vectorize:vectorize' BEFORE 'schedulePublish';
  ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'payloadcms-vectorize:prepare-bulk-embedding' BEFORE 'schedulePublish';
  ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'payloadcms-vectorize:poll-or-complete-single-batch' BEFORE 'schedulePublish';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'payloadcms-vectorize:vectorize' BEFORE 'schedulePublish';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'payloadcms-vectorize:prepare-bulk-embedding' BEFORE 'schedulePublish';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'payloadcms-vectorize:poll-or-complete-single-batch' BEFORE 'schedulePublish';
  CREATE TABLE "test_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vector_bulk_embeddings_runs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"pool" varchar NOT NULL,
  	"embedding_version" varchar NOT NULL,
  	"status" "enum_vector_bulk_embeddings_runs_status" DEFAULT 'queued' NOT NULL,
  	"total_batches" numeric DEFAULT 0,
  	"inputs" numeric DEFAULT 0,
  	"succeeded" numeric DEFAULT 0,
  	"failed" numeric DEFAULT 0,
  	"submitted_at" timestamp(3) with time zone,
  	"completed_at" timestamp(3) with time zone,
  	"error" varchar,
  	"failed_chunk_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vector_bulk_embedding_input_metadata" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"run_id" integer NOT NULL,
  	"batch_id" integer NOT NULL,
  	"input_id" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"source_collection" varchar NOT NULL,
  	"doc_id" varchar NOT NULL,
  	"chunk_index" numeric NOT NULL,
  	"embedding_version" varchar NOT NULL,
  	"extension_fields" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vector_bulk_embeddings_batches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"run_id" integer NOT NULL,
  	"batch_index" numeric NOT NULL,
  	"provider_batch_id" varchar NOT NULL,
  	"status" "enum_vector_bulk_embeddings_batches_status" DEFAULT 'queued' NOT NULL,
  	"input_count" numeric DEFAULT 0 NOT NULL,
  	"succeeded_count" numeric DEFAULT 0,
  	"failed_count" numeric DEFAULT 0,
  	"submitted_at" timestamp(3) with time zone,
  	"completed_at" timestamp(3) with time zone,
  	"error" varchar,
  	"failed_chunk_data" jsonb,
  	"retried_batch_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "odlabs_knowledge" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_collection" varchar NOT NULL,
  	"doc_id" varchar NOT NULL,
  	"chunk_index" numeric NOT NULL,
  	"chunk_text" varchar,
  	"embedding_version" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"embedding" vector(1536)
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "test_documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vector_bulk_embeddings_runs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vector_bulk_embedding_input_metadata_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vector_bulk_embeddings_batches_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "odlabs_knowledge_id" integer;
  ALTER TABLE "vector_bulk_embedding_input_metadata" ADD CONSTRAINT "vector_bulk_embedding_input_metadata_run_id_vector_bulk_embeddings_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."vector_bulk_embeddings_runs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vector_bulk_embedding_input_metadata" ADD CONSTRAINT "vector_bulk_embedding_input_metadata_batch_id_vector_bulk_embeddings_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."vector_bulk_embeddings_batches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vector_bulk_embeddings_batches" ADD CONSTRAINT "vector_bulk_embeddings_batches_run_id_vector_bulk_embeddings_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."vector_bulk_embeddings_runs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vector_bulk_embeddings_batches" ADD CONSTRAINT "vector_bulk_embeddings_batches_retried_batch_id_vector_bulk_embeddings_batches_id_fk" FOREIGN KEY ("retried_batch_id") REFERENCES "public"."vector_bulk_embeddings_batches"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "test_documents_updated_at_idx" ON "test_documents" USING btree ("updated_at");
  CREATE INDEX "test_documents_created_at_idx" ON "test_documents" USING btree ("created_at");
  CREATE INDEX "vector_bulk_embeddings_runs_updated_at_idx" ON "vector_bulk_embeddings_runs" USING btree ("updated_at");
  CREATE INDEX "vector_bulk_embeddings_runs_created_at_idx" ON "vector_bulk_embeddings_runs" USING btree ("created_at");
  CREATE INDEX "pool_idx" ON "vector_bulk_embeddings_runs" USING btree ("pool");
  CREATE INDEX "status_idx" ON "vector_bulk_embeddings_runs" USING btree ("status");
  CREATE INDEX "vector_bulk_embedding_input_metadata_run_idx" ON "vector_bulk_embedding_input_metadata" USING btree ("run_id");
  CREATE INDEX "vector_bulk_embedding_input_metadata_batch_idx" ON "vector_bulk_embedding_input_metadata" USING btree ("batch_id");
  CREATE INDEX "vector_bulk_embedding_input_metadata_updated_at_idx" ON "vector_bulk_embedding_input_metadata" USING btree ("updated_at");
  CREATE INDEX "vector_bulk_embedding_input_metadata_created_at_idx" ON "vector_bulk_embedding_input_metadata" USING btree ("created_at");
  CREATE INDEX "run_inputId_idx" ON "vector_bulk_embedding_input_metadata" USING btree ("run_id","input_id");
  CREATE INDEX "run_idx" ON "vector_bulk_embedding_input_metadata" USING btree ("run_id");
  CREATE INDEX "batch_idx" ON "vector_bulk_embedding_input_metadata" USING btree ("batch_id");
  CREATE INDEX "sourceCollection_docId_idx" ON "vector_bulk_embedding_input_metadata" USING btree ("source_collection","doc_id");
  CREATE INDEX "vector_bulk_embeddings_batches_run_idx" ON "vector_bulk_embeddings_batches" USING btree ("run_id");
  CREATE INDEX "vector_bulk_embeddings_batches_retried_batch_idx" ON "vector_bulk_embeddings_batches" USING btree ("retried_batch_id");
  CREATE INDEX "vector_bulk_embeddings_batches_updated_at_idx" ON "vector_bulk_embeddings_batches" USING btree ("updated_at");
  CREATE INDEX "vector_bulk_embeddings_batches_created_at_idx" ON "vector_bulk_embeddings_batches" USING btree ("created_at");
  CREATE INDEX "run_1_idx" ON "vector_bulk_embeddings_batches" USING btree ("run_id");
  CREATE INDEX "providerBatchId_idx" ON "vector_bulk_embeddings_batches" USING btree ("provider_batch_id");
  CREATE INDEX "status_1_idx" ON "vector_bulk_embeddings_batches" USING btree ("status");
  CREATE INDEX "odlabs_knowledge_updated_at_idx" ON "odlabs_knowledge" USING btree ("updated_at");
  CREATE INDEX "odlabs_knowledge_created_at_idx" ON "odlabs_knowledge" USING btree ("created_at");
  CREATE INDEX "sourceCollection_docId_1_idx" ON "odlabs_knowledge" USING btree ("source_collection","doc_id");
  CREATE INDEX "odlabs_knowledge_embedding_ivfflat" ON "odlabs_knowledge" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists=100);
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_test_documents_fk" FOREIGN KEY ("test_documents_id") REFERENCES "public"."test_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vector_bulk_embeddings_runs_fk" FOREIGN KEY ("vector_bulk_embeddings_runs_id") REFERENCES "public"."vector_bulk_embeddings_runs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vector_bulk_embedding_input_fk" FOREIGN KEY ("vector_bulk_embedding_input_metadata_id") REFERENCES "public"."vector_bulk_embedding_input_metadata"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vector_bulk_embeddings_batc_fk" FOREIGN KEY ("vector_bulk_embeddings_batches_id") REFERENCES "public"."vector_bulk_embeddings_batches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_odlabs_knowledge_fk" FOREIGN KEY ("odlabs_knowledge_id") REFERENCES "public"."odlabs_knowledge"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_test_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("test_documents_id");
  CREATE INDEX "payload_locked_documents_rels_vector_bulk_embeddings_run_idx" ON "payload_locked_documents_rels" USING btree ("vector_bulk_embeddings_runs_id");
  CREATE INDEX "payload_locked_documents_rels_vector_bulk_embedding_inpu_idx" ON "payload_locked_documents_rels" USING btree ("vector_bulk_embedding_input_metadata_id");
  CREATE INDEX "payload_locked_documents_rels_vector_bulk_embeddings_bat_idx" ON "payload_locked_documents_rels" USING btree ("vector_bulk_embeddings_batches_id");
  CREATE INDEX "payload_locked_documents_rels_odlabs_knowledge_id_idx" ON "payload_locked_documents_rels" USING btree ("odlabs_knowledge_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "test_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vector_bulk_embeddings_runs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vector_bulk_embedding_input_metadata" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vector_bulk_embeddings_batches" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "odlabs_knowledge" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "test_documents" CASCADE;
  DROP TABLE "vector_bulk_embeddings_runs" CASCADE;
  DROP TABLE "vector_bulk_embedding_input_metadata" CASCADE;
  DROP TABLE "vector_bulk_embeddings_batches" CASCADE;
  DROP TABLE "odlabs_knowledge" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_test_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vector_bulk_embeddings_runs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vector_bulk_embedding_input_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vector_bulk_embeddings_batc_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_odlabs_knowledge_fk";
  
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  DROP INDEX "payload_locked_documents_rels_test_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_vector_bulk_embeddings_run_idx";
  DROP INDEX "payload_locked_documents_rels_vector_bulk_embedding_inpu_idx";
  DROP INDEX "payload_locked_documents_rels_vector_bulk_embeddings_bat_idx";
  DROP INDEX "payload_locked_documents_rels_odlabs_knowledge_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "test_documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vector_bulk_embeddings_runs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vector_bulk_embedding_input_metadata_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vector_bulk_embeddings_batches_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "odlabs_knowledge_id";
  DROP TYPE "public"."enum_vector_bulk_embeddings_runs_status";
  DROP TYPE "public"."enum_vector_bulk_embeddings_batches_status";`)
}
