// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ROOM_IDS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import { useSettingsForm } from "@/features/settings";
import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import { useGamePageMobileActionPanelModel } from "./useGamePageMobileActionPanelModel";
import { useGamePageMobileCanvasStageModel } from "./useGamePageMobileCanvasStageModel";
import { useGamePageMobileSheetContentModel } from "./useGamePageMobileSheetContentModel";
import { useGamePageMobileTopBarModel } from "./useGamePageMobileTopBarModel";
import {
	useGamePageAudioContext,
	useGamePageCanvasContext,
	useGamePageHudContext,
	useGamePageLayoutContext,
	useGamePageMobileSheetContext,
	useGamePageTouchContext,
	useGamePageVisualizerContext,
} from "./useGamePageSliceContexts";

vi.mock("./useGamePageSliceContexts", () => ({
	useGamePageAudioContext: vi.fn(),
	useGamePageCanvasContext: vi.fn(),
	useGamePageHudContext: vi.fn(),
	useGamePageLayoutContext: vi.fn(),
	useGamePageMobileSheetContext: vi.fn(),
	useGamePageTouchContext: vi.fn(),
	useGamePageVisualizerContext: vi.fn(),
}));

vi.mock("@/features/settings", () => ({
	useSettingsForm: vi.fn(),
}));

const createGamePageContextSlices = () => ({
	audio: {
		handleAudioMuteToggle: vi.fn(),
		isAudioMuted: false,
	},
	canvas: {
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
	},
	hud: {
		actionButtons: [],
		currentRoomLabel: "Entrance",
		discoveredRoomLabels: ["Entrance"],
		enemiesRemaining: 2,
		hasTreasureKeyLabel: "Missing",
		handleDungeonRunReset: vi.fn(),
		nearInteractableLabel: "—",
		playerHp: 90,
		playerMaxHp: 100,
	},
	layout: {
		isDesktopLayout: false,
		isMobileTabletLandscape: true,
		isTabletLayout: true,
	},
	mobileSheet: {
		handleMobileSheetOpenChange: vi.fn(),
		handleMobileSheetTabChange: vi.fn(),
		isMobileSheetOpen: true,
		mobileSheetTabId: GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
	},
	touch: {
		handleTouchJoystickMove: vi.fn(),
		handleTouchJoystickStop: vi.fn(),
		handleTouchAttack: vi.fn(),
		handleTouchInteract: vi.fn(),
		hasTouchAttack: true,
		hasTouchInteract: true,
		touchAttackPrompt: "Attack",
		touchInteractPrompt: "Open Door",
	},
	visualizer: {
		graphSections: [],
	},
});

const mockGamePageContextSlices = (
	contextSlices: ReturnType<typeof createGamePageContextSlices>,
) => {
	vi.mocked(useGamePageAudioContext).mockReturnValue(contextSlices.audio);
	vi.mocked(useGamePageCanvasContext).mockReturnValue(contextSlices.canvas);
	vi.mocked(useGamePageHudContext).mockReturnValue(contextSlices.hud);
	vi.mocked(useGamePageLayoutContext).mockReturnValue(contextSlices.layout);
	vi.mocked(useGamePageMobileSheetContext).mockReturnValue(
		contextSlices.mobileSheet,
	);
	vi.mocked(useGamePageTouchContext).mockReturnValue(contextSlices.touch);
	vi.mocked(useGamePageVisualizerContext).mockReturnValue(
		contextSlices.visualizer,
	);
};

describe("game page mobile focused models", () => {
	it("builds canvas stage model", () => {
		mockGamePageContextSlices(createGamePageContextSlices());
		vi.mocked(useSettingsForm).mockReturnValue({
			postprocessingEnabled: true,
		} as ReturnType<typeof useSettingsForm>);

		const { result } = renderHook(() => useGamePageMobileCanvasStageModel());

		expect(result.current.canvasMachineRuntime.currentRoomId).toBe(
			ROOM_IDS.ENTRANCE,
		);
		expect(result.current.postprocessingEnabled).toBe(true);
	});

	it("builds top bar model", () => {
		const contextSlices = createGamePageContextSlices();
		mockGamePageContextSlices(contextSlices);

		const { result } = renderHook(() => useGamePageMobileTopBarModel());

		expect(result.current.handleDungeonRunReset).toBe(
			contextSlices.hud.handleDungeonRunReset,
		);
		expect(result.current.playerHp).toBe(90);
		expect(result.current.playerMaxHp).toBe(100);
	});

	it("builds action panel model", () => {
		const contextSlices = createGamePageContextSlices();
		mockGamePageContextSlices(contextSlices);

		const { result } = renderHook(() => useGamePageMobileActionPanelModel());

		expect(result.current.handleTouchAttack).toBe(
			contextSlices.touch.handleTouchAttack,
		);
		expect(result.current.hasTouchInteract).toBe(true);
		expect(result.current.touchInteractPrompt).toBe("Open Door");
	});

	it("builds sheet content model", () => {
		const contextSlices = createGamePageContextSlices();
		mockGamePageContextSlices(contextSlices);

		const { result } = renderHook(() => useGamePageMobileSheetContentModel());

		expect(result.current.mobileSheetTabId).toBe(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		);
		expect(result.current.graphSections).toBe(
			contextSlices.visualizer.graphSections,
		);
		expect(result.current.handleMobileSheetTabChange).toBe(
			contextSlices.mobileSheet.handleMobileSheetTabChange,
		);
	});
});
