// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PLAYER_ENTITY_CONFIG } from "../config";

import { usePlayerMesh } from "./usePlayerMesh";

describe("usePlayerMesh", () => {
	it("returns player mesh settings by default", () => {
		const { result } = renderHook(() => usePlayerMesh());

		expect(result.current).toEqual({
			position: [0, PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET, 0],
		});
	});

	it("returns the provided position when overridden", () => {
		const { result } = renderHook(() =>
			usePlayerMesh({
				position: [4, 5, 6],
			}),
		);

		expect(result.current.position).toEqual([4, 5, 6]);
	});
});
