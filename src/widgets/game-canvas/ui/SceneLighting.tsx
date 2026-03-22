import { type RoomTorchSettings, TorchLight } from "@/entities/room";
import type { CanvasLightingSettings } from "../model";

type SceneLightingProps = {
	lighting: CanvasLightingSettings;
};

const getTorchSettings = (
	lighting: CanvasLightingSettings,
): RoomTorchSettings[] => {
	return lighting.torch.positions.map((position) => {
		return {
			color: lighting.torch.color,
			decay: lighting.torch.decay,
			distance: lighting.torch.distance,
			intensity: lighting.torch.intensity,
			position,
		};
	});
};

export function SceneLighting({ lighting }: SceneLightingProps) {
	const torchSettings = getTorchSettings(lighting);

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
