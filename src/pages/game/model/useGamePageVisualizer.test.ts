// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
	STATE_VISUALIZER_SECTION_IDS,
	useStateVisualizer,
} from "@/features/state-visualizer";

import { useGamePageVisualizer } from "./useGamePageVisualizer";

const {
	MOCK_STATE_VISUALIZER_SECTION_IDS,
	MOCK_AUDIO_MACHINE,
	MOCK_GAME_MACHINE,
	MOCK_CAMERA_MACHINE,
	MOCK_INPUT_MACHINE,
	MOCK_PLAYER_MACHINE,
	MOCK_SECTIONS,
} = vi.hoisted(() => ({
	MOCK_STATE_VISUALIZER_SECTION_IDS: {
		DUNGEON: "dungeon",
		CAMERA: "camera",
		AUDIO: "audio",
		INPUT: "input",
		PLAYER: "player",
	} as const,
	MOCK_AUDIO_MACHINE: { id: "audio" },
	MOCK_GAME_MACHINE: { id: "game" },
	MOCK_CAMERA_MACHINE: { id: "camera" },
	MOCK_INPUT_MACHINE: { id: "input" },
	MOCK_PLAYER_MACHINE: { id: "player" },
	MOCK_SECTIONS: [{ id: "dungeon", label: "Dungeon" }],
}));

vi.mock("@/features/camera-system", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/features/camera-system")>();

	return {
		...actual,
		createCameraMachine: vi.fn(() => MOCK_CAMERA_MACHINE),
	};
});

vi.mock("@/features/dungeon-navigation", () => ({
	createGameMachine: vi.fn(() => MOCK_GAME_MACHINE),
}));

vi.mock("@/features/audio-manager", () => ({
	audioMachine: MOCK_AUDIO_MACHINE,
}));

vi.mock("@/features/input-orchestrator", () => ({
	inputOrchestratorMachine: MOCK_INPUT_MACHINE,
}));

vi.mock("@/entities/player", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/player")>();

	return {
		...actual,
		createPlayerMachine: vi.fn(() => MOCK_PLAYER_MACHINE),
	};
});

vi.mock("@/features/state-visualizer", () => ({
	STATE_VISUALIZER_SECTION_IDS: MOCK_STATE_VISUALIZER_SECTION_IDS,
	useStateVisualizer: vi.fn(() => ({ sections: MOCK_SECTIONS })),
}));

describe("useGamePageVisualizer", () => {
	it("maps machine instances and state values for visualizer sections", () => {
		const { result } = renderHook(() =>
			useGamePageVisualizer({
				audioState: "playing",
				cameraMode: "topDown",
				currentRoomId: "entrance",
				inputStateValue: { ready: { runToggleRegion: "runToggleOff" } },
				playerStateValue: { health: "alive" },
			}),
		);

		expect(vi.mocked(useStateVisualizer)).toHaveBeenCalledWith({
			machinesBySectionId: {
				[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: MOCK_GAME_MACHINE,
				[STATE_VISUALIZER_SECTION_IDS.CAMERA]: MOCK_CAMERA_MACHINE,
				[STATE_VISUALIZER_SECTION_IDS.AUDIO]: MOCK_AUDIO_MACHINE,
				[STATE_VISUALIZER_SECTION_IDS.INPUT]: MOCK_INPUT_MACHINE,
				[STATE_VISUALIZER_SECTION_IDS.PLAYER]: MOCK_PLAYER_MACHINE,
			},
			stateValuesBySectionId: {
				[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: "entrance",
				[STATE_VISUALIZER_SECTION_IDS.CAMERA]: "topDown",
				[STATE_VISUALIZER_SECTION_IDS.AUDIO]: "playing",
				[STATE_VISUALIZER_SECTION_IDS.INPUT]: {
					ready: { runToggleRegion: "runToggleOff" },
				},
				[STATE_VISUALIZER_SECTION_IDS.PLAYER]: { health: "alive" },
			},
		});

		expect(result.current.graphSections).toEqual(MOCK_SECTIONS);
	});
});
