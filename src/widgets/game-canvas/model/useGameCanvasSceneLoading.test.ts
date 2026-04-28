// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useGameCanvasSceneLoading } from "./useGameCanvasSceneLoading";

describe("useGameCanvasSceneLoading", () => {
	it("starts loading and exposes a ready handler that hides the loading state", () => {
		const { result } = renderHook(() => useGameCanvasSceneLoading());

		expect(result.current.isSceneLoading).toBe(true);

		act(() => {
			result.current.handleSceneReady();
		});

		expect(result.current.isSceneLoading).toBe(false);
	});
});
