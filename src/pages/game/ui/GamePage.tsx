import { useSettingsForm } from "@/features/settings";
import { useGamePage } from "@/pages/game/model";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";
import { CameraModeSwitcher } from "@/widgets/camera-mode-switcher";
import { GameCanvas } from "@/widgets/game-canvas";
import { GameHud } from "@/widgets/hud";
import { XStateInspectorPanel } from "@/widgets/xstate-inspector-panel";

export function GamePage() {
	const {
		actionButtons,
		activeStateLabel,
		cameraStateSnapshot,
		canvasMachineRuntime,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		graphEdges,
		graphNodes,
		handleCameraModeSwitch,
		hasTreasureKeyLabel,
		handleDungeonRunReset,
	} = useGamePage();
	const settings = useSettingsForm();

	return (
		<main
			id="main-content"
			className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center p-8"
		>
			<Card className="w-full border-panel-border bg-panel shadow-xl backdrop-blur">
				<CardHeader className="space-y-2 text-left">
					<CardTitle className="text-3xl font-semibold text-panel-title">
						Game Arena
					</CardTitle>
					<CardDescription className="text-base text-panel-body">
						Navigate the dungeon machine and inspect live room transitions.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					<section aria-labelledby="dungeon-canvas-heading">
						<h2 id="dungeon-canvas-heading" className="sr-only">
							Dungeon Canvas
						</h2>
						<GameCanvas
							cameraStateSnapshot={cameraStateSnapshot}
							machineRuntime={canvasMachineRuntime}
							postprocessingEnabled={settings.postprocessingEnabled}
						/>
					</section>

					<section aria-labelledby="machine-snapshot-heading">
						<GameHud
							actionButtons={actionButtons}
							activeStateLabel={activeStateLabel}
							currentRoomLabel={currentRoomLabel}
							discoveredRoomLabels={discoveredRoomLabels}
							enemiesRemaining={enemiesRemaining}
							handleDungeonRunReset={handleDungeonRunReset}
							hasTreasureKeyLabel={hasTreasureKeyLabel}
						/>
					</section>

					<section aria-labelledby="camera-mode-switcher-heading">
						<CameraModeSwitcher
							activeCameraMode={cameraStateSnapshot.mode}
							handleCameraModeSwitch={handleCameraModeSwitch}
						/>
					</section>

					<section aria-labelledby="xstate-inspector-heading">
						<XStateInspectorPanel
							activeStateLabel={activeStateLabel}
							graphNodes={graphNodes}
							graphEdges={graphEdges}
						/>
					</section>
				</CardContent>
			</Card>
		</main>
	);
}
