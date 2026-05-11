import { MobileActionButtonZone } from "@/features/input-orchestrator";
import { CameraControlZone, TouchJoystickZone } from "@/features/touch-input";
import {
	useGamePageCameraElements,
	useGamePageInputOrchestrator,
	useGamePageMobileCameraControlHandlers,
	useGamePageMobileCanvasStageModel,
} from "@/pages/game/model";
import { GameCanvas } from "@/widgets/game-canvas";

import { GamePageMobileActionPanel } from "./GamePageMobileActionPanel";
import { GamePageMobileTopBar } from "./GamePageMobileTopBar";

export function GamePageMobileCanvasStage() {
	const cameraElements = useGamePageCameraElements();
	const viewModel = useGamePageMobileCanvasStageModel();
	const input = useGamePageInputOrchestrator();
	const cameraControlHandlers = useGamePageMobileCameraControlHandlers({
		cameraStateSnapshot: viewModel.cameraStateSnapshot,
		touchLook: input.touchLook,
	});

	return (
		<section
			aria-labelledby="dungeon-canvas-heading"
			className="relative h-full w-full"
		>
			<h2 id="dungeon-canvas-heading" className="sr-only">
				Dungeon Canvas
			</h2>

			<div className="h-full w-full cursor-grab">
				<GameCanvas
					cameraControlElement={cameraElements.cameraControlElement}
					cameraStateSnapshot={viewModel.cameraStateSnapshot}
					firstPersonLookElement={cameraElements.firstPersonLookElement}
					machineRuntime={viewModel.canvasMachineRuntime}
					postprocessingEnabled={viewModel.postprocessingEnabled}
				/>
			</div>

			<GamePageMobileTopBar />

			<CameraControlZone
				zoneRef={cameraElements.cameraControlRef}
				onLookPointerDown={cameraControlHandlers.onLookPointerDown}
				onLookPointerMove={cameraControlHandlers.onLookPointerMove}
				onLookPointerUp={cameraControlHandlers.onLookPointerUp}
				onLookPointerCancel={cameraControlHandlers.onLookPointerCancel}
			/>

			<div className="pointer-events-none absolute bottom-4 left-4 z-30">
				<div className="pointer-events-auto">
					<TouchJoystickZone
						onMoveVelocity={input.touchMovement.handleMoveVelocity}
						onStopVelocity={input.touchMovement.handleStopVelocity}
					/>
				</div>
			</div>

			<MobileActionButtonZone sendInput={input.sendInput} />

			<GamePageMobileActionPanel />
		</section>
	);
}
