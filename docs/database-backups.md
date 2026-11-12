# OD LABS database and media backups

These workflows run only from the staging branch. They are GitHub Actions workflows and are independent of Dokploy deployments and application startup.

## Workflows

- **Staging Database and Media Backup**: runs daily at 00:00 IST (18:30 UTC) and can also be started manually.
- **Restore Latest Database and Media Backup**: manual only. It restores the newest complete backup set and requires the exact confirmation text RESTORE.

A backup set is written under backups/<UTC timestamp>/ in the backup bucket. It contains:
- database.dump: PostgreSQL custom-format dump.
- database.sha256: SHA-256 checksum.
- media/: full copy of the staging media bucket.
- manifest.json: written last; its presence marks the backup set complete.

Retention keeps the newest 10 complete backup sets. Older complete sets are deleted from the backups/ prefix only. Other objects in the backup bucket (including existing Dokploy backups) are not touched.

## GitHub Actions repository secrets

Configure these under Repository → Settings → Secrets and variables → Actions → Secrets. Do not commit credentials or put them in the application's runtime environment.

### Staging database
- STAGING_DATABASE_URL: direct/unpooled PostgreSQL connection string for the staging database.

### Staging media source
- STAGING_MEDIA_ENDPOINT: S3 endpoint for the Neon branch containing the staging media bucket.
- STAGING_MEDIA_ACCESS_KEY_ID: Neon Object Storage access key with storage:read.
- STAGING_MEDIA_SECRET_ACCESS_KEY: matching Neon Object Storage secret.
- STAGING_MEDIA_REGION: storage region, for example us-east-2.
- STAGING_MEDIA_BUCKET: staging media bucket name, for example payloadcms-staging-media.

### Backup destination
- BACKUP_STORAGE_ENDPOINT: S3 endpoint for the Neon branch containing the backup bucket.
- BACKUP_STORAGE_ACCESS_KEY_ID: Neon Object Storage access key with storage:read and storage:write.
- BACKUP_STORAGE_SECRET_ACCESS_KEY: matching Neon Object Storage secret.
- BACKUP_STORAGE_REGION: storage region, for example us-east-2.
- BACKUP_STORAGE_BUCKET: backup bucket name, for example dokploy-backup.

### Restore destination
- RESTORE_DATABASE_URL: direct/unpooled connection string for the database to be replaced.
- RESTORE_MEDIA_ENDPOINT: S3 endpoint for the Neon branch containing the destination media bucket.
- RESTORE_MEDIA_ACCESS_KEY_ID: Neon Object Storage access key with storage:read and storage:write.
- RESTORE_MEDIA_SECRET_ACCESS_KEY: matching Neon Object Storage secret.
- RESTORE_MEDIA_REGION: destination storage region.
- RESTORE_MEDIA_BUCKET: destination media bucket name.

The staging source, backup destination, and restore destination can be different Neon projects or branches. Each endpoint must match the credential and bucket's owning branch.

## Important restore behavior

The restore action is destructive:
- pg_restore --clean --if-exists drops existing database objects before recreating them.
- aws s3 sync --delete removes destination media objects that are not present in the selected backup.

The restore workflow therefore requires typing RESTORE in the manual workflow input. Configure the restore secrets only for the intended destination. The workflow is restricted to the staging branch; it cannot be dispatched from production or preview branches.

Before the first production recovery, test the restore against a disposable Neon project and bucket. The restore does not recreate Neon project settings, database roles, secrets, Payload environment variables, or infrastructure configuration. It restores PostgreSQL database contents and bucket objects.

## Operational notes

- Neon pg_dump/pg_restore operations should use direct, unpooled database connection strings.
- PostgreSQL 18 client tools are installed in the runner.
- The backup set is marked complete only after both the database and media have uploaded.
- An interrupted upload without manifest.json is ignored by retention and restore selection.
- GitHub scheduled workflows are not guaranteed to start at the exact minute; GitHub may delay scheduled jobs during periods of high load.
- Rotate any Neon credentials previously exposed in chats or elsewhere, then store replacements only as GitHub Actions secrets.
