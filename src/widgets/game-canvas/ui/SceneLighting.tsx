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

			{torchSettings.map((torchSetting) => (
				<TorchLight
					key={torchSetting.position.join("-")}
					settings={torchSetting}
				/>
			))}
		</>
	);
}
