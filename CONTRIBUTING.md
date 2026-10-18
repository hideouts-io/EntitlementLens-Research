# Contributing research records

This repository is public. A full EntitlementLens JSON or CSV export is not a submission format: it can retain local paths, volume and file metadata, signing identifiers, arbitrary entitlement values, embedded content, and free-text warnings. Keep source exports and binaries outside this repository.

Submit one `schema_version: 1` JSON case under `cases/` with a stable, descriptive filename. Use the closed [case schema](schema/case-v1.schema.json). Record the exact EntitlementLens source commit, feature-schema version, collection macOS version and build, artifact digest, and architecture-specific collection states. Use `controlled_fixture`, `system_binary`, or `reviewed_scan` to describe the source; a controlled fixture must be identified as such. Do not change `runtime_authorization` from `not_assessed` based on static evidence.

Name the file after its `case_id`, then run `npm ci --ignore-scripts` and `npm run validate`. Pull requests run the same schema check for every case. Passing validation confirms the file's shape; maintainers still review provenance, interpretation, privacy, and sharing rights.

Before proposing a case, check the candidate and staged diff for names, personal paths, usernames, volume identifiers, account or team identifiers, credentials, URLs with secrets, raw strings or property lists, quarantine data, and unsupported copyright material. Remove fields that are outside this schema. If removing a value would make the retained evidence misleading, do not publish that case. A schema check and `.gitignore` do not replace this review.

Explain the source and reproduction method in the pull request. Preserve `complete`, `partial`, and unavailable collection states as observed; an empty partial collection is not a negative finding. SHA-256 identifies observed bytes but does not prove their origin, authenticity, or runtime use. Do not label software malicious, safe, authorized, or compromised from these records.

Contributors must have the right to share their original curation under [CC BY 4.0](LICENSE). Link to vendor documentation instead of copying it. A maintainer reviews the exact proposed record before publication; there is no automatic upload from the app.
