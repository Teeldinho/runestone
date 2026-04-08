import { describe, expect, it } from "vitest";

import {
	formatMachineStateLabel,
	getMachineGraphNodeLabel,
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
		expect(formatMachineStateLabel("health.damaged")).toBe("Health damaged");
	});
});
