import { describe, expect, it } from "vitest";
import { createMachine } from "xstate";
import {
	createFloorOneMachine,
	DUNGEON_EVENTS,
	DUNGEON_MACHINE_IDS,
	FLOOR_ONE_GUARD_KEYS,
	ROOM_IDS,
} from "@/entities/dungeon";

import { STATE_VISUALIZER_GRAPH_SYNTAX } from "../config";

import {
	collectMachineGraphGuardKeys,
	createMachineGraphEdges,
	normalizeMachineGraphTransitions,
	resolveMachineGraphEdgeGuardLabel,
	resolveMachineGraphTargetNodeId,
} from "./createMachineGraphSnapshotEdges";

const createEdgeGuardMachine = () =>
	createMachine({
		id: "test",
		initial: "idle",
		states: {
			idle: {
				on: {
					GO: {
						target: "idle",
						guard: {
							type: "canGo",
						},
					},
				},
			},
		},
	});

describe("createMachineGraphSnapshotEdges", () => {
	it("normalizes string, array, object, and empty transitions", () => {
		expect(normalizeMachineGraphTransitions("target")).toEqual([
			{ target: "target" },
		]);
		expect(
			normalizeMachineGraphTransitions(["first", { target: "second" }, null]),
		).toEqual([{ target: "second" }]);
		expect(normalizeMachineGraphTransitions({ target: "third" })).toEqual([
			{ target: "third" },
		]);
		expect(normalizeMachineGraphTransitions(undefined)).toEqual([]);
	});

	it("resolves relative and absolute target node ids", () => {
		const machine = createFloorOneMachine();

		expect(
			resolveMachineGraphTargetNodeId(
				machine,
				`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.LIBRARY}`,
				".guard_room",
			),
		).toBe(`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.guard_room`);
		expect(
			resolveMachineGraphTargetNodeId(
				machine,
				`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.LIBRARY}`,
				`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.GUARD_ROOM}`,
			),
		).toBe(`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.GUARD_ROOM}`);
		expect(
			resolveMachineGraphTargetNodeId(
				machine,
				`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.LIBRARY}`,
				`#${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.GUARD_ROOM}`,
			),
		).toBe(`${DUNGEON_MACHINE_IDS.FLOOR_ONE}.${ROOM_IDS.GUARD_ROOM}`);
	});

	it("collects unique guard keys and ignores machine guard prefixes", () => {
		expect(
			collectMachineGraphGuardKeys({
				type: `${STATE_VISUALIZER_GRAPH_SYNTAX.MACHINE_GUARD_PREFIX}and`,
				guards: [
					{
						type: "firstGuard",
					},
					{
						guard: {
							type: "secondGuard",
						},
					},
					{
						type: `${STATE_VISUALIZER_GRAPH_SYNTAX.MACHINE_GUARD_PREFIX}or`,
						guards: [
							{
								type: "firstGuard",
							},
						],
					},
				],
			}),
		).toEqual(["firstGuard", "secondGuard"]);
	});

	it("resolves edge guards and assembles floor-one edges", () => {
		const { edges, guardKeys } = createMachineGraphEdges({
			machine: createFloorOneMachine(),
		});

		expect(edges).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					eventType: DUNGEON_EVENTS.ENTER_LIBRARY,
				}),
				expect.objectContaining({
					eventType: DUNGEON_EVENTS.ENTER_TREASURY,
					guard: expect.stringContaining(
						FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
					),
				}),
			]),
		);
		expect(guardKeys).toEqual(
			expect.arrayContaining([
				FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
				FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
				FLOOR_ONE_GUARD_KEYS.EXIT_CAN_BE_ENTERED,
			]),
		);
		expect(guardKeys).not.toContain(
			`${STATE_VISUALIZER_GRAPH_SYNTAX.MACHINE_GUARD_PREFIX}and`,
		);
		expect(guardKeys).not.toContain(
			`${STATE_VISUALIZER_GRAPH_SYNTAX.MACHINE_GUARD_PREFIX}or`,
		);
		expect(guardKeys).not.toContain(
			`${STATE_VISUALIZER_GRAPH_SYNTAX.MACHINE_GUARD_PREFIX}not`,
		);
	});

	it("uses machine config guards when edge guards are absent", () => {
		const guard = resolveMachineGraphEdgeGuardLabel({
			machine: createEdgeGuardMachine(),
			edge: {
				source: { id: "test.idle" },
				target: { id: "test.idle" },
				label: { text: "GO" },
				transition: {
					eventType: "GO",
				},
			},
		});

		expect(guard).toBe("canGo");
	});
});
