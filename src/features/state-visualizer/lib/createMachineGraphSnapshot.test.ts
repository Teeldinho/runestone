import { describe, expect, it } from "vitest";
import { ROOM_IDS } from "@/entities/dungeon";

import { createMachineGraphSnapshot } from "./createMachineGraphSnapshot";

describe("createMachineGraphSnapshot", () => {
	it("returns all room nodes with active state metadata", () => {
		const snapshot = createMachineGraphSnapshot(ROOM_IDS.ENTRANCE);

		expect(snapshot.nodes).toHaveLength(5);

		const entranceNode = snapshot.nodes.find(
			(node) => node.id === ROOM_IDS.ENTRANCE,
		);
		const exitNode = snapshot.nodes.find((node) => node.id === ROOM_IDS.EXIT);

		expect(entranceNode).toMatchObject({
			id: ROOM_IDS.ENTRANCE,
			label: "Entrance",
			kind: "initial",
			isActive: true,
		});
		expect(exitNode).toMatchObject({
			id: ROOM_IDS.EXIT,
			label: "Exit",
			kind: "final",
			isActive: false,
		});
	});

	it("includes guarded and unguarded transitions", () => {
		const snapshot = createMachineGraphSnapshot(ROOM_IDS.GUARD_ROOM);

		expect(snapshot.edges).toContainEqual({
			id: `${ROOM_IDS.GUARD_ROOM}:${ROOM_IDS.TREASURY}`,
			source: ROOM_IDS.GUARD_ROOM,
			target: ROOM_IDS.TREASURY,
			guard: "hasKey & enemies=0",
		});
		expect(snapshot.edges).toContainEqual({
			id: `${ROOM_IDS.LIBRARY}:${ROOM_IDS.GUARD_ROOM}`,
			source: ROOM_IDS.LIBRARY,
			target: ROOM_IDS.GUARD_ROOM,
			guard: null,
		});
	});
});
