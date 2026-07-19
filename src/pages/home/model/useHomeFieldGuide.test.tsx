// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { HOME_FIELD_GUIDE_VALUES } from "../config";
import { useHomeFieldGuide } from "./useHomeFieldGuide";

describe("useHomeFieldGuide", () => {
	beforeEach(() => {
		window.history.replaceState(null, "", "/");
	});

	it("opens the controls panel from its legacy deep link", () => {
		window.history.replaceState(null, "", "/#controls");

		const { result } = renderHook(() => useHomeFieldGuide());

		expect(result.current.activeValue).toBe(HOME_FIELD_GUIDE_VALUES.CONTROLS);
	});

	it("updates the URL hash when the selected guide changes", () => {
		const { result } = renderHook(() => useHomeFieldGuide());

		act(() => {
			result.current.handleValueChange(HOME_FIELD_GUIDE_VALUES.CONTROLS);
		});

		expect(result.current.activeValue).toBe(HOME_FIELD_GUIDE_VALUES.CONTROLS);
		expect(window.location.hash).toBe("#controls");
	});
});
