import { describe, expect, it } from "vitest";
import { FLOOR_ONE_GUARD_KEYS } from "@/entities/dungeon";

import {
	formatMachineStateLabel,
	formatMachineTokenLabel,
	getMachineGraphGuardLabel,
	getMachineGraphNodeLabel,
	getMachineGraphTransitionEventLabel,
} from "./machineGraphSelectors";

describe("getMachineGraphNodeLabel", () => {
	it("uses room labels for the dungeon section", () => {
		expect(getMachineGraphNodeLabel("dungeon", "guardRoom")).toBe("Guard Room");
		expect(getMachineGraphNodeLabel("dungeon", "entrance")).toBe("Entrance");
	});

	it("formats non-dungeon labels from machine keys", () => {
		expect(getMachineGraphNodeLabel("camera", "freeOrbital")).toBe(
			"Free Orbital",
		);
		expect(getMachineGraphNodeLabel("audio", "playing")).toBe("Playing");
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
