#!/usr/bin/env python3
"""Send GitHub Actions backup/restore failure alerts through Resend."""
import json
import os
import sys
import urllib.error
import urllib.request


def main():
    api_key = os.getenv("RESEND_API_KEY")
    sender = os.getenv("RESEND_FROM_EMAIL")
    recipients = [value.strip() for value in os.getenv("RESEND_TO_EMAIL", "").split(",") if value.strip()]
    missing = [name for name, value in (
        ("RESEND_API_KEY", api_key),
        ("RESEND_FROM_EMAIL", sender),
        ("RESEND_TO_EMAIL", recipients),
    ) if not value]
    if missing:
        print("::warning::Resend notification configuration is incomplete: " + ", ".join(missing))
        return 0

    workflow = os.getenv("GITHUB_WORKFLOW", "GitHub Actions workflow")
    repository = os.getenv("GITHUB_REPOSITORY", "unknown repository")
    run_id = os.getenv("GITHUB_RUN_ID", "")
    run_number = os.getenv("GITHUB_RUN_NUMBER", "")
    sha = os.getenv("GITHUB_SHA", "")
    branch = os.getenv("GITHUB_REF_NAME", "")
    server = os.getenv("GITHUB_SERVER_URL", "https://github.com")
    run_url = f"{server}/{repository}/actions/runs/{run_id}"

    failed_steps = []
    try:
        steps = json.loads(os.getenv("FAILED_STEPS", "{}"))
        failed_steps = [
            name.replace("_", " ")
            for name, details in steps.items()
            if isinstance(details, dict) and details.get("conclusion") == "failure"
        ]
    except (json.JSONDecodeError, TypeError):
        pass

    phase = ", ".join(failed_steps) if failed_steps else "Job failed; inspect the workflow logs for the failing step."
    subject = f"[OD LABS] Workflow failed: {workflow} (run #{run_number})"
    body = (
        f"Workflow: {workflow}\n"
        f"Repository: {repository}\n"
        f"Branch: {branch}\n"
        f"Run: #{run_number} (ID {run_id})\n"
        f"Commit: {sha}\n"
        f"Failed phase(s): {phase}\n\n"
        f"Open workflow logs: {run_url}\n"
    )
    payload = json.dumps({
        "from": sender,
        "to": recipients,
        "subject": subject,
        "text": body,
    }).encode("utf-8")
    request = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "od-labs-backup-alerts/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            response_body = response.read().decode("utf-8", errors="replace")
            print(f"Resend accepted failure alert (HTTP {response.status}).")
            if response_body:
                try:
                    message_id = json.loads(response_body).get("id")
                    if message_id:
                        print(f"Resend message ID: {message_id}")
                except json.JSONDecodeError:
                    pass
    except urllib.error.HTTPError as exc:
        print(f"::warning::Resend API returned HTTP {exc.code}: {exc.read().decode('utf-8', errors='replace')}")
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"::warning::Could not deliver Resend failure alert: {exc}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
