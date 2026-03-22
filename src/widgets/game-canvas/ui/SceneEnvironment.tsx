import {
	CORRIDOR_ENTITY_CONFIG,
	CorridorMesh,
	createCorridorMeshSettings,
} from "@/entities/corridor";
import type { RoomLabelSettings } from "@/entities/room";
import {
	getRoomCorridorAnchors,
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

const ROOM_CORRIDOR_ANCHORS = getRoomCorridorAnchors({
	center: ROOM_ENTITY_CONFIG.ORIGIN,
	dimensions: ROOM_ENTITY_CONFIG.DIMENSIONS,
});

const CORRIDOR_MESH_SETTINGS = createCorridorMeshSettings({
	anchors: ROOM_CORRIDOR_ANCHORS,
	depth: CORRIDOR_ENTITY_CONFIG.DIMENSIONS.depth,
	yOffset: CORRIDOR_ENTITY_CONFIG.SURFACE.Y_OFFSET,
});

export function SceneEnvironment({ environment }: SceneEnvironmentProps) {
	return (
		<>
			{CORRIDOR_MESH_SETTINGS.map((corridorSetting) => (
				<CorridorMesh key={corridorSetting.id} settings={corridorSetting} />
			))}
			<RoomMesh position={ROOM_ENTITY_CONFIG.ORIGIN} surface={environment} />
			<RoomLabel settings={ROOM_LABEL_SETTINGS} />
		</>
	);
}
