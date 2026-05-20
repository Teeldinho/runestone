import { describe, expect, it } from "vitest";
import { createMachine } from "xstate";
import {
	createFloorOneMachine,
	DUNGEON_MACHINE_IDS,
	ROOM_IDS,
	ROOM_LABELS,
} from "@/entities/dungeon";

import {
	STATE_VISUALIZER_NODE_KINDS,
	STATE_VISUALIZER_SECTION_IDS,
} from "../config";

import {
	createMachineGraphNodes,
	resolveMachineGraphNodeKind,
} from "./createMachineGraphSnapshotNodes";

const createNestedFinalStateMachine = () =>
	createMachine({
		id: "test",
		initial: "parent",
		states: {
			parent: {
				initial: "child",
				states: {
					child: {
						type: "final",
					},
					sibling: {},
				},
			},
			other: {},
		},
	});

describe("createMachineGraphSnapshotNodes", () => {
	it("resolves initial, state, and final node kinds", () => {
		const machine = createNestedFinalStateMachine();

		expect(resolveMachineGraphNodeKind(machine, "test")).toBe(
			STATE_VISUALIZER_NODE_KINDS.STATE,
		);
		expect(resolveMachineGraphNodeKind(machine, "test.parent")).toBe(
			STATE_VISUALIZER_NODE_KINDS.INITIAL,
		);
		expect(resolveMachineGraphNodeKind(machine, "test.parent.child")).toBe(
			STATE_VISUALIZER_NODE_KINDS.FINAL,
		);
		expect(resolveMachineGraphNodeKind(machine, "test.parent.sibling")).toBe(
			STATE_VISUALIZER_NODE_KINDS.STATE,
		);
	});

	it("omits wrapper nodes and keeps only leaf states", () => {
		const nodes = createMachineGraphNodes({
			machine: createNestedFinalStateMachine(),
			sectionId: STATE_VISUALIZER_SECTION_IDS.CAMERA,
			activeStateNodeIds: new Set(["test.parent.child"]),
		});

		expect(nodes).toHaveLength(3);
		expect(nodes.map((node) => node.id)).toEqual(
			expect.arrayContaining([
				"test.other",
				"test.parent.child",
				"test.parent.sibling",
			]),
		);
		expect(nodes.map((node) => node.id)).not.toContain("test.parent");
	});

	it("creates nodes with active state metadata and labels", () => {
		const nodes = createMachineGraphNodes({
			machine: createFloorOneMachine(),
			sectionId: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
			activeStateNodeIds: new Set([
				`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.ENTRANCE}`,
			]),
		});

		expect(nodes).toHaveLength(5);

		const entranceNode = nodes.find(
			(node) =>
				node.id === `${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.ENTRANCE}`,
		);
		const exitNode = nodes.find(
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
});
