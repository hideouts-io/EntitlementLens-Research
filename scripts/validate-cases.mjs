import { readFile, readdir, stat } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const schema = JSON.parse(await readFile(new URL("../schema/case-v1.schema.json", import.meta.url), "utf8"));
const caseDirectory = new URL("../cases/", import.meta.url);
const caseFiles = (await readdir(caseDirectory, { withFileTypes: true }))
  .filter((entry) => entry.name.endsWith(".json"))
  .sort((left, right) => left.name.localeCompare(right.name));

const ajv = new Ajv2020({ strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
const maximumCaseBytes = 8 * 1024 * 1024;
let hasFailure = caseFiles.length === 0;

if (hasFailure) {
  console.error("No research cases found in cases/.");
}

for (const entry of caseFiles) {
  const name = JSON.stringify(entry.name);
  if (!entry.isFile()) {
    console.error(`${name}: expected a regular JSON file`);
    hasFailure = true;
    continue;
  }

  const fileURL = new URL(entry.name, caseDirectory);
  if ((await stat(fileURL)).size > maximumCaseBytes) {
    console.error(`${name}: exceeds the 8 MiB case file limit`);
    hasFailure = true;
    continue;
  }

  let record;
  try {
    record = JSON.parse(await readFile(fileURL, "utf8"));
  } catch {
    console.error(`${name}: could not read and parse JSON`);
    hasFailure = true;
    continue;
  }

  if (!validate(record)) {
    console.error(`${name}: does not match case-v1.schema.json`);
    for (const error of validate.errors ?? []) {
      console.error(`  ${JSON.stringify(error.instancePath || "/")}: ${error.message}`);
    }
    hasFailure = true;
    continue;
  }

  if (`${record.case_id}.json` !== entry.name) {
    console.error(`${name}: filename must match case_id`);
    hasFailure = true;
    continue;
  }

  console.log(`${name}: valid case-v1 record`);
}

if (hasFailure) {
  process.exitCode = 1;
}
