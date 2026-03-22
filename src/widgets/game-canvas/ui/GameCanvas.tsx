import { Canvas } from "@react-three/fiber";
import type { CameraStateSnapshot } from "@/features/camera-system";
import { GAME_CANVAS_CONFIG } from "@/shared/config";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";
import { type CanvasMachineRuntime, useCanvasMachineSettings } from "../model";

import { SceneEnvironment } from "./SceneEnvironment";
import { SceneFog } from "./SceneFog";
import { SceneLighting } from "./SceneLighting";

type GameCanvasProps = {
	cameraStateSnapshot?: CameraStateSnapshot;
	machineRuntime: CanvasMachineRuntime;
};

export function GameCanvas({
	cameraStateSnapshot,
	machineRuntime,
}: GameCanvasProps) {
	const canvasSettings = useCanvasMachineSettings(
		machineRuntime,
		cameraStateSnapshot,
	);
	const { camera, environment, fog, lighting, renderer } = canvasSettings;

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
					className="w-full"
					style={{ height: GAME_CANVAS_CONFIG.UI.CANVAS_HEIGHT_PX }}
				>
					<Canvas
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
						<SceneFog fog={fog} />
						<SceneLighting lighting={lighting} />
						<SceneEnvironment environment={environment} />
					</Canvas>
				</div>
			</CardContent>
		</Card>
	);
}
