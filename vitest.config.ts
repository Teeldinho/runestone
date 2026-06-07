import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			"#": srcPath,
			"@": srcPath,
		},
	},
	test: {
		environment: "node",
		passWithNoTests: true,
		setupFiles: ["./tests/setup/three.ts"],
		coverage: {
			provider: "v8",
			thresholds: {
				lines: 55,
				functions: 60,
				branches: 55,
				statements: 55,
			},
		},
	},
});
