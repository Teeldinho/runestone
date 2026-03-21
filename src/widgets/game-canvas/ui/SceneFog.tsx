import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Color, FogExp2 } from "three";

import type { CanvasFogSettings } from "../model";

type SceneFogProps = {
	fog: CanvasFogSettings;
};

export function SceneFog({ fog }: SceneFogProps) {
	const scene = useThree((state) => state.scene);

	useEffect(() => {
		const previousBackground = scene.background;
		const sceneBackground = new Color(fog.color);
		const sceneFog = new FogExp2(fog.color, fog.density);
		scene.background = sceneBackground;
		scene.fog = sceneFog;

		return () => {
			scene.background = previousBackground;

			if (scene.fog === sceneFog) {
				scene.fog = null;
			}
		};
	}, [fog, scene]);

	return null;
}
