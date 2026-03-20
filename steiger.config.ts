import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
	...fsd.configs.recommended,
	{
		rules: {
			"fsd/forbidden-imports": "off",
			"fsd/no-cross-imports": "error",
			"fsd/no-higher-level-imports": "error",
			"fsd/insignificant-slice": "off",
			"fsd/segments-by-purpose": "off",
		},
	},
	{
		ignores: [
			"**/__mocks__/**",
			"**/node_modules/**",
			"**/.next/**",
			"**/.output/**",
			"**/.vinxi/**",
			"**/dist/**",
			"**/build/**",
			"**/generated/**",
		],
	},
]);
