import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { AmbientLight, PointLight } from "three";

type SceneLightingProps = {
	ambientLightColor: string;
	ambientLightIntensity: number;
	torchLightColor: string;
	torchLightDecay: number;
	torchLightDistance: number;
	torchLightIntensity: number;
	torchLightPositions: [number, number, number][];
};

export function SceneLighting({
	ambientLightColor,
	ambientLightIntensity,
	torchLightColor,
	torchLightDecay,
	torchLightDistance,
	torchLightIntensity,
	torchLightPositions,
}: SceneLightingProps) {
	const scene = useThree((state) => state.scene);

	useEffect(() => {
		const ambientLight = new AmbientLight(
			ambientLightColor,
			ambientLightIntensity,
		);
		scene.add(ambientLight);

		const torchLights = torchLightPositions.map((torchLightPosition) => {
			const torchLight = new PointLight(
				torchLightColor,
				torchLightIntensity,
				torchLightDistance,
				torchLightDecay,
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
	}, [
		ambientLightColor,
		ambientLightIntensity,
		scene,
		torchLightColor,
		torchLightDecay,
		torchLightDistance,
		torchLightIntensity,
		torchLightPositions,
	]);

	return null;
}
