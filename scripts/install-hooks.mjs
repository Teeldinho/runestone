import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

if (!existsSync(".git")) {
	process.exit(0);
}

const result = spawnSync("npx", ["lefthook", "install"], {
	stdio: "inherit",
	shell: true,
});

process.exit(result.status ?? 0);
