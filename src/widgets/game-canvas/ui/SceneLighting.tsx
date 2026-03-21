import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { AmbientLight, PointLight } from "three";

import type { CanvasLightingSettings } from "../model";

type SceneLightingProps = {
	lighting: CanvasLightingSettings;
};

export function SceneLighting({ lighting }: SceneLightingProps) {
	const scene = useThree((state) => state.scene);

	useEffect(() => {
		const { ambient, torch } = lighting;

		const ambientLight = new AmbientLight(ambient.color, ambient.intensity);
		scene.add(ambientLight);

		const torchLights = torch.positions.map((torchLightPosition) => {
			const torchLight = new PointLight(
				torch.color,
				torch.intensity,
				torch.distance,
				torch.decay,
			);
			torchLight.castShadow = true;
			torchLight.position.set(...torchLightPosition);
			scene.add(torchLight);

			return torchLight;
		});

		return () => {
			torchLights.forEach((torchLight) => {
				scene.remove(torchLight);
				torchLight.dispose();
			});

			scene.remove(ambientLight);
		};
	}, [lighting, scene]);

	return null;
}
