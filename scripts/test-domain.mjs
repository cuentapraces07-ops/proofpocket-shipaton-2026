import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "proofpocket-domain-"));
const tscPath = join(root, "node_modules", "typescript", "bin", "tsc");

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

try {
  run(process.execPath, [
    tscPath,
    "src/domain.ts",
    "src/domain.test.ts",
    "src/solana.ts",
    "src/solana.test.ts",
    "--target",
    "ES2022",
    "--module",
    "commonjs",
    "--outDir",
    output,
    "--skipLibCheck",
  ]);
  run(process.execPath, ["--test", join(output, "domain.test.js"), join(output, "solana.test.js")]);
} finally {
  rmSync(output, { recursive: true, force: true });
}
