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
				className={`order-2 flex w-full shrink-0 flex-col border-t border-panel-border bg-panel lg:order-1 lg:border-r lg:border-t-0 ${GAME_PAGE_LAYOUT.DESKTOP_LEFT_PANE_WIDTH_CLASS_NAME}`}
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

					<div className="min-h-0 flex-1 cursor-grab">
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
					className={`shrink-0 border-t border-panel-border bg-panel ${GAME_PAGE_LAYOUT.DETAILS_PANEL_HEIGHT_CLASS_NAME} ${GAME_PAGE_LAYOUT.DETAILS_PANEL_MAX_HEIGHT_CLASS_NAME}`}
				>
					<XStateInspectorDetailsPanel sections={graphSections} />
				</section>
			</div>

			<aside
				aria-label="Game controls and state"
				className={`order-3 flex w-full shrink-0 flex-col border-t border-panel-border bg-panel lg:border-l lg:border-t-0 ${GAME_PAGE_LAYOUT.DESKTOP_RIGHT_PANE_WIDTH_CLASS_NAME}`}
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
