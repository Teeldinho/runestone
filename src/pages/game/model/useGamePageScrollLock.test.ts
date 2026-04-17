// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useGamePageScrollLock } from "./useGamePageScrollLock";

describe("useGamePageScrollLock", () => {
	it("locks document scroll while enabled and restores styles on cleanup", () => {
		document.body.style.overflow = "auto";
		document.body.style.overscrollBehavior = "auto";
		document.documentElement.style.overflow = "auto";
		document.documentElement.style.overscrollBehavior = "auto";

		const { unmount } = renderHook(() => useGamePageScrollLock(true));

		expect(document.body.style.overflow).toBe("hidden");
		expect(document.body.style.overscrollBehavior).toBe("none");
		expect(document.documentElement.style.overflow).toBe("hidden");
		expect(document.documentElement.style.overscrollBehavior).toBe("none");

		unmount();

		expect(document.body.style.overflow).toBe("auto");
		expect(document.body.style.overscrollBehavior).toBe("auto");
		expect(document.documentElement.style.overflow).toBe("auto");
		expect(document.documentElement.style.overscrollBehavior).toBe("auto");
	});

	it("leaves styles unchanged when disabled", () => {
		document.body.style.overflow = "clip";
		document.body.style.overscrollBehavior = "contain";
		document.documentElement.style.overflow = "clip";
		document.documentElement.style.overscrollBehavior = "contain";

		renderHook(() => useGamePageScrollLock(false));

		expect(document.body.style.overflow).toBe("clip");
		expect(document.body.style.overscrollBehavior).toBe("contain");
		expect(document.documentElement.style.overflow).toBe("clip");
		expect(document.documentElement.style.overscrollBehavior).toBe("contain");
	});
});
