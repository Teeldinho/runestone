import { CAMERA_MODES } from "@/features/camera-system";
import {
	CameraControlZone,
	TouchJoystickOverlay,
} from "@/features/touch-input";
import {
	useGamePageCameraElements,
	useGamePageMobileCanvasStageModel,
	useGamePageMobileJoystickModel,
} from "@/pages/game/model";
import { GameCanvas } from "@/widgets/game-canvas";

import { GamePageMobileActionPanel } from "./GamePageMobileActionPanel";
import { GamePageMobileTopBar } from "./GamePageMobileTopBar";

export function GamePageMobileCanvasStage() {
	const cameraElements = useGamePageCameraElements();
	const viewModel = useGamePageMobileCanvasStageModel();
	const joystickModel = useGamePageMobileJoystickModel();

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

			<div className="pointer-events-none absolute bottom-4 left-4 z-30">
				<div className="pointer-events-auto">
					<TouchJoystickOverlay
						onMoveVelocity={joystickModel.handleTouchJoystickMove}
						onStopVelocity={joystickModel.handleTouchJoystickStop}
					/>
				</div>
			</div>

			{viewModel.cameraStateSnapshot.mode === CAMERA_MODES.FIRST_PERSON ? (
				<div
					ref={cameraElements.firstPersonLookRef}
					id="fp-look-zone"
					className="pointer-events-auto absolute inset-y-0 right-0 left-1/2 z-20 touch-none select-none"
				/>
			) : null}

			<CameraControlZone zoneRef={cameraElements.cameraControlRef} />
			<GamePageMobileActionPanel />
		</section>
	);
}
