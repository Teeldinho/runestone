// @vitest-environment happy-dom

import { cleanup, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import {
	DUNGEON_EVENTS,
	FLOOR_ONE_GUARD_KEYS,
	ROOM_IDS,
	ROOM_LABELS,
} from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import {
	formatMachineStateLabel,
	getMachineGraphGuardLabel,
	getMachineGraphTransitionEventLabel,
	type MachineGraphSection,
	STATE_VISUALIZER_DETAILS_COPY,
	STATE_VISUALIZER_GRAPH_SYNTAX,
	STATE_VISUALIZER_NODE_KINDS,
	STATE_VISUALIZER_SECTION_IDS,
	StateVisualizerWorkspaceProvider,
} from "@/features/state-visualizer";

import { INSPECTOR_COPY } from "../config";

import { XStateInspectorDetailsPanel } from "./XStateInspectorDetailsPanel";

const TEST_GRAPH_POSITIONS = {
	ENTRANCE: { x: 80, y: 120 },
	GUARD_ROOM: { x: 420, y: 120 },
} as const;

const TEST_EDGE_ID = `${ROOM_IDS.ENTRANCE}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_ID_SEGMENT_SEPARATOR}${ROOM_IDS.GUARD_ROOM}`;

const GRAPH_NODES = [
	{
		id: ROOM_IDS.ENTRANCE,
		isActive: true,
		kind: STATE_VISUALIZER_NODE_KINDS.INITIAL,
		label: ROOM_LABELS[ROOM_IDS.ENTRANCE],
		position: TEST_GRAPH_POSITIONS.ENTRANCE,
	},
	{
		id: ROOM_IDS.GUARD_ROOM,
		isActive: false,
		kind: STATE_VISUALIZER_NODE_KINDS.STATE,
		label: ROOM_LABELS[ROOM_IDS.GUARD_ROOM],
		position: TEST_GRAPH_POSITIONS.GUARD_ROOM,
	},
];

const GRAPH_EDGES = [
	{
		eventType: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
		guard: FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
		id: TEST_EDGE_ID,
		source: ROOM_IDS.ENTRANCE,
		target: ROOM_IDS.GUARD_ROOM,
	},
];

const TEST_SECTION_LABELS = {
	DUNGEON: "Dungeon",
	CAMERA: "Camera",
} as const;

const SECTIONS: MachineGraphSection[] = [
	{
		id: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		label: TEST_SECTION_LABELS.DUNGEON,
		activeStateLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
		guardKeys: [FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED],
		nodes: GRAPH_NODES,
		edges: GRAPH_EDGES,
		positionedNodes: GRAPH_NODES,
	},
	{
		id: STATE_VISUALIZER_SECTION_IDS.CAMERA,
		label: TEST_SECTION_LABELS.CAMERA,
		activeStateLabel: formatMachineStateLabel(CAMERA_MODES.FREE_ORBITAL),
		guardKeys: [],
		nodes: [],
		edges: [],
		positionedNodes: [],
	},
];

const renderDetailsPanel = (sections: MachineGraphSection[]) => {
	const wrapper = ({ children }: { children: ReactNode }) => (
		<StateVisualizerWorkspaceProvider>
			{children}
		</StateVisualizerWorkspaceProvider>
	);

	return render(<XStateInspectorDetailsPanel sections={sections} />, {
		wrapper,
	});
};

afterEach(cleanup);

describe("XStateInspectorDetailsPanel", () => {
	it("renders labeled regions for the selected section", () => {
		renderDetailsPanel(SECTIONS);

		const rootRegion = screen.getByRole("region", {
			name: INSPECTOR_COPY.DETAILS_PANEL_TITLE,
		});
		const details = within(rootRegion);

		expect(details.getByText(TEST_SECTION_LABELS.DUNGEON)).toBeTruthy();
		expect(
			details.getByRole("region", {
				name: STATE_VISUALIZER_DETAILS_COPY.ACTIVE_STATE_LABEL,
			}),
		).toBeTruthy();
		expect(
			details.getByRole("region", {
				name: INSPECTOR_COPY.STATES_IN_MACHINE_LABEL,
			}),
		).toBeTruthy();
		expect(
			details.getByRole("region", {
				name: STATE_VISUALIZER_DETAILS_COPY.GUARDS_LABEL,
			}),
		).toBeTruthy();
		expect(
			details.getByRole("region", {
				name: STATE_VISUALIZER_DETAILS_COPY.TRANSITIONS_LABEL,
			}),
		).toBeTruthy();

		expect(
			details.getByText(
				`Current machine mode: ${ROOM_LABELS[ROOM_IDS.ENTRANCE]}`,
			),
		).toBeTruthy();
		expect(
			details.getByText(
				getMachineGraphGuardLabel(FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED),
			),
		).toBeTruthy();
		expect(
			details.getByText(
				getMachineGraphTransitionEventLabel(DUNGEON_EVENTS.ENTER_GUARD_ROOM),
			),
		).toBeTruthy();
	});

	it("shows the fallback message when no section is selected", () => {
		renderDetailsPanel([]);

		const rootRegion = screen.getByRole("region", {
			name: INSPECTOR_COPY.DETAILS_PANEL_TITLE,
		});
		const details = within(rootRegion);

		expect(
			details.getByText(STATE_VISUALIZER_DETAILS_COPY.ACTIVE_STATE_FALLBACK),
		).toBeTruthy();
		expect(
			details.queryByRole("region", {
				name: STATE_VISUALIZER_DETAILS_COPY.ACTIVE_STATE_LABEL,
			}),
		).toBeNull();
		expect(
			details.queryByRole("region", {
				name: INSPECTOR_COPY.STATES_IN_MACHINE_LABEL,
			}),
		).toBeNull();
		expect(
			details.queryByRole("region", {
				name: STATE_VISUALIZER_DETAILS_COPY.GUARDS_LABEL,
			}),
		).toBeNull();
		expect(
			details.queryByRole("region", {
				name: STATE_VISUALIZER_DETAILS_COPY.TRANSITIONS_LABEL,
			}),
		).toBeNull();
	});
});
