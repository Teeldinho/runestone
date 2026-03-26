import { describe, expect, it, vi } from "vitest";

import {
	getPlayerPosition,
	setPlayerPosition,
	subscribeToPlayerPosition,
} from "./playerPositionStore";

describe("playerPositionStore", () => {
	it("notifies subscribers when player position changes", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToPlayerPosition(listener);

		setPlayerPosition(3, 1, -4);

		expect(listener).toHaveBeenCalledTimes(1);
		expect(getPlayerPosition()).toEqual([3, 1, -4]);

		unsubscribe();
	});

	it("stops notifications after unsubscribe", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToPlayerPosition(listener);

		unsubscribe();
		setPlayerPosition(1, 2, 3);

		expect(listener).not.toHaveBeenCalled();
	});
});
