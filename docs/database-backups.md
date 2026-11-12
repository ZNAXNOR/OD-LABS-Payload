# OD LABS database and media backups

Both workflows run only from the `staging` branch and are independent of Dokploy deployments and application startup.

## Workflows

- **Staging Database and Media Backup**: daily at 00:00 IST (18:30 UTC), plus manual trigger.
- **Restore Latest Database and Media Backup**: manual only; requires typing `RESTORE`.

Each completed backup set is stored at `backups/<UTC timestamp>/` inside the backup Object Storage bucket:
- `database.dump`: PostgreSQL custom-format dump of the staging database.
- `database.sha256`: checksum.
- `media/`: copy of the staging media bucket.
- `manifest.json`: written last to mark the set complete.

The newest 10 complete backup sets are retained. Older sets under `backups/` are deleted; other objects such as Dokploy backups and `pre-restore/` safety snapshots are not touched.

## Exactly four GitHub Actions secrets

Create these under **Repository → Settings → Secrets and variables → Actions → Repository secrets**.

### 1. `STAGING_DATABASE_URL`
One direct/unpooled PostgreSQL connection string for the staging source database. Use the Neon direct endpoint (hostname without `-pooler`).

### 2. `BACKUP_DATABASE_URL`
One direct/unpooled PostgreSQL connection string for the backup project's database. The manual restore workflow restores the selected dump into this database. It is not used by the nightly backup upload itself.

### 3. `STAGING_STORAGE_ENV`
A multiline secret containing the staging media bucket configuration. Use this format:

```dotenv
AWS_ENDPOINT_URL_S3="https://YOUR-STAGING-ENDPOINT"
AWS_ACCESS_KEY_ID="YOUR-STAGING-ACCESS-KEY"
AWS_SECRET_ACCESS_KEY="YOUR-STAGING-SECRET"
AWS_REGION="us-east-2"
AWS_S3_BUCKET="payloadcms-staging-media"
```

The key must have permission to list and read objects in the staging bucket. During restore, this same bucket is the destination for the media snapshot and is replaced.

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

The two storage secrets are sourced as shell environment files by the workflows. Keep the five variable names exactly as shown.

## Restore behavior and safety

The manual restore action:
1. Finds the latest complete backup set.
2. Downloads the database dump and media files.
3. Verifies the database SHA-256 checksum.
4. Creates a pre-restore snapshot of the current `BACKUP_DATABASE_URL` database and current staging media bucket under `pre-restore/<UTC timestamp>/`.
5. Runs `pg_restore --clean --if-exists` against `BACKUP_DATABASE_URL`.
6. Replaces the staging media bucket using `aws s3 sync --delete`.

This is destructive to the destination database and staging media bucket. The action requires the exact confirmation input `RESTORE`. Test it against disposable Neon resources before relying on it for recovery.

The dump restores database objects and data, not Neon project settings, roles, secrets, Payload environment variables, or infrastructure. Use direct/unpooled Neon database connection strings for both database secrets.

## Operational notes

- Keep `staging` as the repository default branch because GitHub scheduled workflows run from the default branch. The job also checks that its ref is exactly `staging`.
- GitHub may delay scheduled jobs during periods of high load.
- Rotate any Neon credentials previously exposed in chats or elsewhere. Store replacement credentials only in GitHub Actions secrets.
