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
import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

vi.mock("./useGamePageViewModelContext", () => ({
	useGamePageViewModelContext: vi.fn(),
}));

vi.mock("@/features/settings", () => ({
	useSettingsForm: vi.fn(),
}));

const createGamePageViewModel = () => ({
	actionButtons: [],
	activeStateLabel: ROOM_IDS.ENTRANCE,
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
	currentRoomLabel: "Entrance",
	discoveredRoomLabels: ["Entrance"],
	enemiesRemaining: 2,
	graphSections: [],
	handleAudioMuteToggle: vi.fn(),
	handleCameraModeSwitch: vi.fn(),
	hasTreasureKeyLabel: "Missing",
	handleDungeonRunReset: vi.fn(),
	handleMobileSheetOpenChange: vi.fn(),
	handleMobileSheetTabChange: vi.fn(),
	handleTouchJoystickMove: vi.fn(),
	handleTouchJoystickStop: vi.fn(),
	handleTouchAttack: vi.fn(),
	handleTouchInteract: vi.fn(),
	hasTouchAttack: true,
	hasTouchInteract: true,
	isAudioMuted: false,
	isDesktopLayout: false,
	isMobileSheetOpen: true,
	isMobileTabletLandscape: true,
	isTabletLayout: true,
	mobileSheetTabId: GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
	playerHp: 90,
	playerMaxHp: 100,
	touchAttackPrompt: "Attack",
	touchInteractPrompt: "Open Door",
});

describe("game page mobile focused models", () => {
	it("builds canvas stage model", () => {
		vi.mocked(useGamePageViewModelContext).mockReturnValue(
			createGamePageViewModel(),
		);
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
		const viewModel = createGamePageViewModel();
		vi.mocked(useGamePageViewModelContext).mockReturnValue(viewModel);

		const { result } = renderHook(() => useGamePageMobileTopBarModel());

		expect(result.current.handleDungeonRunReset).toBe(
			viewModel.handleDungeonRunReset,
		);
		expect(result.current.playerHp).toBe(90);
		expect(result.current.playerMaxHp).toBe(100);
	});

	it("builds action panel model", () => {
		const viewModel = createGamePageViewModel();
		vi.mocked(useGamePageViewModelContext).mockReturnValue(viewModel);

		const { result } = renderHook(() => useGamePageMobileActionPanelModel());

		expect(result.current.handleTouchAttack).toBe(viewModel.handleTouchAttack);
		expect(result.current.hasTouchInteract).toBe(true);
		expect(result.current.touchInteractPrompt).toBe("Open Door");
	});

	it("builds sheet content model", () => {
		const viewModel = createGamePageViewModel();
		vi.mocked(useGamePageViewModelContext).mockReturnValue(viewModel);

		const { result } = renderHook(() => useGamePageMobileSheetContentModel());

		expect(result.current.mobileSheetTabId).toBe(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		);
		expect(result.current.graphSections).toBe(viewModel.graphSections);
		expect(result.current.handleMobileSheetTabChange).toBe(
			viewModel.handleMobileSheetTabChange,
		);
	});
});
