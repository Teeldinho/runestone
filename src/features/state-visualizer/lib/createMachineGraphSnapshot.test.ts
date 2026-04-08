import { describe, expect, it } from "vitest";
import {
	createFloorOneMachine,
	DUNGEON_MACHINE_IDS,
	FLOOR_ONE_GUARD_KEYS,
} from "@/entities/dungeon";

import { createMachineGraphSnapshot } from "./createMachineGraphSnapshot";

describe("createMachineGraphSnapshot", () => {
	it("returns machine nodes with active state metadata", () => {
		const snapshot = createMachineGraphSnapshot({
			machine: createFloorOneMachine(),
			sectionId: "dungeon",
			activeStateNodeIds: new Set([
				`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.entrance`,
			]),
		});

		expect(snapshot.nodes).toHaveLength(5);

		const entranceNode = snapshot.nodes.find(
			(node) => node.id === `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.entrance`,
		);
		const exitNode = snapshot.nodes.find(
			(node) => node.id === `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.exit`,
		);

		expect(entranceNode).toMatchObject({
			id: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.entrance`,
			label: "Entrance",
			kind: "initial",
			isActive: true,
		});
		expect(exitNode).toMatchObject({
			id: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.exit`,
			label: "Exit",
			kind: "state",
			isActive: false,
		});
	});

	it("includes transition metadata and derived guard keys", () => {
		const snapshot = createMachineGraphSnapshot({
			machine: createFloorOneMachine(),
			sectionId: "dungeon",
			activeStateNodeIds: new Set([
				`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.guardRoom`,
			]),
		});

		expect(snapshot.edges).toContainEqual(
			expect.objectContaining({
				source: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.guardRoom`,
				target: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.treasury`,
				eventType: "ENTER_TREASURY",
			}),
		);

		const enterTreasuryEdge = snapshot.edges.find(
			(edge) => edge.eventType === "ENTER_TREASURY",
		);

		expect(enterTreasuryEdge).toBeDefined();
		expect(enterTreasuryEdge?.guard).not.toBeNull();
		expect(enterTreasuryEdge?.guard).toContain(
			FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
		);
		expect(snapshot.edges).toContainEqual(
			expect.objectContaining({
				source: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.library`,
				target: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.guardRoom`,
				eventType: "ENTER_GUARD_ROOM",
				guard: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
			}),
		);
		expect(snapshot.guardKeys).toEqual(
			expect.arrayContaining([
				FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
				FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
				FLOOR_ONE_GUARD_KEYS.EXIT_CAN_BE_ENTERED,
			]),
		);
		expect(snapshot.guardKeys).not.toContain("xstate.and");
		expect(snapshot.guardKeys).not.toContain("xstate.or");
		expect(snapshot.guardKeys).not.toContain("xstate.not");
	});

	it("expands root-level transitions when machine edges originate at root", () => {
		const snapshot = createMachineGraphSnapshot({
			machine: createFloorOneMachine(),
			sectionId: "dungeon",
			activeStateNodeIds: new Set([
				`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.entrance`,
			]),
		});

		expect(
			snapshot.edges.some((edge) => edge.eventType === "ENTER_LIBRARY"),
		).toBe(true);
	});
});
