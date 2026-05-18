// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	PLAYER_RUNNING_INDICATOR_CLASS_NAMES,
	PLAYER_RUNNING_INDICATOR_COPY,
	PLAYER_STATES,
} from "@/entities/player";
import { CAMERA_MODES } from "@/features/camera-system";

const mockUseResponsiveLayout = vi.fn();
const mockUsePlayerMachineRuntime = vi.fn();

vi.mock("@/shared/lib", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/shared/lib")>();

	return {
		...actual,
		useResponsiveLayout: () => mockUseResponsiveLayout(),
	};
});

vi.mock("@/entities/player", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/player")>();

	return {
		...actual,
		PlayerRunningIndicator: () => (
			<div className={PLAYER_RUNNING_INDICATOR_CLASS_NAMES.ROOT}>
				<span className={PLAYER_RUNNING_INDICATOR_CLASS_NAMES.BADGE}>
					<svg aria-hidden="true" />
					<span>{PLAYER_RUNNING_INDICATOR_COPY.LABEL}</span>
				</span>
			</div>
		),
		usePlayerDamageFlash: () => false,
		usePlayerMachineRuntime: () => mockUsePlayerMachineRuntime(),
	};
});

import { GameCanvasOverlays } from "./GameCanvasOverlays";

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

describe("GameCanvasOverlays", () => {
	it("renders the running badge in the canvas corner on desktop", () => {
		mockUseResponsiveLayout.mockReturnValue({
			isDesktopLayout: true,
			isMobileLayout: false,
			isTabletLayout: false,
			isLandscape: true,
			isPortrait: false,
		});
		mockUsePlayerMachineRuntime.mockReturnValue({
			snapshot: {
				value: {
					[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.RUNNING,
					[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.ALIVE,
				},
				context: {
					stats: {
						hp: 100,
						maxHp: 100,
						score: 0,
						keyCount: 0,
						chainMultiplier: 1,
					},
				},
			},
			sendPlayerMachineEvent: vi.fn(),
			playerActorRef: {
				send: vi.fn(),
				getSnapshot: vi.fn(),
				sessionId: "mock",
				id: "mock",
			},
		});

		const { container } = render(
			<GameCanvasOverlays
				activeAchievement={null}
				cameraMode={CAMERA_MODES.THIRD_PERSON}
				handleGameRestart={vi.fn()}
				isGameOver={false}
			/>,
		);

		const runningLabel = screen.getByText(PLAYER_RUNNING_INDICATOR_COPY.LABEL);
		const runningRoot = runningLabel.closest("div") as HTMLElement;

		expect(runningLabel).toBeTruthy();
		expect(runningRoot.className).toContain("absolute");
		expect(runningRoot.className).toContain("right-4");
		expect(runningRoot.className).toContain("bottom-4");
		expect(container.querySelector("svg")).toBeTruthy();
	});
});
