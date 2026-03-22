import { CorridorMesh } from "@/entities/corridor";
import { RoomLabel, RoomMesh } from "@/entities/room";
import {
	type CanvasEnvironmentSettings,
	useSceneEnvironmentSettings,
} from "../model";

type SceneEnvironmentProps = {
	environment: CanvasEnvironmentSettings;
};

export function SceneEnvironment({ environment }: SceneEnvironmentProps) {
	const { corridorMeshSettings, roomLabelSettings, roomPosition } =
		useSceneEnvironmentSettings();

	return (
		<>
			{corridorMeshSettings.map((corridorSetting) => (
				<CorridorMesh key={corridorSetting.id} settings={corridorSetting} />
			))}
			<RoomMesh position={roomPosition} surface={environment} />
			<RoomLabel settings={roomLabelSettings} />
		</>
	);
}
