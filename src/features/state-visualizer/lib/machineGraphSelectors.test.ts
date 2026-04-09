import { describe, expect, it } from "vitest";
import { FLOOR_ONE_GUARD_KEYS, ROOM_IDS } from "@/entities/dungeon";

import { STATE_VISUALIZER_SECTION_IDS } from "../config";

import {
	formatMachineStateLabel,
	formatMachineTokenLabel,
	getMachineGraphGuardLabel,
	getMachineGraphNodeLabel,
	getMachineGraphTransitionEventLabel,
} from "./machineGraphSelectors";

const TEST_AUDIO_STATES = {
	PLAYING: "playing",
} as const;

const TEST_CAMERA_MODES = {
	FREE_ORBITAL: "freeOrbital",
} as const;

describe("getMachineGraphNodeLabel", () => {
	it("uses room labels for the dungeon section", () => {
		expect(
			getMachineGraphNodeLabel(
				STATE_VISUALIZER_SECTION_IDS.DUNGEON,
				ROOM_IDS.GUARD_ROOM,
			),
		).toBe("Guard Room");
		expect(
			getMachineGraphNodeLabel(
				STATE_VISUALIZER_SECTION_IDS.DUNGEON,
				ROOM_IDS.ENTRANCE,
			),
		).toBe("Entrance");
	});

	it("formats non-dungeon labels from machine keys", () => {
		expect(
			getMachineGraphNodeLabel(
				STATE_VISUALIZER_SECTION_IDS.CAMERA,
				TEST_CAMERA_MODES.FREE_ORBITAL,
			),
		).toBe("Free Orbital");
		expect(
			getMachineGraphNodeLabel(
				STATE_VISUALIZER_SECTION_IDS.AUDIO,
				TEST_AUDIO_STATES.PLAYING,
			),
		).toBe("Playing");
	});
});

describe("formatMachineStateLabel", () => {
	it("formats state labels for panel badges", () => {
		expect(formatMachineStateLabel("thirdPerson")).toBe("Third Person");
		expect(formatMachineStateLabel("health.damaged")).toBe("Health Damaged");
	});
});

describe("human-readable graph copy selectors", () => {
	it("formats transition events with readable title case", () => {
		expect(getMachineGraphTransitionEventLabel("ENTER_GUARD_ROOM")).toBe(
			"Enter Guard Room",
		);
	});

	it("maps known guard keys to user-facing requirements", () => {
		expect(
			getMachineGraphGuardLabel(FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED),
		).toBe("The guard has been defeated and the treasure key is in hand");
		expect(getMachineGraphGuardLabel("customGuard")).toBe("Custom Guard");
	});

	it("formats generic machine tokens", () => {
		expect(formatMachineTokenLabel("TOGGLE_MUTE_REQUESTED")).toBe(
			"Toggle Mute Requested",
		);
	});
});
