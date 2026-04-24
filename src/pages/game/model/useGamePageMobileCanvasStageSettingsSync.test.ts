// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ROOM_IDS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import { useSettingsForm } from "@/features/settings";

import { useGamePageMobileCanvasStageModel } from "./useGamePageMobileCanvasStageModel";
import { useGamePageCanvasContext } from "./useGamePageSliceContexts";

vi.mock("./useGamePageSliceContexts", () => ({
	useGamePageCanvasContext: vi.fn(),
}));

const mockCanvasContext = {
	cameraStateSnapshot: {
		fov: 58,
		mode: CAMERA_MODES.FREE_ORBITAL,
		position: [0, 8, 10] as [number, number, number],
		target: [0, 0, 0] as [number, number, number],
		zoom: 1,
	},
	canvasMachineRuntime: {
		currentRoomId: ROOM_IDS.ENTRANCE,
		enemiesRemaining: 2,
		hasTreasureKey: false,
	},
	handleCameraModeSwitch: vi.fn(),
};

type MemoryStorage = Pick<
	Storage,
	"clear" | "getItem" | "removeItem" | "setItem"
>;

const createMemoryStorage = (): MemoryStorage => {
	const values = new Map<string, string>();

	return {
		clear: () => {
			values.clear();
		},
		getItem: (key) => values.get(key) ?? null,
		removeItem: (key) => {
			values.delete(key);
		},
		setItem: (key, value) => {
			values.set(key, value);
		},
	};
};

describe("useGamePageMobileCanvasStageModel settings sync", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	beforeEach(() => {
		vi.stubGlobal("localStorage", createMemoryStorage());
		vi.clearAllMocks();

		vi.mocked(useGamePageCanvasContext).mockReturnValue(mockCanvasContext);
	});

	it("reflects graphics settings changes live", () => {
		const settings = renderHook(() => useSettingsForm());
		act(() => {
			settings.result.current.handleSettingsReset();
		});
		const stage = renderHook(() => useGamePageMobileCanvasStageModel());

		expect(stage.result.current.postprocessingEnabled).toBe(true);

		act(() => {
			settings.result.current.handlePostprocessingToggle(false);
		});

		expect(stage.result.current.postprocessingEnabled).toBe(false);

		act(() => {
			settings.result.current.handleSettingsReset();
		});

		expect(stage.result.current.postprocessingEnabled).toBe(true);
	});
});
