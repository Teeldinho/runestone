#!/usr/bin/env node

import { constants } from "node:fs";
import { access, readdir } from "node:fs/promises";
import path from "node:path";

const LAYERS_WITH_SLICES = new Set([
	"pages",
	"widgets",
	"features",
	"entities",
]);
const SHARED_LAYER = "shared";
const SEGMENTS = new Set(["ui", "model", "lib", "api", "config"]);
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);

const parseArgs = (argv) => {
	const args = { repo: process.cwd() };

	for (let index = 0; index < argv.length; index += 1) {
		const current = argv[index];
		if (current === "--repo" && argv[index + 1]) {
			args.repo = path.resolve(argv[index + 1]);
			index += 1;
		}
	}

	return args;
};

const exists = async (targetPath) => {
	try {
		await access(targetPath, constants.F_OK);
		return true;
	} catch {
		return false;
	}
};

const collectFiles = async (directoryPath) => {
	const entries = await readdir(directoryPath, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(directoryPath, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await collectFiles(fullPath)));
			continue;
		}

		if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
			files.push(fullPath);
		}
	}

	return files;
};

const collectSliceDirectories = async (layerPath) => {
	const entries = await readdir(layerPath, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isDirectory())
		.map((entry) => path.join(layerPath, entry.name));
};

const toRelativePath = (repoRoot, filePath) =>
	path.relative(repoRoot, filePath).split(path.sep).join("/");

const checkSegmentSubfolders = (relativePath) => {
	const parts = relativePath.split("/");
	const [, layer, maybeSliceOrSegment, maybeSegment, ...rest] = parts;

	if (LAYERS_WITH_SLICES.has(layer) && SEGMENTS.has(maybeSegment)) {
		return rest.length > 1;
	}

	if (layer === SHARED_LAYER && SEGMENTS.has(maybeSliceOrSegment)) {
		return [maybeSegment, ...rest].length > 1;
	}

	return false;
};

const run = async () => {
	const { repo: repoRoot } = parseArgs(process.argv.slice(2));
	const srcDir = path.join(repoRoot, "src");
	const violations = [];

	if (!(await exists(srcDir))) {
		console.info(
			"[lint:structure] No src directory found; skipping FSD path checks.",
		);
		return;
	}

	const files = await collectFiles(srcDir);
	for (const filePath of files) {
		const relativePath = toRelativePath(repoRoot, filePath);
		if (checkSegmentSubfolders(relativePath)) {
			violations.push(
				`${relativePath} [fsd-segment-paths] FSD segment folders must stay flat; move files directly under ui/model/lib/api/config.`,
			);
		}
	}

	for (const layer of LAYERS_WITH_SLICES) {
		const layerPath = path.join(srcDir, layer);
		if (!(await exists(layerPath))) {
			continue;
		}

		for (const slicePath of await collectSliceDirectories(layerPath)) {
			const publicApiPath = path.join(slicePath, "index.ts");
			if (!(await exists(publicApiPath))) {
				violations.push(
					`${toRelativePath(repoRoot, slicePath)} [fsd-public-api] FSD slices must expose an index.ts public API.`,
				);
			}
		}
	}

	if (violations.length > 0) {
		console.error("[lint:structure] FSD path violations detected:\n");
		for (const violation of violations) {
			console.error(`- ${violation}`);
		}
		console.error(`\nTotal violations: ${violations.length}`);
		process.exitCode = 1;
		return;
	}

	console.info("[lint:structure] FSD path checks passed.");
};

await run();
