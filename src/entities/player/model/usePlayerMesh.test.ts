// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PLAYER_ENTITY_CONFIG } from "../config";

import { usePlayerMesh } from "./usePlayerMesh";

describe("usePlayerMesh", () => {
	it("returns alive player mesh settings by default", () => {
		const { result } = renderHook(() => usePlayerMesh());

		expect(result.current).toEqual({
			auraColor: "#00d7ff",
			auraEmissiveIntensity: 1.25,
			position: [0, PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET, 0],
		});
	});

	it("returns damaged aura style when health state is overridden", () => {
		const { result } = renderHook(() =>
			usePlayerMesh({ healthState: "damaged" }),
		);

		expect(result.current.auraColor).toBe("#ffb347");
		expect(result.current.auraEmissiveIntensity).toBe(1.1);
	});
});
