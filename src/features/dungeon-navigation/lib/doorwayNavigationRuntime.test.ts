import { beforeEach, describe, expect, it, vi } from "vitest";

import { DUNGEON_EVENTS, ROOM_IDS } from "@/entities/dungeon";
import * as sharedModel from "@/shared/model";
import {
	type NearbyInteractable,
	resolveNearInteractableTarget,
} from "./doorwayNavigation";

import {
	createDoorwayNavigationRuntime,
	type DoorwayNavigationContext,
} from "./doorwayNavigationRuntime";

vi.mock("@/shared/model", () => ({
	getPlayerPositionSnapshot: vi.fn(),
	subscribeToPlayerPosition: vi.fn(),
}));

vi.mock("./doorwayNavigation", async (importOriginal) => {
	const actual = await importOriginal<typeof import("./doorwayNavigation")>();
	return {
		...actual,
		resolveNearInteractableTarget: vi.fn(),
	};
});

describe("doorwayNavigationRuntime", () => {
	const mockContext: DoorwayNavigationContext = {
		currentRoomId: ROOM_IDS.ENTRANCE,
		enemiesRemaining: 0,
		hasTreasureKey: false,
	};

	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(sharedModel.getPlayerPositionSnapshot).mockReturnValue([0, 0, 0]);
		vi.mocked(sharedModel.subscribeToPlayerPosition).mockReturnValue(vi.fn());
		vi.mocked(resolveNearInteractableTarget).mockReturnValue(null);
	});

	it("runs initial check and subscribes to player position on mount", () => {
		const sendEvent = vi.fn();
		const runtime = createDoorwayNavigationRuntime(mockContext, sendEvent);

		runtime.subscribe();

		expect(sharedModel.getPlayerPositionSnapshot).toHaveBeenCalledTimes(1);
		expect(sharedModel.subscribeToPlayerPosition).toHaveBeenCalledTimes(1);
	});

	it("dispatches LEFT_INTERACTABLE and NEAR_INTERACTABLE when interactable changes", () => {
		const sendEvent = vi.fn();
		const runtime = createDoorwayNavigationRuntime(
			{ ...mockContext, currentRoomId: ROOM_IDS.ENTRANCE },
			sendEvent,
		);

		// First, start far away (returns null)
		runtime.subscribe();
		expect(sendEvent).not.toHaveBeenCalled();

		// Simulate finding a door
		const handleUpdate = vi.mocked(sharedModel.subscribeToPlayerPosition).mock
			.calls[0][0];

		vi.mocked(resolveNearInteractableTarget).mockReturnValue({
			interactableId: "entrance:north",
			interactableType: "door",
		} as NearbyInteractable);

		handleUpdate();

		expect(sendEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: "entrance:north",
			}),
		);

		sendEvent.mockClear();

		// Move away
		vi.mocked(resolveNearInteractableTarget).mockReturnValue(null);
		handleUpdate();

		expect(sendEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
				interactableId: "entrance:north",
			}),
		);
	});
});
