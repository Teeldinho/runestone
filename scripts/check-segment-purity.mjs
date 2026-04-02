import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const TARGET_DIRECTORIES = ["src", "convex"];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);

const FUNCTION_DECLARATION_PATTERN =
	/^(export\s+)?function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/;
const ARROW_DECLARATION_PATTERN =
	/^(export\s+)?const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(async\s*)?(<[^>]+>\s*)?\(/;
const FUNCTION_EXPRESSION_PATTERN =
	/^(export\s+)?const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(async\s*)?function\s*\(/;
const UPPERCASE_CONSTANT_PATTERN = /^(export\s+)?const\s+([A-Z][A-Z0-9_]*)\b/;

const isComponentName = (name) => /^[A-Z]/.test(name);
const isHookName = (name) => /^use[A-Z]/.test(name);

const shouldSkipFile = (relativePath) => {
	if (relativePath.includes("node_modules")) {
		return true;
	}

	if (relativePath.includes("/convex/_generated/")) {
		return true;
	}

	if (relativePath.endsWith("routeTree.gen.ts")) {
		return true;
	}

	if (relativePath.endsWith(".d.ts")) {
		return true;
	}

	if (relativePath.endsWith(".test.ts") || relativePath.endsWith(".test.tsx")) {
		return true;
	}

	return false;
};

const collectSourceFiles = async (directoryPath) => {
	const entries = await readdir(directoryPath, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(directoryPath, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await collectSourceFiles(fullPath)));
			continue;
		}

		if (!SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
			continue;
		}

		files.push(fullPath);
	}

	return files;
};

const parseTopLevelDeclarations = (fileContent) => {
	const declarations = [];
	const lines = fileContent.split("\n");

	for (let index = 0; index < lines.length; index += 1) {
		const rawLine = lines[index] ?? "";

		if (!rawLine || /^\s/.test(rawLine)) {
			continue;
		}

		const line = rawLine.trim();

		if (line.startsWith("//") || line.startsWith("*")) {
			continue;
		}

		const lineNumber = index + 1;

		const functionDeclarationMatch = FUNCTION_DECLARATION_PATTERN.exec(line);
		if (functionDeclarationMatch) {
			declarations.push({
				kind: "function",
				lineNumber,
				name: functionDeclarationMatch[2],
			});
			continue;
		}

		const arrowDeclarationMatch = ARROW_DECLARATION_PATTERN.exec(line);
		if (arrowDeclarationMatch) {
			declarations.push({
				kind: "function",
				lineNumber,
				name: arrowDeclarationMatch[2],
			});
			continue;
		}

		const functionExpressionMatch = FUNCTION_EXPRESSION_PATTERN.exec(line);
		if (functionExpressionMatch) {
			declarations.push({
				kind: "function",
				lineNumber,
				name: functionExpressionMatch[2],
			});
			continue;
		}

		const uppercaseConstantMatch = UPPERCASE_CONSTANT_PATTERN.exec(line);
		if (uppercaseConstantMatch) {
			declarations.push({
				kind: "static_constant",
				lineNumber,
				name: uppercaseConstantMatch[2],
			});
		}
	}

	return declarations;
};

const formatViolation = ({ filePath, lineNumber, ruleId, message }) =>
	`${filePath}:${lineNumber} [${ruleId}] ${message}`;

const run = async () => {
	const violations = [];

	for (const directoryName of TARGET_DIRECTORIES) {
		const directoryPath = path.join(PROJECT_ROOT, directoryName);

		let sourceFiles = [];
		try {
			sourceFiles = await collectSourceFiles(directoryPath);
		} catch {
			continue;
		}

		for (const sourceFilePath of sourceFiles) {
			const relativePath = path
				.relative(PROJECT_ROOT, sourceFilePath)
				.split(path.sep)
				.join("/");

			if (shouldSkipFile(relativePath)) {
				continue;
			}

			const fileContent = await readFile(sourceFilePath, "utf8");
			const declarations = parseTopLevelDeclarations(fileContent);

			const functionDeclarations = declarations.filter(
				(declaration) => declaration.kind === "function",
			);
			const helperDeclarations = functionDeclarations.filter(
				(declaration) =>
					!isComponentName(declaration.name) && !isHookName(declaration.name),
			);

			if (relativePath.includes("/config/")) {
				for (const helperDeclaration of functionDeclarations) {
					violations.push({
						filePath: relativePath,
						lineNumber: helperDeclaration.lineNumber,
						ruleId: "ENF-CONST-32",
						message:
							"config files must be static-only; move helper functions to lib/ or model/",
					});
				}
			}

			if (relativePath.includes("/ui/") && relativePath.endsWith(".tsx")) {
				for (const helperDeclaration of helperDeclarations) {
					violations.push({
						filePath: relativePath,
						lineNumber: helperDeclaration.lineNumber,
						ruleId: "ENF-UI-34",
						message:
							"ui files are render-only; move helper functions to model/ or lib/",
					});
				}
			}

			const staticConstantDeclaration = declarations.find(
				(declaration) => declaration.kind === "static_constant",
			);
			const helperDeclaration = helperDeclarations[0];

			if (staticConstantDeclaration && helperDeclaration) {
				violations.push({
					filePath: relativePath,
					lineNumber: helperDeclaration.lineNumber,
					ruleId: "ENF-CONST-33",
					message:
						"do not mix static constants and helper functions in one file; split into config/ and lib/model",
				});
			}
		}
	}

	if (violations.length > 0) {
		console.error("[lint:purity] Segment purity violations detected:\n");
		for (const violation of violations) {
			console.error(`- ${formatViolation(violation)}`);
		}
		console.error(`\nTotal violations: ${violations.length}`);
		process.exitCode = 1;
		return;
	}

	console.info("[lint:purity] Segment purity checks passed");
};

await run();
