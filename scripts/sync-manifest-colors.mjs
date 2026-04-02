import { readFileSync, writeFileSync } from "node:fs";

const GLOBALS_PATH = "src/app/styles/globals.css";
const MANIFEST_PATH = "public/manifest.json";

const globals = readFileSync(GLOBALS_PATH, "utf8");
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));

const extractToken = (tokenName) => {
	const pattern = new RegExp(`--${tokenName}\\s*:\\s*([^;]+);`);
	const match = globals.match(pattern);

	if (!match?.[1]) {
		throw new Error(`Token --${tokenName} was not found in ${GLOBALS_PATH}.`);
	}

	return match[1].trim();
};

const themeColor = extractToken("app-background-end");
const backgroundColor = extractToken("background");

manifest.theme_color = themeColor;
manifest.background_color = backgroundColor;

writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, "\t")}\n`);
