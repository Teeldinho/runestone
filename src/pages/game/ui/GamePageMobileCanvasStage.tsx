import { CAMERA_MODES } from "@/features/camera-system";
import {
	MobileActionButtonZone,
	useInputOrchestrator,
	useKeyboardInputOrchestrator,
	useTouchLookInput,
	useTouchMovementInput,
} from "@/features/input-orchestrator";
import { CameraControlZone, TouchJoystickZone } from "@/features/touch-input";
import {
	useGamePageCameraElements,
	useGamePageMachineState,
	useGamePageMobileCanvasStageModel,
} from "@/pages/game/model";
import { GameCanvas } from "@/widgets/game-canvas";

import { GamePageMobileActionPanel } from "./GamePageMobileActionPanel";
import { GamePageMobileTopBar } from "./GamePageMobileTopBar";

export function GamePageMobileCanvasStage() {
	const cameraElements = useGamePageCameraElements();
	const viewModel = useGamePageMobileCanvasStageModel();
	const { playerActorRef, cameraActorRef, gameActorRef } =
		useGamePageMachineState();

	const input = useInputOrchestrator({
		playerRef: playerActorRef,
		cameraRef: cameraActorRef,
		interactionRef: gameActorRef,
	});

	useKeyboardInputOrchestrator({
		sendInput: input.sendInput,
	});

	const touchLook = useTouchLookInput({
		sendInput: input.sendInput,
	});

	const touchMovement = useTouchMovementInput({
		sendInput: input.sendInput,
		isDesktopRunHeld: input.isDesktopRunHeld,
		isMobileRunToggled: input.isMobileRunToggled,
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
				onLookPointerDown={touchLook.handlePointerDown}
				onLookPointerMove={touchLook.handlePointerMove}
				onLookPointerUp={touchLook.handlePointerUp}
				onLookPointerCancel={touchLook.handlePointerCancel}
			>
				<div className="pointer-events-none absolute bottom-4 left-4 z-30">
					<div className="pointer-events-auto">
						<TouchJoystickZone
							onMoveVelocity={touchMovement.handleMoveVelocity}
							onStopVelocity={touchMovement.handleStopVelocity}
						/>
					</div>
				</div>

				<MobileActionButtonZone sendInput={input.sendInput} />
			</CameraControlZone>

			{viewModel.cameraStateSnapshot.mode === CAMERA_MODES.FIRST_PERSON ? (
				<div
					ref={cameraElements.firstPersonLookRef}
					id="fp-look-zone"
					className="pointer-events-auto absolute inset-y-0 right-0 left-1/2 z-20 touch-none select-none"
				/>
			) : null}
			<GamePageMobileActionPanel />
		</section>
	);
}
