import { describe, expect, it, vi } from "vitest";

import {
	preloadGltfAssets,
	shouldPreloadGltfAssets,
} from "./preloadGltfAssets";

describe("preloadGltfAssets", () => {
	it("skips preloads while tests are running", () => {
		const preload = vi.fn();

		preloadGltfAssets({ preload }, ["/models/player.glb"]);

		expect(preload).not.toHaveBeenCalled();
	});

	it("reports test mode as non-preloadable", () => {
		expect(shouldPreloadGltfAssets()).toBe(false);
	});
});
