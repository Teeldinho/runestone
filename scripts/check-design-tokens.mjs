import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SOURCE_DIR = join(ROOT, "src");
const GLOBALS_RELATIVE_PATH = "src/app/styles/globals.css";
const MANIFEST_RELATIVE_PATH = "public/manifest.json";

const EXTENSIONS = new Set([".ts", ".tsx", ".css", ".scss", ".json"]);
const COLOR_LITERAL_PATTERN =
	/#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch)\(/g;

const collectFiles = (directoryPath) => {
	const entries = readdirSync(directoryPath, { withFileTypes: true });

	return entries.flatMap((entry) => {
		const absolutePath = join(directoryPath, entry.name);

		if (entry.isDirectory()) {
			return collectFiles(absolutePath);
		}

		const extension = entry.name.slice(entry.name.lastIndexOf("."));
		if (!EXTENSIONS.has(extension)) {
			return [];
		}

		return [absolutePath];
	});
};

const toLineNumber = (sourceText, index) =>
	sourceText.slice(0, index).split("\n").length;

const allowLiteralColorsIn = new Set([
	GLOBALS_RELATIVE_PATH,
	MANIFEST_RELATIVE_PATH,
]);

const scanForColorLiterals = () => {
	const filesToScan = collectFiles(SOURCE_DIR);
	const violations = [];

	for (const absolutePath of filesToScan) {
		const relativePath = relative(ROOT, absolutePath);
		if (allowLiteralColorsIn.has(relativePath)) {
			continue;
		}

		const fileContent = readFileSync(absolutePath, "utf8");
		for (const match of fileContent.matchAll(COLOR_LITERAL_PATTERN)) {
			if (!match[0] || match.index === undefined) {
				continue;
			}

			violations.push({
				path: relativePath,
				line: toLineNumber(fileContent, match.index),
				value: match[0],
			});
		}
	}

	return violations;
};

const extractGlobalToken = (tokenName, globalsText) => {
	const pattern = new RegExp(`--${tokenName}\\s*:\\s*([^;]+);`);
	const match = globalsText.match(pattern);

	if (!match?.[1]) {
		throw new Error(
			`Expected to find --${tokenName} in ${GLOBALS_RELATIVE_PATH} but it is missing.`,
		);
	}

	return match[1].trim();
};

const validateManifestColorSync = () => {
	const globals = readFileSync(join(ROOT, GLOBALS_RELATIVE_PATH), "utf8");
	const manifest = JSON.parse(
		readFileSync(join(ROOT, MANIFEST_RELATIVE_PATH), "utf8"),
	);

	const expectedThemeColor = extractGlobalToken("app-background-end", globals);
	const expectedBackgroundColor = extractGlobalToken("background", globals);

	const syncViolations = [];
	if (manifest.theme_color !== expectedThemeColor) {
		syncViolations.push(
			`${MANIFEST_RELATIVE_PATH}: theme_color should be ${expectedThemeColor} (found ${manifest.theme_color}). Run npm run theme:sync.`,
		);
	}

	if (manifest.background_color !== expectedBackgroundColor) {
		syncViolations.push(
			`${MANIFEST_RELATIVE_PATH}: background_color should be ${expectedBackgroundColor} (found ${manifest.background_color}). Run npm run theme:sync.`,
		);
	}

	return syncViolations;
};

const colorLiteralViolations = scanForColorLiterals();
const manifestSyncViolations = validateManifestColorSync();

if (colorLiteralViolations.length > 0 || manifestSyncViolations.length > 0) {
	if (colorLiteralViolations.length > 0) {
		console.error(
			"Design token violation: found direct color literals outside token files.",
		);
		for (const violation of colorLiteralViolations) {
			console.error(
				` - ${violation.path}:${violation.line} uses ${violation.value}`,
			);
		}
	}

	for (const violation of manifestSyncViolations) {
		console.error(` - ${violation}`);
	}

	process.exit(1);
}

console.log("Design token checks passed.");
