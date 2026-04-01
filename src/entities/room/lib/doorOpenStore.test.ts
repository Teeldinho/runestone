import { afterEach, describe, expect, it, vi } from "vitest";

import {
	isDoorOpened,
	markDoorOpened,
	resetDoorOpenStore,
	subscribeToDoorOpenState,
} from "./doorOpenStore";

describe("doorOpenStore", () => {
	afterEach(() => {
		resetDoorOpenStore();
	});

	it("returns false for unopened doors", () => {
		expect(isDoorOpened("entrance", "south")).toBe(false);
	});

	it("returns true after marking a door as opened", () => {
		markDoorOpened("entrance", "south");
		expect(isDoorOpened("entrance", "south")).toBe(true);
	});

	it("does not notify listeners if door is already opened", () => {
		markDoorOpened("entrance", "south");

		const listener = vi.fn();
		subscribeToDoorOpenState(listener);

		markDoorOpened("entrance", "south");
		expect(listener).not.toHaveBeenCalled();
	});

	it("notifies listeners when a door is opened", () => {
		const listener = vi.fn();
		subscribeToDoorOpenState(listener);

		markDoorOpened("entrance", "south");
		expect(listener).toHaveBeenCalledOnce();
	});

	it("supports unsubscribe", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToDoorOpenState(listener);

		unsubscribe();
		markDoorOpened("entrance", "south");
		expect(listener).not.toHaveBeenCalled();
	});

	it("tracks doors independently by room and side", () => {
		markDoorOpened("entrance", "south");

		expect(isDoorOpened("entrance", "south")).toBe(true);
		expect(isDoorOpened("library", "south")).toBe(false);
		expect(isDoorOpened("entrance", "north")).toBe(false);
	});

	it("resets all doors", () => {
		markDoorOpened("entrance", "south");
		markDoorOpened("library", "north");

		resetDoorOpenStore();

		expect(isDoorOpened("entrance", "south")).toBe(false);
		expect(isDoorOpened("library", "north")).toBe(false);
	});
});
