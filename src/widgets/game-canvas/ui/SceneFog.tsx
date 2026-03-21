import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Color, FogExp2 } from "three";

type SceneFogProps = {
	fogColor: string;
	fogDensity: number;
};

export function SceneFog({ fogColor, fogDensity }: SceneFogProps) {
	const scene = useThree((state) => state.scene);

	useEffect(() => {
		const previousBackground = scene.background;
		const sceneBackground = new Color(fogColor);
		const sceneFog = new FogExp2(fogColor, fogDensity);
		scene.background = sceneBackground;
		scene.fog = sceneFog;

		return () => {
			scene.background = previousBackground;

			if (scene.fog === sceneFog) {
				scene.fog = null;
			}
		};
	}, [fogColor, fogDensity, scene]);

	return null;
}
