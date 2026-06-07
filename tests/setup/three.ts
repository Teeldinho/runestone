Reflect.deleteProperty(globalThis, "__THREE__");

const originalConsoleWarn = console.warn;

console.warn = (...args: unknown[]) => {
	if (args[0] === "WARNING: Multiple instances of Three.js being imported.") {
		return;
	}

	originalConsoleWarn(...args);
};
