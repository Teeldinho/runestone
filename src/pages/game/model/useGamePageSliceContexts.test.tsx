// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { ROOM_IDS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";

import {
	createGamePageViewModelStore,
	gamePageViewModelContext,
} from "./gamePageSliceContexts";
import {
	useGamePageAudioContext,
	useGamePageCanvasContext,
	useGamePageHudContext,
	useGamePageLayoutContext,
	useGamePageMobileSheetContext,
	useGamePageTouchContext,
	useGamePageVisualizerContext,
} from "./useGamePageSliceContexts";

const contextSlices = {
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
			enemiesRemaining: 1,
			hasTreasureKey: false,
		},
		handleCameraModeSwitch: vi.fn(),
	},
	hud: {
		actionButtons: [],
		currentRoomLabel: "Entrance",
		discoveredRoomLabels: ["Entrance"],
		enemiesRemaining: 1,
		handleDungeonRunReset: vi.fn(),
		hasTreasureKeyLabel: "Missing",
		nearInteractableLabel: "—",
		playerHp: 100,
		playerMaxHp: 100,
	},
	layout: {
		isDesktopLayout: true,
		isMobileTabletLandscape: false,
		isTabletLayout: false,
	},
	mobileSheet: {
		handleMobileSheetOpenChange: vi.fn(),
		handleMobileSheetTabChange: vi.fn(),
		isMobileSheetOpen: false,
		mobileSheetTabId: GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
	},
	touch: {
		handleTouchJoystickMove: vi.fn(),
		handleTouchJoystickStop: vi.fn(),
		handleTouchAttack: vi.fn(),
		handleTouchInteract: vi.fn(),
		hasTouchAttack: false,
		hasTouchInteract: false,
		touchAttackPrompt: null,
		touchInteractPrompt: null,
	},
	visualizer: {
		graphSections: [],
	},
};

const createWrapper = () => {
	const gamePageViewModelStore = createGamePageViewModelStore(contextSlices);

	return ({ children }: { children: ReactNode }) => (
		<gamePageViewModelContext.Provider value={gamePageViewModelStore}>
			{children}
		</gamePageViewModelContext.Provider>
	);
};

describe("useGamePageSliceContexts", () => {
	it("throws when a slice hook is used outside provider tree", () => {
		expect(() => renderHook(() => useGamePageAudioContext())).toThrowError(
			"useGamePageAudioContext must be used within GamePageViewModelProvider",
		);
	});

	it("returns each focused context slice", () => {
		const wrapper = createWrapper();

		const { result: audioResult } = renderHook(
			() => useGamePageAudioContext(),
			{
				wrapper,
			},
		);
		const { result: canvasResult } = renderHook(
			() => useGamePageCanvasContext(),
			{
				wrapper,
			},
		);
		const { result: hudResult } = renderHook(() => useGamePageHudContext(), {
			wrapper,
		});
		const { result: layoutResult } = renderHook(
			() => useGamePageLayoutContext(),
			{
				wrapper,
			},
		);
		const { result: mobileSheetResult } = renderHook(
			() => useGamePageMobileSheetContext(),
			{ wrapper },
		);
		const { result: touchResult } = renderHook(
			() => useGamePageTouchContext(),
			{
				wrapper,
			},
		);
		const { result: visualizerResult } = renderHook(
			() => useGamePageVisualizerContext(),
			{ wrapper },
		);

		expect(audioResult.current).toBe(contextSlices.audio);
		expect(canvasResult.current).toBe(contextSlices.canvas);
		expect(hudResult.current).toBe(contextSlices.hud);
		expect(layoutResult.current).toBe(contextSlices.layout);
		expect(mobileSheetResult.current).toBe(contextSlices.mobileSheet);
		expect(touchResult.current).toBe(contextSlices.touch);
		expect(visualizerResult.current).toBe(contextSlices.visualizer);
	});
});
