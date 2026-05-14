import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { AnyActorRef } from "xstate";
import type { CameraStateSnapshot } from "@/features/camera-system";
import { GAME_CANVAS_COPY } from "../config";
import {
	type CanvasMachineRuntime,
	useGameCanvasSceneLoading,
	useGameCanvasViewModel,
} from "../model";

import { CameraRig } from "./CameraRig";
import { GameCanvasLoadingOverlay } from "./GameCanvasLoadingOverlay";
import { GameCanvasOverlays } from "./GameCanvasOverlays";
import { GameCanvasSceneContent } from "./GameCanvasSceneContent";

type GameCanvasProps = {
	cameraActorRef: AnyActorRef;
	cameraControlElement?: HTMLElement | null;
	cameraStateSnapshot: CameraStateSnapshot;
	machineRuntime: CanvasMachineRuntime;
	postprocessingEnabled: boolean;
};

export function GameCanvas({
	cameraActorRef,
	cameraControlElement,
	cameraStateSnapshot,
	machineRuntime,
	postprocessingEnabled,
}: GameCanvasProps) {
	const { canvasSettings, activeAchievement, handleGameRestart, isGameOver } =
		useGameCanvasViewModel({
			cameraStateSnapshot,
			machineRuntime,
			postprocessingEnabled,
		});
	const { handleSceneReady, isSceneLoading } = useGameCanvasSceneLoading();
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
			<GameCanvasLoadingOverlay isVisible={isSceneLoading} />
			<GameCanvasOverlays
				activeAchievement={activeAchievement}
				handleGameRestart={handleGameRestart}
				isGameOver={isGameOver}
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
					cameraActorRef={cameraActorRef}
					cameraControlElement={cameraControlElement}
					cameraSnapshot={cameraStateSnapshot}
				/>
				<GameCanvasSceneContent
					environment={environment}
					fog={fog}
					isPostprocessingEnabled={isPostprocessingEnabled}
					lighting={lighting}
					onSceneReady={handleSceneReady}
					playerSpawnPosition={playerSpawnPosition}
					postprocessing={postprocessing}
				/>
			</Canvas>
		</div>
	);
}
