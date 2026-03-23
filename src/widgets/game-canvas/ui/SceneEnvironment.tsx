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
	const { corridorMeshSettings, roomMeshSettings } =
		useSceneEnvironmentSettings();

	return (
		<>
			{corridorMeshSettings.map((corridorSetting) => (
				<CorridorMesh key={corridorSetting.id} settings={corridorSetting} />
			))}
			{roomMeshSettings.map((room) => (
				<RoomMesh
					key={room.roomId}
					position={room.position}
					surface={environment}
				/>
			))}
			<PlayerMesh />
			{roomMeshSettings.map((room) => (
				<RoomLabel key={`${room.roomId}:label`} settings={room.labelSettings} />
			))}
		</>
	);
}
