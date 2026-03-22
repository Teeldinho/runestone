import { Canvas } from "@react-three/fiber";
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
	machineRuntime: CanvasMachineRuntime;
};

export function GameCanvas({ machineRuntime }: GameCanvasProps) {
	const canvasSettings = useCanvasMachineSettings(machineRuntime);
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
