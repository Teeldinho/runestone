import { TorchLight } from "@/entities/room";
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
			<hemisphereLight args={["#3a4a5c", "#2b2018", 0.4]} />

			{torchSettings.map((torchSetting) => (
				<TorchLight
					key={torchSetting.position.join("-")}
					settings={torchSetting}
				/>
			))}
		</>
	);
}
