import { describe, expect, it } from "vitest";

import { HOME_MANIFEST_TONES } from "../config";
import { resolveHomeManifestToneClassName } from "./resolveHomeManifestToneClassName";

describe("resolveHomeManifestToneClassName", () => {
	it("returns active classes", () => {
		expect(
			resolveHomeManifestToneClassName(HOME_MANIFEST_TONES.ACTIVE),
		).toContain("text-dungeon-gold");
	});

	it("returns available classes", () => {
		expect(
			resolveHomeManifestToneClassName(HOME_MANIFEST_TONES.AVAILABLE),
		).toContain("text-dungeon-gold");
	});

	it("returns sealed classes", () => {
		expect(
			resolveHomeManifestToneClassName(HOME_MANIFEST_TONES.SEALED),
		).toContain("text-dungeon-rune-sealed");
	});
});
