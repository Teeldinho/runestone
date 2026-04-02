import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { AchievementNotification } from "@/features/achievements";
import type { CameraStateSnapshot } from "@/features/camera-system";
import { GAME_CANVAS_COPY } from "../config";
import {
	type CanvasMachineRuntime,
	useAchievementTracker,
	useCanvasMachineSettings,
	useFirstPersonLockHint,
	useGameOverState,
	useGameSideEffects,
	usePlayerSceneController,
} from "../model";

import { CameraRig } from "./CameraRig";
import { GameOverOverlay } from "./GameOverOverlay";
import { SceneEnvironment } from "./SceneEnvironment";
import { SceneFog } from "./SceneFog";
import { SceneLighting } from "./SceneLighting";
import { WorldInteractionRuntime } from "./WorldInteractionRuntime";

type GameCanvasProps = {
	cameraStateSnapshot?: CameraStateSnapshot;
	machineRuntime: CanvasMachineRuntime;
	postprocessingEnabled: boolean;
};

export function GameCanvas({
	cameraStateSnapshot,
	machineRuntime,
	postprocessingEnabled,
}: GameCanvasProps) {
	const canvasSettings = useCanvasMachineSettings(
		machineRuntime,
		cameraStateSnapshot,
		postprocessingEnabled,
	);
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

	usePlayerSceneController();
	useGameSideEffects();
	const { isGameOver, handleGameRestart } = useGameOverState();
	const { activeAchievement } = useAchievementTracker();
	const showFirstPersonLockHint = useFirstPersonLockHint({
		mode: cameraStateSnapshot?.mode,
	});

	return (
		<div className="relative h-full w-full overflow-hidden">
			<AchievementNotification achievement={activeAchievement} />
			<GameOverOverlay isGameOver={isGameOver} onRestart={handleGameRestart} />
			{showFirstPersonLockHint && (
				<button
					id="game-canvas-fp-lock"
					className="absolute inset-0 z-10 flex cursor-crosshair items-center justify-center bg-transparent text-sm font-medium"
					style={{ color: "color-mix(in srgb, white 60%, transparent)" }}
					type="button"
				>
					{GAME_CANVAS_COPY.FIRST_PERSON_LOCK_HINT}
				</button>
			)}
			<Canvas
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
				style={{ width: "100%", height: "100%" }}
			>
				<PerformanceMonitor />
				<AdaptiveDpr pixelated />
				<CameraRig
					cameraStateSnapshot={cameraStateSnapshot}
					playerSpawnPosition={playerSpawnPosition}
				/>
				<Suspense fallback={null}>
					<SceneFog fog={fog} />
					<SceneLighting lighting={lighting} />
					{isPostprocessingEnabled && (
						<EffectComposer>
							<Bloom
								luminanceThreshold={postprocessing.bloom.luminanceThreshold}
								luminanceSmoothing={postprocessing.bloom.luminanceSmoothing}
								intensity={postprocessing.bloom.intensity}
								mipmapBlur={postprocessing.bloom.mipmapBlur}
							/>
							<Vignette
								offset={postprocessing.vignette.offset}
								darkness={postprocessing.vignette.darkness}
							/>
						</EffectComposer>
					)}
					<Physics>
						<SceneEnvironment
							environment={environment}
							playerSpawnPosition={playerSpawnPosition}
						/>
						<WorldInteractionRuntime />
					</Physics>
				</Suspense>
			</Canvas>
		</div>
	);
}
