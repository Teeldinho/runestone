import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { CameraStateSnapshot } from "@/features/camera-system";
import { GAME_CANVAS_COPY } from "../config";
import { type CanvasMachineRuntime, useGameCanvasViewModel } from "../model";

import { CameraRig } from "./CameraRig";
import { GameCanvasOverlays } from "./GameCanvasOverlays";
import { GameCanvasSceneContent } from "./GameCanvasSceneContent";

type GameCanvasProps = {
	cameraControlElement?: HTMLElement | null;
	cameraStateSnapshot?: CameraStateSnapshot;
	firstPersonLookElement?: HTMLElement | null;
	machineRuntime: CanvasMachineRuntime;
	postprocessingEnabled: boolean;
};

export function GameCanvas({
	cameraControlElement,
	cameraStateSnapshot,
	firstPersonLookElement,
	machineRuntime,
	postprocessingEnabled,
}: GameCanvasProps) {
	const {
		canvasSettings,
		activeAchievement,
		handleGameRestart,
		isGameOver,
		showFirstPersonLockHint,
	} = useGameCanvasViewModel({
		cameraStateSnapshot,
		machineRuntime,
		postprocessingEnabled,
	});
	const {
		camera,
		environment,
		fog,
		lighting,
		postprocessing,
		playerSpawnPosition,
		renderer,
		isPostprocessingEnabled,
	} = canvasSettings;

	return (
		<div className="relative h-full w-full overflow-hidden">
			<GameCanvasOverlays
				activeAchievement={activeAchievement}
				handleGameRestart={handleGameRestart}
				isGameOver={isGameOver}
				showFirstPersonLockHint={showFirstPersonLockHint}
			/>
			<Canvas
				className="h-full w-full touch-none"
				aria-label={GAME_CANVAS_COPY.CANVAS_ARIA_LABEL}
				camera={{
					far: camera.far,
					fov: camera.fov,
					near: camera.near,
					position: camera.position,
					zoom: camera.zoom,
				}}
				dpr={renderer.dprRange}
				onContextMenu={(event) => event.preventDefault()}
				shadows={renderer.shadowsEnabled}
			>
				<PerformanceMonitor />
				<AdaptiveDpr pixelated />
				<CameraRig
					cameraControlElement={cameraControlElement}
					cameraStateSnapshot={cameraStateSnapshot}
					firstPersonLookElement={firstPersonLookElement}
					playerSpawnPosition={playerSpawnPosition}
				/>
				<GameCanvasSceneContent
					environment={environment}
					fog={fog}
					isPostprocessingEnabled={isPostprocessingEnabled}
					lighting={lighting}
					playerSpawnPosition={playerSpawnPosition}
					postprocessing={postprocessing}
				/>
			</Canvas>
		</div>
	);
}
