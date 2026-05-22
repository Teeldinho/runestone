// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from "vitest";

import {
	createResponsiveMediaQuerySubscriptions,
	removeResponsiveMediaQuerySubscriptions,
} from "./responsiveMediaQuerySubscriptions";

const originalMatchMedia = window.matchMedia;

afterEach(() => {
	window.matchMedia = originalMatchMedia;
	vi.restoreAllMocks();
});

describe("responsive media query subscriptions", () => {
	it("registers media query listeners and removes the same listener references", () => {
		const addEventListener = vi.fn();
		const removeEventListener = vi.fn();

		window.matchMedia = vi.fn().mockReturnValue({
			matches: true,
			addEventListener,
			removeEventListener,
		});

		const setMatches = vi.fn();

		const subscriptions = createResponsiveMediaQuerySubscriptions([
			{
				query: "(orientation: landscape)",
				setMatches,
			},
		]);

		removeResponsiveMediaQuerySubscriptions(subscriptions);

		expect(setMatches).toHaveBeenCalledWith(true);
		expect(addEventListener).toHaveBeenCalledTimes(1);
		expect(removeEventListener).toHaveBeenCalledTimes(1);
		expect(removeEventListener).toHaveBeenCalledWith(
			"change",
			addEventListener.mock.calls[0]?.[1],
		);
	});
});
