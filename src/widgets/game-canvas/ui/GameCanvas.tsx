import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { AchievementNotification } from "@/features/achievements";
import type { CameraStateSnapshot } from "@/features/camera-system";
import { GAME_CANVAS_CONFIG } from "@/shared/config";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";
import {
	type CanvasMachineRuntime,
	useAchievementTracker,
	useCanvasMachineSettings,
	useGameOverState,
	useGameSideEffects,
	usePlayerSceneController,
} from "../model";

import { GameOverOverlay } from "./GameOverOverlay";
import { SceneEnvironment } from "./SceneEnvironment";
import { SceneFog } from "./SceneFog";
import { SceneLighting } from "./SceneLighting";

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
		renderer,
		isPostprocessingEnabled,
	} = canvasSettings;

	usePlayerSceneController();
	useGameSideEffects();
	const { isGameOver, handleGameRestart } = useGameOverState();
	const { activeAchievement } = useAchievementTracker();

	return (
		<Card className="overflow-hidden border-panel-border bg-panel shadow-xl backdrop-blur">
			<CardHeader className="space-y-2">
				<CardTitle className="text-xl text-panel-title">
					Dungeon Canvas
				</CardTitle>
				<CardDescription className="text-panel-body">
					A live 3D foundation for the Runestone dungeon floor.
				</CardDescription>
			</CardHeader>

			<CardContent className="p-0">
				<div
					className="relative w-full"
					style={{ height: GAME_CANVAS_CONFIG.UI.CANVAS_HEIGHT_PX }}
				>
					<AchievementNotification achievement={activeAchievement} />
					<GameOverOverlay
						isGameOver={isGameOver}
						onRestart={handleGameRestart}
					/>
					<Canvas
						aria-label="Runestone dungeon 3D scene"
						camera={{
							far: camera.far,
							fov: camera.fov,
							near: camera.near,
							position: camera.position,
							zoom: camera.zoom,
						}}
						dpr={renderer.dprRange}
						shadows={renderer.shadowsEnabled}
					>
						<PerformanceMonitor />
						<AdaptiveDpr pixelated />
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
								<SceneEnvironment environment={environment} />
							</Physics>
						</Suspense>
					</Canvas>
				</div>
			</CardContent>
		</Card>
	);
}
