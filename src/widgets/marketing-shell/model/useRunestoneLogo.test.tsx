// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RUNESTONE_LOGO_VARIANTS } from "../config";

import { useRunestoneLogo } from "./useRunestoneLogo";

describe("useRunestoneLogo", () => {
	it("returns the desktop logo view model", () => {
		const { result } = renderHook(() =>
			useRunestoneLogo(RUNESTONE_LOGO_VARIANTS.DESKTOP),
		);

		expect(result.current.segments[0]?.label).toBe("RUNE");
		expect(result.current.segments[1]?.label).toBe("STONE");
	});

	it("returns the compact logo view model", () => {
		const { result } = renderHook(() =>
			useRunestoneLogo(RUNESTONE_LOGO_VARIANTS.COMPACT),
		);

		expect(result.current.segments[0]?.label).toBe("R");
		expect(result.current.segments[1]?.label).toBe("S");
	});
});
