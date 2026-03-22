import { describe, expect, it } from "vitest";

import {
	getMachineGraphNodeKind,
	getMachineGraphRoomLabel,
} from "./machineGraphSelectors";

describe("getMachineGraphNodeKind", () => {
	it("returns initial for the entrance room", () => {
		expect(getMachineGraphNodeKind("entrance")).toBe("initial");
	});

	it("returns final for the exit room", () => {
		expect(getMachineGraphNodeKind("exit")).toBe("final");
	});

	it("returns state for a non-extreme room", () => {
		expect(getMachineGraphNodeKind("library")).toBe("state");
	});
});

describe("getMachineGraphRoomLabel", () => {
	it("looks up the human-readable label for a room", () => {
		expect(getMachineGraphRoomLabel("guardRoom")).toBe("Guard Room");
		expect(getMachineGraphRoomLabel("entrance")).toBe("Entrance");
	});
});
