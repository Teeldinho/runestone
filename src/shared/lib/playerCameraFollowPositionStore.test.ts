import { describe, expect, it, vi } from "vitest";

import {
	getPlayerCameraFollowPosition,
	getPlayerCameraFollowPositionSnapshot,
	hasPlayerCameraFollowPosition,
	setPlayerCameraFollowPosition,
	subscribeToPlayerCameraFollowPosition,
} from "./playerCameraFollowPositionStore";

describe("playerCameraFollowPositionStore", () => {
	it("reports initialization after the first position update", () => {
		setPlayerCameraFollowPosition(3, 1, -4);

		expect(hasPlayerCameraFollowPosition()).toBe(true);
	});

	it("notifies subscribers when camera follow position changes", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToPlayerCameraFollowPosition(listener);

		setPlayerCameraFollowPosition(30, 10, -40);

		expect(listener).toHaveBeenCalledTimes(1);
		expect(getPlayerCameraFollowPosition()).toEqual([30, 10, -40]);

		unsubscribe();
	});

	it("does not notify subscribers when position stays the same", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToPlayerCameraFollowPosition(listener);

		setPlayerCameraFollowPosition(3, 1, -4);
		listener.mockClear();

		setPlayerCameraFollowPosition(3, 1, -4);

		expect(listener).not.toHaveBeenCalled();

		unsubscribe();
	});

	it("returns a stable snapshot identity until position changes", () => {
		setPlayerCameraFollowPosition(5, 2, -1);

		const snapshotA = getPlayerCameraFollowPositionSnapshot();
		const snapshotB = getPlayerCameraFollowPositionSnapshot();

		expect(snapshotA).toEqual([5, 2, -1]);
		expect(snapshotB).toEqual([5, 2, -1]);
		expect(snapshotA).toBe(snapshotB);

		setPlayerCameraFollowPosition(6, 2, -1);

		expect(getPlayerCameraFollowPositionSnapshot()).not.toBe(snapshotA);
	});

	it("stops notifications after unsubscribe", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToPlayerCameraFollowPosition(listener);

		unsubscribe();
		setPlayerCameraFollowPosition(1, 2, 3);

		expect(listener).not.toHaveBeenCalled();
	});
});
