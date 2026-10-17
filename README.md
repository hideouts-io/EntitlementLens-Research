# EntitlementLens Research

This is a public, small, reviewed dataset for learning how to interpret **static macOS entitlement evidence**. The [EntitlementLens application](https://github.com/hideouts-io/EntitlementLens) and its source code live in a separate repository. This repository holds selected research records, not copies of the app or complete scan exports.

EntitlementLens inspects files without running them. It reads code-signature and entitlement declarations, including architecture-specific dictionaries, and records signing and collection coverage. It can also collect supporting embedded evidence and other static features. An entitlement in a signature is a declaration; it does not by itself establish that a process used a capability or received a runtime authorization decision. Apple's [entitlement documentation](https://developer.apple.com/documentation/BundleResources/Entitlements) describes where these declarations are stored, and [Code Signing Services](https://developer.apple.com/documentation/security/code-signing-services) distinguishes static code from running code.

## Read a case

Each [`case-v1` record](schema/case-v1.schema.json) contains the collector source revision, collection macOS build, artifact digest, signature integrity observation, and one entitlement dictionary per architecture. A `complete` collection state with an empty `declarations` array means no entries were returned **for that recorded dictionary and architecture**. `partial`, `unavailable`, and other states do not establish absence. `runtime_authorization` is always `not_assessed` in this static dataset. A valid signature status describes the integrity check performed; it is not a safety or trust verdict.

| Case | Source | Useful comparison |
| --- | --- | --- |
| [macOS `true`](cases/macos-true-26a428.json) | Apple-supplied system tool on the recorded macOS build | Completed, empty per-architecture dictionaries |
| [Curated universal fixture](cases/curated-universal-fixture.json) | Controlled fixture in the app's integration tests | The same key can have different typed values in different architectures |

The fixture's private-looking key is deliberately synthetic. It is not evidence that Apple grants or uses that key. The sample is useful for testing exact spelling, value type, and architecture handling.

Both records identify [EntitlementLens source revision `a29639f`](https://github.com/hideouts-io/EntitlementLens/commit/a29639fe853c948adc05d649ed6960a487822aee). The fixture is produced by its [curated explanation integration test](https://github.com/hideouts-io/EntitlementLens/blob/a29639fe853c948adc05d649ed6960a487822aee/Tests/EntitlementLensTests/EntitlementExplanationIntegrationTests.swift).

## Reproduce the collection

The two records were projected from test exports produced by the committed EntitlementLens source revision named in each case. On a macOS host with a Swift 6.2-compatible toolchain, run the relevant tests from a clean checkout of that revision:

```sh
swift test -j 4 --filter StaticFeatureExportIntegrationTests --filter EntitlementExplanationIntegrationTests
```

The tests write full JSON under `.build/static-feature-validation/`. Those files include local paths and host metadata and must stay local. The public records retain only reviewed fields from `true.json` and `curated-explanations.json`. The SHA-256 values identify the bytes observed in this collection; different macOS builds or fixture toolchains can produce different bytes. The tests were run successfully for these records, but no binary in this repository was executed to establish runtime behavior.

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a record. Begin with controlled fixtures or a narrowly selected, authorized scan. Prepare a local candidate, validate it against the versioned schema, and review every field before a Git change. Do not commit full EntitlementLens exports, binaries, personal paths, credentials, or unrestricted carved evidence. The existing mounted-volume report is not part of this release.

The original curation and documentation here are available under [CC BY 4.0](LICENSE). The license does not cover the EntitlementLens application, Apple software, or third-party material linked from a record.
