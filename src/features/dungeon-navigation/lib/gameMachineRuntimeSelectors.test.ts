import {
	buildDoorKey,
	createFloorOneContext,
	DOOR_SIDES,
	INTERACTION_TYPES,
	ROOM_IDS,
} from "@/entities/dungeon";
import { describe, expect, it } from "vitest";

import {
	selectAchievementTrackingContext,
	selectActiveStateLabel,
	selectCurrentRoomId,
	selectDiscoveredRooms,
	selectDoorwayNavigationContext,
	selectEnemiesRemaining,
	selectGameMachineSnapshot,
	selectHasTreasureKey,
	selectInteractionCandidatesContext,
	selectLastDoorwayFeedback,
	selectLastTransition,
	selectNavigationActionContext,
	selectNearInteractable,
} from "./gameMachineRuntimeSelectors";

const GAME_MACHINE_SNAPSHOT = {
	value: ROOM_IDS.LIBRARY,
	context: createFloorOneContext({
		currentRoomId: ROOM_IDS.LIBRARY,
		discoveredRooms: [ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY],
		enemiesRemaining: 2,
		hasTreasureKey: true,
		lastDoorwayFeedback: "LOCKED_DOOR_ATTEMPT",
		lastTransition: {
			fromRoom: ROOM_IDS.ENTRANCE,
			toRoom: ROOM_IDS.LIBRARY,
			doorSide: DOOR_SIDES.SOUTH,
		},
		nearInteractable: buildDoorKey(ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH),
		nearInteractableType: INTERACTION_TYPES.DOOR,
	}),
};

describe("gameMachineRuntimeSelectors", () => {
	it("returns the original snapshot and active state label", () => {
		expect(selectGameMachineSnapshot(GAME_MACHINE_SNAPSHOT)).toBe(
			GAME_MACHINE_SNAPSHOT,
		);
		expect(selectActiveStateLabel(GAME_MACHINE_SNAPSHOT)).toBe(
			ROOM_IDS.LIBRARY,
		);
	});

	it("projects scalar selectors from the snapshot context", () => {
		expect(selectCurrentRoomId(GAME_MACHINE_SNAPSHOT)).toBe(ROOM_IDS.LIBRARY);
		expect(selectDiscoveredRooms(GAME_MACHINE_SNAPSHOT)).toEqual([
			ROOM_IDS.ENTRANCE,
			ROOM_IDS.LIBRARY,
		]);
		expect(selectEnemiesRemaining(GAME_MACHINE_SNAPSHOT)).toBe(2);
		expect(selectHasTreasureKey(GAME_MACHINE_SNAPSHOT)).toBe(true);
		expect(selectLastDoorwayFeedback(GAME_MACHINE_SNAPSHOT)).toBe(
			"LOCKED_DOOR_ATTEMPT",
		);
		expect(selectLastTransition(GAME_MACHINE_SNAPSHOT)).toEqual({
			fromRoom: ROOM_IDS.ENTRANCE,
			toRoom: ROOM_IDS.LIBRARY,
			doorSide: DOOR_SIDES.SOUTH,
		});
		expect(selectNearInteractable(GAME_MACHINE_SNAPSHOT)).toBe(
			buildDoorKey(ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH),
		);
	});

	it("projects grouped runtime contexts for downstream consumers", () => {
		expect(selectNavigationActionContext(GAME_MACHINE_SNAPSHOT)).toEqual({
			currentRoomId: ROOM_IDS.LIBRARY,
			enemiesRemaining: 2,
			hasTreasureKey: true,
			nearInteractable: buildDoorKey(ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH),
		});
		expect(selectDoorwayNavigationContext(GAME_MACHINE_SNAPSHOT)).toEqual({
			currentRoomId: ROOM_IDS.LIBRARY,
			enemiesRemaining: 2,
			hasTreasureKey: true,
		});
		expect(selectInteractionCandidatesContext(GAME_MACHINE_SNAPSHOT)).toEqual({
			currentRoomId: ROOM_IDS.LIBRARY,
			enemiesRemaining: 2,
			hasTreasureKey: true,
			nearInteractable: buildDoorKey(ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH),
		});
		expect(selectAchievementTrackingContext(GAME_MACHINE_SNAPSHOT)).toEqual({
			discoveredRooms: [ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY],
			enemiesRemaining: 2,
			hasTreasureKey: true,
		});
	});
});
