import { MobileActionButtonZone } from "@/features/input-orchestrator";
import { CameraControlZone, TouchJoystickZone } from "@/features/touch-input";
import {
	GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES,
	GAME_PAGE_MOBILE_OVERLAY_TEST_IDS,
} from "@/pages/game/config";
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
			onContextMenuCapture={preventGameplayContextMenu}
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

			{!viewModel.isInputBlocked ? (
				<>
					<GamePageMobileTopBar />

					<CameraControlZone zoneRef={cameraElements.cameraControlRef} />

					<div className={GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES.JOYSTICK_ANCHOR}>
						<div
							className={
								GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES.JOYSTICK_INTERACTIVE_SURFACE
							}
						>
							<TouchJoystickZone
								onMoveVelocity={input.touchMovement.handleMoveVelocity}
								onStopVelocity={input.touchMovement.handleStopVelocity}
							/>
						</div>
					</div>

					<div
						data-testid={GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ROOT}
						className={GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES.ROOT}
					>
						<div
							data-testid={GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.RUN_JUMP_ANCHOR}
							className={GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES.RUN_JUMP_ANCHOR}
						>
							<div
								className={
									GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES.RUN_JUMP_INTERACTIVE_SURFACE
								}
							>
								<MobileActionButtonZone
									isRunEnabled={input.isRunToggled}
									sendInput={input.sendInput}
								/>
							</div>
						</div>

						<div
							data-testid={
								GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ACTION_PANEL_ANCHOR
							}
							className={
								GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES.ACTION_PANEL_ANCHOR
							}
						>
							<GamePageMobileActionPanel />
						</div>
					</div>
				</>
			) : null}
		</section>
	);
}
