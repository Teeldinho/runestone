// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useMarketingNavigationSheet } from "./useMarketingNavigationSheet";

describe("useMarketingNavigationSheet", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		document.body.replaceChildren();
	});

	it("scrolls to the selected anchor after the sheet releases scroll lock", () => {
		const target = document.createElement("section");
		target.id = "machine";
		target.scrollIntoView = vi.fn();
		document.body.append(target);
		const anchor = document.createElement("a");
		anchor.href = "/#machine";
		const { result } = renderHook(() => useMarketingNavigationSheet());

		act(() => {
			result.current.handleAnchorNavigation({
				currentTarget: anchor,
			} as React.MouseEvent<HTMLAnchorElement>);
			vi.runAllTimers();
		});

		expect(target.scrollIntoView).toHaveBeenCalledOnce();
	});
});
