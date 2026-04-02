import { describe, expect, it } from "vitest";

import {
	buildDoorKey,
	DOOR_SIDES,
	DUNGEON_INTERACTABLE_IDS,
	ROOM_IDS,
} from "@/entities/dungeon";

import { WORLD_INTERACTION_PROMPT_CONFIG } from "../config";
import {
	getWorldAttackPromptPosition,
	getWorldInteractionPromptPosition,
} from "./getWorldInteractionPromptPosition";

const ROOM_POSITIONS_BY_ID = {
	[ROOM_IDS.GUARD_ROOM]: [0, 0, 20] as [number, number, number],
	[ROOM_IDS.TREASURY]: [0, 0, 40] as [number, number, number],
} as const;

describe("getWorldInteractionPromptPosition", () => {
	it("anchors a guarded door prompt to the relevant doorway", () => {
		expect(
			getWorldInteractionPromptPosition(
				buildDoorKey(ROOM_IDS.GUARD_ROOM, DOOR_SIDES.SOUTH),
				ROOM_POSITIONS_BY_ID,
			),
		).toEqual([0, WORLD_INTERACTION_PROMPT_CONFIG.DOOR_HEIGHT, 26]);
	});

	it("anchors the key prompt to the treasure key position", () => {
		expect(
			getWorldInteractionPromptPosition(
				DUNGEON_INTERACTABLE_IDS.TREASURE_KEY,
				ROOM_POSITIONS_BY_ID,
			),
		).toEqual([0, WORLD_INTERACTION_PROMPT_CONFIG.KEY_HEIGHT, 20]);
	});
});

describe("getWorldAttackPromptPosition", () => {
	it("places the attack prompt above the enemy position", () => {
		expect(getWorldAttackPromptPosition([2, 1, 3])).toEqual([
			2,
			1 + WORLD_INTERACTION_PROMPT_CONFIG.ENEMY_HEIGHT_OFFSET,
			3,
		]);
	});
});
