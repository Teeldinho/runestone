import type { CSSProperties } from "react";

import { GAME_PAGE_LAYOUT } from "@/pages/game/config";
import { useGamePageDesktopLayoutModel } from "@/pages/game/model";
import { ScrollArea } from "@/shared/ui";
import { CameraModeSwitcher } from "@/widgets/camera-mode-switcher";
import { GameCanvas } from "@/widgets/game-canvas";
import {
	XStateInspectorDetailsPanel,
	XStateInspectorPanel,
} from "@/widgets/xstate-inspector-panel";

import { GamePageHudPanel } from "./GamePageHudPanel";

export function GamePageDesktopWorkspacePanels() {
	const {
		cameraStateSnapshot,
		canvasMachineRuntime,
		graphSections,
		handleCameraModeSwitch,
		isMobileTabletLandscape,
		postprocessingEnabled,
	} = useGamePageDesktopLayoutModel();

	return (
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
				<XStateInspectorPanel sections={graphSections} />
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
							cameraStateSnapshot={cameraStateSnapshot}
							machineRuntime={canvasMachineRuntime}
							postprocessingEnabled={postprocessingEnabled}
						/>
					</div>

					<div className="shrink-0 border-t border-panel-border p-2">
						<CameraModeSwitcher
							activeCameraMode={cameraStateSnapshot.mode}
							handleCameraModeSwitch={handleCameraModeSwitch}
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
					<XStateInspectorDetailsPanel sections={graphSections} />
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
				{isMobileTabletLandscape ? (
					<GamePageHudPanel />
				) : (
					<ScrollArea className="flex-1">
						<GamePageHudPanel />
					</ScrollArea>
				)}
			</aside>
		</div>
	);
}
