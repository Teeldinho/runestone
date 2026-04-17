import { Html } from "@react-three/drei";
import { ROOM_ENTITY_CONFIG } from "../config";
import type { RoomLabelSettings } from "../model";

type RoomLabelProps = {
	settings: RoomLabelSettings;
};

export function RoomLabel({ settings }: RoomLabelProps) {
	if (!settings.isVisible) {
		return null;
	}

	return (
		<Html
			position={settings.position}
			center
			distanceFactor={ROOM_ENTITY_CONFIG.LABEL.DISTANCE_FACTOR}
			zIndexRange={[...ROOM_ENTITY_CONFIG.LABEL.DOM_Z_INDEX_RANGE]}
			className="pointer-events-none"
		>
			<span className="rounded-[0.2rem] px-[0.35rem] py-[0.15rem] text-[1.3rem] font-bold tracking-[0.02em] text-panel-title [font-family:Space_Grotesk,sans-serif] whitespace-nowrap [text-shadow:0_0_6px_var(--dungeon-fog),0_0_1px_var(--dungeon-fog)]">
				{settings.text}
			</span>
		</Html>
	);
}
