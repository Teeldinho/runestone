import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import type { Vector3Tuple } from "@/shared/lib";
import type {
	CanvasEnvironmentSettings,
	CanvasFogSettings,
	CanvasLightingSettings,
	CanvasPostprocessingSettings,
} from "../model";

import { SceneEnvironment } from "./SceneEnvironment";
import { SceneFog } from "./SceneFog";
import { SceneLighting } from "./SceneLighting";
import { WorldInteractionRuntime } from "./WorldInteractionRuntime";

type GameCanvasSceneContentProps = {
	environment: CanvasEnvironmentSettings;
	fog: CanvasFogSettings;
	isPostprocessingEnabled: boolean;
	lighting: CanvasLightingSettings;
	playerSpawnPosition: Vector3Tuple;
	postprocessing: CanvasPostprocessingSettings;
};

export function GameCanvasSceneContent({
	environment,
	fog,
	isPostprocessingEnabled,
	lighting,
	playerSpawnPosition,
	postprocessing,
}: GameCanvasSceneContentProps) {
	return (
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
	);
}

export type { GameCanvasSceneContentProps };
