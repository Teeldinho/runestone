import type { CSSProperties, ReactNode } from "react";

import { StateVisualizerWorkspaceProvider } from "@/features/state-visualizer";
import { GAME_PAGE_LAYOUT } from "@/pages/game/config";
import type { GamePageViewModel } from "@/pages/game/model";
import { ScrollArea } from "@/shared/ui";
import { CameraModeSwitcher } from "@/widgets/camera-mode-switcher";
import { GameCanvas } from "@/widgets/game-canvas";
import {
	XStateInspectorDetailsPanel,
	XStateInspectorPanel,
} from "@/widgets/xstate-inspector-panel";

import { GamePageDesktopHeader } from "./GamePageDesktopHeader";

type GamePageDesktopLayoutProps = {
	gameHudContent: ReactNode;
	postprocessingEnabled: boolean;
	viewModel: Pick<
		GamePageViewModel,
		| "cameraStateSnapshot"
		| "canvasMachineRuntime"
		| "currentRoomLabel"
		| "graphSections"
		| "handleAudioMuteToggle"
		| "handleCameraModeSwitch"
		| "isAudioMuted"
		| "isMobileTabletLandscape"
	>;
};

export function GamePageDesktopLayout({
	gameHudContent,
	postprocessingEnabled,
	viewModel,
}: GamePageDesktopLayoutProps) {
	const workspacePanels = (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
			<aside
				aria-label="Statechart graph"
				className="order-2 flex w-full shrink-0 flex-col border-t lg:order-1 lg:w-[var(--game-left-pane-width)] lg:border-r lg:border-t-0"
				style={
					{
						borderColor: "var(--panel-border)",
						background: "var(--panel)",
						"--game-left-pane-width": `${GAME_PAGE_LAYOUT.DESKTOP_LEFT_PANE_WIDTH_REM}rem`,
					} as CSSProperties
				}
			>
				<XStateInspectorPanel sections={viewModel.graphSections} />
			</aside>

			<div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col lg:order-2 lg:overflow-hidden">
				<section
					aria-labelledby="dungeon-canvas-heading"
					className="relative flex min-h-0 flex-1 flex-col"
				>
					<h2 id="dungeon-canvas-heading" className="sr-only">
						Dungeon Canvas
					</h2>

					<div className="min-h-0 flex-1" style={{ cursor: "grab" }}>
						<GameCanvas
							cameraStateSnapshot={viewModel.cameraStateSnapshot}
							machineRuntime={viewModel.canvasMachineRuntime}
							postprocessingEnabled={postprocessingEnabled}
						/>
					</div>

					<div className="shrink-0 border-t border-panel-border p-2">
						<CameraModeSwitcher
							activeCameraMode={viewModel.cameraStateSnapshot.mode}
							handleCameraModeSwitch={viewModel.handleCameraModeSwitch}
						/>
					</div>
				</section>

				<section
					aria-label="Selected machine details"
					className="shrink-0 border-t border-panel-border bg-panel"
					style={{
						height: `${GAME_PAGE_LAYOUT.DETAILS_PANEL_HEIGHT_DVH}dvh`,
						maxHeight: `${GAME_PAGE_LAYOUT.DETAILS_PANEL_HEIGHT_DVH}dvh`,
					}}
				>
					<XStateInspectorDetailsPanel sections={viewModel.graphSections} />
				</section>
			</div>

			<aside
				aria-label="Game controls and state"
				className="order-3 flex w-full shrink-0 flex-col border-t lg:w-[var(--game-right-pane-width)] lg:border-l lg:border-t-0"
				style={
					{
						borderColor: "var(--panel-border)",
						background: "var(--panel)",
						"--game-right-pane-width": `${GAME_PAGE_LAYOUT.DESKTOP_RIGHT_PANE_WIDTH_REM}rem`,
					} as CSSProperties
				}
			>
				{viewModel.isMobileTabletLandscape ? (
					gameHudContent
				) : (
					<ScrollArea className="flex-1">{gameHudContent}</ScrollArea>
				)}
			</aside>
		</div>
	);

	return (
		<main
			id="main-content"
			className="flex h-svh w-dvw flex-col overflow-hidden md:h-dvh"
			style={{ background: "transparent" }}
		>
			<GamePageDesktopHeader
				currentRoomLabel={viewModel.currentRoomLabel}
				handleAudioMuteToggle={viewModel.handleAudioMuteToggle}
				isAudioMuted={viewModel.isAudioMuted}
			/>

			<StateVisualizerWorkspaceProvider>
				{workspacePanels}
			</StateVisualizerWorkspaceProvider>
		</main>
	);
}
