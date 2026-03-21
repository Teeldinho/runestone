import { Canvas } from "@react-three/fiber";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";
import { useCanvasSettings } from "../model";

import { SceneEnvironment } from "./SceneEnvironment";
import { SceneFog } from "./SceneFog";
import { SceneLighting } from "./SceneLighting";

export function GameCanvas() {
	const canvasSettings = useCanvasSettings();

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
				<div className="h-[420px] w-full">
					<Canvas
						camera={{
							far: canvasSettings.cameraFar,
							fov: canvasSettings.cameraFov,
							near: canvasSettings.cameraNear,
							position: canvasSettings.cameraPosition,
						}}
						dpr={canvasSettings.dprRange}
						shadows={canvasSettings.shadowsEnabled}
					>
						<SceneFog
							fogColor={canvasSettings.fogColor}
							fogDensity={canvasSettings.fogDensity}
						/>
						<SceneLighting
							ambientLightColor={canvasSettings.ambientLightColor}
							ambientLightIntensity={canvasSettings.ambientLightIntensity}
							torchLightColor={canvasSettings.torchLightColor}
							torchLightDecay={canvasSettings.torchLightDecay}
							torchLightDistance={canvasSettings.torchLightDistance}
							torchLightIntensity={canvasSettings.torchLightIntensity}
							torchLightPositions={canvasSettings.torchLightPositions}
						/>
						<SceneEnvironment
							detailStoneColor={canvasSettings.detailStoneColor}
							floorColor={canvasSettings.floorColor}
							floorMetalness={canvasSettings.floorMetalness}
							floorOffsetY={canvasSettings.floorOffsetY}
							floorRoughness={canvasSettings.floorRoughness}
							floorRotationXRad={canvasSettings.floorRotationXRad}
							floorSize={canvasSettings.floorSize}
							gridDivisions={canvasSettings.gridDivisions}
							gridOffsetY={canvasSettings.gridOffsetY}
							gridSize={canvasSettings.gridSize}
							pillarHeight={canvasSettings.pillarHeight}
							pillarMetalness={canvasSettings.pillarMetalness}
							pillarPositionY={canvasSettings.pillarPositionY}
							pillarRadius={canvasSettings.pillarRadius}
							pillarRadialSegments={canvasSettings.pillarRadialSegments}
							pillarRoughness={canvasSettings.pillarRoughness}
							runeActiveColor={canvasSettings.runeActiveColor}
							runeEmissiveIntensity={canvasSettings.runeEmissiveIntensity}
							runeOpenColor={canvasSettings.runeOpenColor}
							runeOrbHeight={canvasSettings.runeOrbHeight}
							runeOrbHeightSegments={canvasSettings.runeOrbHeightSegments}
							runeOrbRadius={canvasSettings.runeOrbRadius}
							runeOrbWidthSegments={canvasSettings.runeOrbWidthSegments}
							runeSealedColor={canvasSettings.runeSealedColor}
						/>
					</Canvas>
				</div>
			</CardContent>
		</Card>
	);
}
