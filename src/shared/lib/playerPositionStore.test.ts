import { describe, expect, it, vi } from "vitest";

import {
	getPlayerPosition,
	getPlayerPositionSnapshot,
	hasPlayerPosition,
	setPlayerPosition,
	subscribeToPlayerPosition,
} from "./playerPositionStore";

describe("playerPositionStore", () => {
	it("reports initialization after the first position update", () => {
		expect(hasPlayerPosition()).toBe(false);

		setPlayerPosition(3, 1, -4);

		expect(hasPlayerPosition()).toBe(true);
	});

	it("notifies subscribers when player position changes", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToPlayerPosition(listener);

		setPlayerPosition(30, 10, -40);

		expect(listener).toHaveBeenCalledTimes(1);
		expect(getPlayerPosition()).toEqual([30, 10, -40]);

		unsubscribe();
	});

	it("does not notify subscribers when position stays the same", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToPlayerPosition(listener);

		setPlayerPosition(3, 1, -4);
		listener.mockClear();

		setPlayerPosition(3, 1, -4);

		expect(listener).not.toHaveBeenCalled();

		unsubscribe();
	});

	it("returns a stable snapshot identity until position changes", () => {
		setPlayerPosition(5, 2, -1);

		const snapshotA = getPlayerPositionSnapshot();
		const snapshotB = getPlayerPositionSnapshot();

		expect(snapshotA).toEqual([5, 2, -1]);
		expect(snapshotB).toEqual([5, 2, -1]);
		expect(snapshotA).toBe(snapshotB);

		setPlayerPosition(6, 2, -1);

		expect(getPlayerPositionSnapshot()).not.toBe(snapshotA);
	});

	it("stops notifications after unsubscribe", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToPlayerPosition(listener);

		unsubscribe();
		setPlayerPosition(1, 2, 3);

		expect(listener).not.toHaveBeenCalled();
	});
});
