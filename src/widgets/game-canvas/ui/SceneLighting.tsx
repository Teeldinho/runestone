import { TorchLight } from "@/entities/room";
import {
	DUNGEON_HEMISPHERE_INTENSITY,
	DUNGEON_THEME_COLORS,
} from "@/shared/config";
import { type CanvasLightingSettings, useSceneLighting } from "../model";

type SceneLightingProps = {
	lighting: CanvasLightingSettings;
};

export function SceneLighting({ lighting }: SceneLightingProps) {
	const { torchSettings } = useSceneLighting(lighting);

	return (
		<>
			<ambientLight
				color={lighting.ambient.color}
				intensity={lighting.ambient.intensity}
			/>
			<hemisphereLight
				args={[
					DUNGEON_THEME_COLORS.HEMISPHERE_SKY,
					DUNGEON_THEME_COLORS.HEMISPHERE_GROUND,
					DUNGEON_HEMISPHERE_INTENSITY,
				]}
			/>

			{torchSettings.map((torchSetting) => (
				<TorchLight
					key={torchSetting.position.join("-")}
					settings={torchSetting}
				/>
			))}
		</>
	);
}
