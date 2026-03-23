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
		coverage: {
			provider: "v8",
			thresholds: {
				// Current baseline (Mar 2026): lines ~59%, functions ~65%, branches ~75%.
				// Raise these incrementally as coverage improves toward the ENF-TEST-08
				// targets of 80% overall and 100% for model/ and lib/.
				lines: 55,
				functions: 60,
				branches: 55,
				statements: 55,
			},
		},
	},
});
