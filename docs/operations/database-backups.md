# OD LABS database and media backups

Both workflows run only from the `staging` branch and are independent of Dokploy deployments and application startup.

## Workflows

- **Staging Database and Media Backup**: daily at 00:00 IST (18:30 UTC), plus manual trigger.
- **Restore Latest Database and Media Backup**: manual only; requires typing `RESTORE`.

The nightly workflow validates staging data, creates a PostgreSQL custom-format dump, verifies its checksum, refreshes the backup PostgreSQL mirror, and then archives the dump and media in Neon Object Storage. The archive manifest is uploaded last and marks a backup set complete.

Each completed backup set is stored at `backups/<UTC timestamp>/` inside the backup Object Storage bucket:
- `database.dump`: PostgreSQL custom-format dump of the staging database.
- `database.sha256`: checksum.
- `media/`: copy of the staging media bucket.
- `manifest.json`: written last to mark the set complete.

The newest 10 complete backup sets are retained. Older sets under `backups/` are deleted; other objects such as Dokploy backups and `pre-restore/` safety snapshots are not touched.

## GitHub Actions secrets

Create these under **Repository → Settings → Secrets and variables → Actions → Repository secrets**.

### 1. `STAGING_DATABASE_URL`
Direct/unpooled PostgreSQL connection string for the staging database. Used as the nightly backup source and manual restore destination. Use the Neon direct endpoint (hostname without `-pooler`).

### 2. `BACKUP_DATABASE_URL`
Direct/unpooled PostgreSQL connection string for the backup project's database. The nightly workflow overwrites its contents from the verified staging dump using `pg_restore --clean --if-exists`. This is a live mirror for convenience, not the historical backup archive. The manual restore workflow does not use this database.

### 3. `STAGING_STORAGE_ENV`
A multiline secret containing the staging media bucket configuration:

```dotenv
AWS_ENDPOINT_URL_S3="https://YOUR-STAGING-ENDPOINT"
AWS_ACCESS_KEY_ID="YOUR-STAGING-ACCESS-KEY"
AWS_SECRET_ACCESS_KEY="YOUR-STAGING-SECRET"
AWS_REGION="us-east-2"
AWS_S3_BUCKET="payloadcms-staging-media"
```

The key needs list, read, write, and delete permissions on the staging media bucket. The nightly workflow reads it; the manual restore replaces its contents using `aws s3 sync --delete`.

### 4. `BACKUP_STORAGE_ENV`
A multiline secret containing the backup archive bucket configuration:

```dotenv
AWS_ENDPOINT_URL_S3="https://YOUR-BACKUP-ENDPOINT"
AWS_ACCESS_KEY_ID="YOUR-BACKUP-ACCESS-KEY"
AWS_SECRET_ACCESS_KEY="YOUR-BACKUP-SECRET"
AWS_REGION="us-east-2"
AWS_S3_BUCKET="dokploy-backup"
```

The key needs list, read, write, and delete permissions on the backup bucket. Retention deletes only objects inside `backups/`; safety snapshots under `pre-restore/` are kept separately.

### 5. `RESEND_ENV`

A multiline secret used by both workflows to send failure alerts through Resend:

```dotenv
RESEND_API_KEY="re_xxxxxxxxx"
RESEND_FROM_EMAIL="OD LABS Backup Alerts <alerts@your-verified-domain.com>"
RESEND_TO_EMAIL="you@example.com"
```

Verify the sender domain in Resend before enabling notifications. `RESEND_TO_EMAIL` accepts a comma-separated list of recipients. Notifications are sent only when a workflow fails. If notification delivery itself fails, the original workflow failure remains the primary result and the notification step is non-blocking.

## Backup validation and failure handling

The nightly workflow aborts before publishing an archive if:
- The staging database has no rows in any non-system table.
- The PostgreSQL dump is empty or contains no table-data entries.
- The staging media bucket contains no files.
- The backup database mirror cannot be refreshed and verified.
- Any archive upload fails.

The manifest is uploaded only after the database mirror, dump, checksum, and media archive have succeeded. Retention runs only after the manifest upload. An incomplete upload without a manifest is not considered a restorable backup set.

The mirror refresh uses `pg_restore --clean --if-exists` to replace objects represented in the dump. It is a convenience mirror, not a substitute for the timestamped Object Storage archives.

## Restore behavior and safety

The manual restore action:
1. Finds the latest complete backup set.
2. Downloads the database dump and media files.
3. Verifies the database SHA-256 checksum and confirms that the dump contains table data and media files.
4. Creates a pre-restore snapshot of the current staging database and current staging media bucket under `pre-restore/<UTC timestamp>/`.
5. Restores the database into `STAGING_DATABASE_URL`.
6. Verifies that restored staging contains application rows.
7. Replaces the staging media bucket using `aws s3 sync --delete`.

This is destructive to the staging database and staging media bucket. The action requires the exact confirmation input `RESTORE`. Test it against disposable Neon resources before relying on it for recovery.

The dump restores database objects and data, not Neon project settings, roles, secrets, Payload environment variables, or infrastructure. Use direct/unpooled Neon database connection strings for both database secrets.

## Operational notes

- Keep `staging` as the repository default branch because GitHub scheduled workflows run from the default branch. The job also checks that its ref is exactly `staging`.
- GitHub may delay scheduled jobs during periods of high load.
- Rotate any Neon credentials previously exposed in chats or elsewhere. Store replacement credentials only in GitHub Actions secrets.
