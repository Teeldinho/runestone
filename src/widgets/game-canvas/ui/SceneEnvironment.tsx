import type { RoomLabelSettings } from "@/entities/room";
import {
	getRoomLabelPosition,
	ROOM_ENTITY_CONFIG,
	RoomLabel,
	RoomMesh,
} from "@/entities/room";
import type { CanvasEnvironmentSettings } from "../model";

type SceneEnvironmentProps = {
	environment: CanvasEnvironmentSettings;
};

const ROOM_LABEL_SETTINGS: RoomLabelSettings = {
	isVisible: true,
	position: getRoomLabelPosition({
		center: ROOM_ENTITY_CONFIG.ORIGIN,
		heightOffset: ROOM_ENTITY_CONFIG.LABEL.HEIGHT_OFFSET,
	}),
	text: ROOM_ENTITY_CONFIG.LABEL.TEXT,
};

export function SceneEnvironment({ environment }: SceneEnvironmentProps) {
	return (
		<>
			<RoomMesh position={ROOM_ENTITY_CONFIG.ORIGIN} surface={environment} />
			<RoomLabel settings={ROOM_LABEL_SETTINGS} />
		</>
	);
}
