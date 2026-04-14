export const HAPTICS_DEBUG_MODE_ENABLED =
	typeof process !== "undefined" && process.env.NODE_ENV === "development";
