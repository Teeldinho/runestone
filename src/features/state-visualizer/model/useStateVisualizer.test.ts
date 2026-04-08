// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createMachine } from "xstate";

import {
	type UseStateVisualizerInput,
	useStateVisualizer,
} from "./useStateVisualizer";

const TEST_MACHINES_BY_SECTION_ID: UseStateVisualizerInput["machinesBySectionId"] =
	{
		dungeon: createMachine({
			id: "floorOne",
			initial: "entrance",
			states: {
				entrance: {
					on: {
						ENTER_LIBRARY: "library",
						ENTER_GUARD_ROOM: "guardRoom",
					},
				},
				library: {
					on: {
						ENTER_GUARD_ROOM: "guardRoom",
					},
				},
				guardRoom: {
					on: {
						ENTER_TREASURY: "treasury",
					},
				},
				treasury: {
					on: {
						ENTER_EXIT: "exit",
					},
				},
				exit: {},
			},
		}),
		camera: createMachine({
			id: "camera",
			initial: "freeOrbital",
			states: {
				freeOrbital: {
					on: {
						SET_TOP_DOWN: "topDown",
					},
				},
				topDown: {},
			},
		}),
		audio: createMachine({
			id: "audio",
			initial: "playing",
			states: {
				playing: {
					on: {
						PAUSE: "paused",
					},
				},
				paused: {},
			},
		}),
		player: createMachine({
			id: "player",
			type: "parallel",
			states: {
				health: {
					initial: "alive",
					states: {
						alive: {},
						damaged: {},
					},
				},
				movement: {
					initial: "idle",
					states: {
						idle: {},
						walking: {},
					},
				},
			},
		}),
	};

describe("useStateVisualizer", () => {
	it("returns machine sections with positioned graph data", () => {
		const { result } = renderHook(() =>
			useStateVisualizer({
				machinesBySectionId: TEST_MACHINES_BY_SECTION_ID,
				stateValuesBySectionId: {
					dungeon: "entrance",
					camera: "freeOrbital",
					audio: "playing",
					player: {
						health: "alive",
						movement: "idle",
					},
				},
			}),
		);

		expect(result.current.sections).toHaveLength(4);

		const dungeonSection = result.current.sections.find(
			(section) => section.id === "dungeon",
		);

		expect(dungeonSection).toBeDefined();
		expect(dungeonSection?.positionedNodes).toHaveLength(5);
		expect(dungeonSection?.edges.length).toBeGreaterThan(0);

		const entranceNode = dungeonSection?.positionedNodes.find((node) =>
			node.id.endsWith(".entrance"),
		);

		expect(entranceNode?.isActive).toBe(true);
		expect(entranceNode?.position.x).toEqual(expect.any(Number));
		expect(entranceNode?.position.y).toEqual(expect.any(Number));
	});

	it("updates section active metadata when machine state values change", () => {
		const { result, rerender } = renderHook(
			({ dungeonStateValue }: { dungeonStateValue: string }) =>
				useStateVisualizer({
					machinesBySectionId: TEST_MACHINES_BY_SECTION_ID,
					stateValuesBySectionId: {
						dungeon: dungeonStateValue,
						camera: "topDown",
						audio: "paused",
						player: {
							health: "damaged",
							movement: "walking",
						},
					},
				}),
			{
				initialProps: {
					dungeonStateValue: "entrance",
				} as { dungeonStateValue: string },
			},
		);

		rerender({
			dungeonStateValue: "guardRoom",
		});

		const dungeonSection = result.current.sections.find(
			(section) => section.id === "dungeon",
		);
		const activeNode = dungeonSection?.positionedNodes.find(
			(node) => node.isActive,
		);

		expect(activeNode?.id.endsWith(".guardRoom")).toBe(true);
	});
});
