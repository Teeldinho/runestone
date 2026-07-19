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
		<div className="grid min-h-0 flex-1 grid-cols-1 gap-px overflow-hidden bg-panel-border/70 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(20rem,1.6fr)_minmax(16rem,0.75fr)]">
			<aside
				aria-label="Statechart graph"
				className="order-2 flex min-h-0 min-w-0 flex-col bg-panel/95 lg:order-1"
			>
				<XStateInspectorPanel sections={graphSections} />
			</aside>

			<div className="order-1 flex min-h-0 min-w-0 flex-col overflow-hidden bg-background lg:order-2">
				<section
					aria-labelledby="dungeon-canvas-heading"
					className="relative flex min-h-0 flex-1 flex-col bg-dungeon-fog"
				>
					<div className="flex min-h-10 shrink-0 items-center justify-between gap-3 border-panel-border/60 border-b bg-panel/85 px-3">
						<h2
							id="dungeon-canvas-heading"
							className="rune-text text-panel-title"
						>
							Dungeon viewport
						</h2>
						<span className="font-mono text-[10px] text-dungeon-rune">
							Machine synchronized
						</span>
					</div>

					<div className="min-h-0 flex-1 cursor-grab">
						<GameCanvas
							cameraStateSnapshot={cameraStateSnapshot}
							machineRuntime={canvasMachineRuntime}
							postprocessingEnabled={postprocessingEnabled}
						/>
					</div>

					<div className="shrink-0 border-panel-border/70 border-t bg-panel/90 p-2">
						<CameraModeSwitcher
							activeCameraMode={cameraStateSnapshot.mode}
							handleCameraModeSwitch={handleCameraModeSwitch}
						/>
					</div>
				</section>

				<section
					aria-label="Selected machine details"
					className="h-[35dvh] max-h-[35dvh] shrink-0 border-panel-border/70 border-t bg-panel/95"
				>
					<XStateInspectorDetailsPanel sections={graphSections} />
				</section>
			</div>

			<aside
				aria-label="Game controls and state"
				className="order-3 flex min-h-0 min-w-0 flex-col bg-panel/95"
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
