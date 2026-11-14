#!/usr/bin/env python3
"""Select complete backup sets and enforce retention in Neon Object Storage."""
import os
import sys
import boto3
from botocore.config import Config


def client():
    names = ("AWS_ENDPOINT_URL_S3", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_REGION")
    missing = [name for name in names if not os.getenv(name)]
    if missing:
        raise SystemExit("Missing storage environment variables: " + ", ".join(missing))
    return boto3.client(
        "s3",
        endpoint_url=os.environ["AWS_ENDPOINT_URL_S3"],
        region_name=os.environ["AWS_REGION"],
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        config=Config(s3={"addressing_style": "path"}),
    )


def complete_prefixes(s3, bucket):
    found = []
    paginator = s3.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=bucket, Prefix="backups/", Delimiter="/"):
        for item in page.get("CommonPrefixes", []):
            prefix = item["Prefix"]
            try:
                s3.head_object(Bucket=bucket, Key=prefix + "manifest.json")
                found.append(prefix)
            except Exception as exc:
                if getattr(exc, "response", {}).get("ResponseMetadata", {}).get("HTTPStatusCode") != 404:
                    raise
    return sorted(found)


def delete_prefix(s3, bucket, prefix):
    deleted = 0
    paginator = s3.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=bucket, Prefix=prefix):
        objects = [{"Key": obj["Key"]} for obj in page.get("Contents", [])]
        for offset in range(0, len(objects), 1000):
            batch = objects[offset:offset + 1000]
            if batch:
                result = s3.delete_objects(Bucket=bucket, Delete={"Objects": batch, "Quiet": True})
                if result.get("Errors"):
                    raise RuntimeError("Object deletion errors: " + repr(result["Errors"][:3]))
                deleted += len(batch)
    return deleted


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in ("latest", "prune"):
        raise SystemExit("Usage: storage.py latest|prune")
    bucket = os.environ.get("AWS_S3_BUCKET")
    if not bucket:
        raise SystemExit("Missing AWS_S3_BUCKET")
    s3 = client()
    prefixes = complete_prefixes(s3, bucket)

    if sys.argv[1] == "latest":
        if not prefixes:
            raise SystemExit("No complete backups found.")
        print(prefixes[-1])
        return

    retention = int(os.getenv("BACKUP_RETENTION", "10"))
    if retention < 1:
        raise SystemExit("BACKUP_RETENTION must be at least 1")
    for prefix in prefixes[:-retention]:
        count = delete_prefix(s3, bucket, prefix)
        print(f"Deleted oldest complete backup set {prefix} ({count} objects)")
    print(f"Retention complete: {min(len(prefixes), retention)} complete backup set(s) retained.")


if __name__ == "__main__":
    main()
