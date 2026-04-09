import { describe, expect, it } from "vitest";
import {
	createFloorOneMachine,
	DUNGEON_EVENTS,
	DUNGEON_MACHINE_IDS,
	FLOOR_ONE_GUARD_KEYS,
	ROOM_IDS,
	ROOM_LABELS,
} from "@/entities/dungeon";

import {
	STATE_VISUALIZER_GRAPH_SYNTAX,
	STATE_VISUALIZER_NODE_KINDS,
	STATE_VISUALIZER_SECTION_IDS,
} from "../config";

import { createMachineGraphSnapshot } from "./createMachineGraphSnapshot";

describe("createMachineGraphSnapshot", () => {
	it("returns machine nodes with active state metadata", () => {
		const snapshot = createMachineGraphSnapshot({
			machine: createFloorOneMachine(),
			sectionId: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
			activeStateNodeIds: new Set([
				`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.ENTRANCE}`,
			]),
		});

		expect(snapshot.nodes).toHaveLength(5);

		const entranceNode = snapshot.nodes.find(
			(node) =>
				node.id === `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.ENTRANCE}`,
		);
		const exitNode = snapshot.nodes.find(
			(node) => node.id === `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.EXIT}`,
		);

		expect(entranceNode).toMatchObject({
			id: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.ENTRANCE}`,
			label: ROOM_LABELS[ROOM_IDS.ENTRANCE],
			kind: STATE_VISUALIZER_NODE_KINDS.INITIAL,
			isActive: true,
		});
		expect(exitNode).toMatchObject({
			id: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.EXIT}`,
			label: ROOM_LABELS[ROOM_IDS.EXIT],
			kind: STATE_VISUALIZER_NODE_KINDS.STATE,
			isActive: false,
		});
	});

	it("includes transition metadata and derived guard keys", () => {
		const snapshot = createMachineGraphSnapshot({
			machine: createFloorOneMachine(),
			sectionId: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
			activeStateNodeIds: new Set([
				`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.GUARD_ROOM}`,
			]),
		});

		expect(snapshot.edges).toContainEqual(
			expect.objectContaining({
				source: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.GUARD_ROOM}`,
				target: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.TREASURY}`,
				eventType: DUNGEON_EVENTS.ENTER_TREASURY,
			}),
		);

		const enterTreasuryEdge = snapshot.edges.find(
			(edge) => edge.eventType === DUNGEON_EVENTS.ENTER_TREASURY,
		);

		expect(enterTreasuryEdge).toBeDefined();
		expect(enterTreasuryEdge?.guard).not.toBeNull();
		expect(enterTreasuryEdge?.guard).toContain(
			FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
		);
		expect(snapshot.edges).toContainEqual(
			expect.objectContaining({
				source: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.LIBRARY}`,
				target: `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.GUARD_ROOM}`,
				eventType: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
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
		expect(snapshot.guardKeys).not.toContain(
			`${STATE_VISUALIZER_GRAPH_SYNTAX.MACHINE_GUARD_PREFIX}and`,
		);
		expect(snapshot.guardKeys).not.toContain(
			`${STATE_VISUALIZER_GRAPH_SYNTAX.MACHINE_GUARD_PREFIX}or`,
		);
		expect(snapshot.guardKeys).not.toContain(
			`${STATE_VISUALIZER_GRAPH_SYNTAX.MACHINE_GUARD_PREFIX}not`,
		);
	});

	it("expands root-level transitions when machine edges originate at root", () => {
		const snapshot = createMachineGraphSnapshot({
			machine: createFloorOneMachine(),
			sectionId: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
			activeStateNodeIds: new Set([
				`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.ENTRANCE}`,
			]),
		});

		expect(
			snapshot.edges.some(
				(edge) => edge.eventType === DUNGEON_EVENTS.ENTER_LIBRARY,
			),
		).toBe(true);
	});
});
