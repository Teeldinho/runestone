import { CorridorMesh } from "@/entities/corridor";
import { PlayerMesh } from "@/entities/player";
import { RoomLabel, RoomMesh } from "@/entities/room";
import {
	type CanvasEnvironmentSettings,
	useSceneEnvironmentSettings,
} from "../model";

type SceneEnvironmentProps = {
	environment: CanvasEnvironmentSettings;
};

export function SceneEnvironment({ environment }: SceneEnvironmentProps) {
	const {
		corridorMeshSettings,
		playerMeshSettings,
		roomLabelSettings,
		roomPosition,
	} = useSceneEnvironmentSettings();

	return (
		<>
			{corridorMeshSettings.map((corridorSetting) => (
				<CorridorMesh key={corridorSetting.id} settings={corridorSetting} />
			))}
			<RoomMesh position={roomPosition} surface={environment} />
			<PlayerMesh settings={playerMeshSettings} />
			<RoomLabel settings={roomLabelSettings} />
		</>
	);
}
