import { MobileActionButtonZone } from "@/features/input-orchestrator";
import { CameraControlZone, TouchJoystickZone } from "@/features/touch-input";
import {
	useGamePageCameraElements,
	useGamePageInputContext,
	useGamePageMobileCanvasStageModel,
} from "@/pages/game/model";
import { GameCanvas } from "@/widgets/game-canvas";

import { preventGameplayContextMenu } from "../lib/preventGameplayContextMenu";
import { GamePageMobileActionPanel } from "./GamePageMobileActionPanel";
import { GamePageMobileTopBar } from "./GamePageMobileTopBar";

export function GamePageMobileCanvasStage() {
	const cameraElements = useGamePageCameraElements();
	const viewModel = useGamePageMobileCanvasStageModel();
	const input = useGamePageInputContext();

	return (
		<section
			aria-labelledby="dungeon-canvas-heading"
			className="gameplay-touch-surface relative h-full w-full"
			onContextMenu={preventGameplayContextMenu}
		>
			<h2 id="dungeon-canvas-heading" className="sr-only">
				Dungeon Canvas
			</h2>

			<div className="h-full w-full cursor-grab">
				<GameCanvas
					cameraControlElement={cameraElements.cameraControlElement}
					cameraStateSnapshot={viewModel.cameraStateSnapshot}
					machineRuntime={viewModel.canvasMachineRuntime}
					postprocessingEnabled={viewModel.postprocessingEnabled}
				/>
			</div>

			<GamePageMobileTopBar />

			<CameraControlZone zoneRef={cameraElements.cameraControlRef} />

			<div className="pointer-events-none absolute bottom-4 left-4 z-30">
				<div className="pointer-events-auto">
					<TouchJoystickZone
						onMoveVelocity={input.touchMovement.handleMoveVelocity}
						onStopVelocity={input.touchMovement.handleStopVelocity}
					/>
				</div>
			</div>

			<div className="pointer-events-none absolute right-4 bottom-4 z-30 flex items-end gap-2">
				<MobileActionButtonZone
					isJumpActive={input.isJumpActive}
					isRunEnabled={input.isMobileRunToggled}
					sendInput={input.sendInput}
				/>

				<GamePageMobileActionPanel />
			</div>
		</section>
	);
}
