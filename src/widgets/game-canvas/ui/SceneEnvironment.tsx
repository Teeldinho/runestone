import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import {
	CylinderGeometry,
	DoubleSide,
	GridHelper,
	Group,
	Mesh,
	MeshStandardMaterial,
	PlaneGeometry,
	SphereGeometry,
} from "three";

type SceneEnvironmentProps = {
	detailStoneColor: string;
	floorColor: string;
	floorMetalness: number;
	floorOffsetY: number;
	floorRoughness: number;
	floorRotationXRad: number;
	floorSize: [number, number];
	gridDivisions: number;
	gridOffsetY: number;
	gridSize: number;
	pillarHeight: number;
	pillarMetalness: number;
	pillarPositionY: number;
	pillarRadius: number;
	pillarRadialSegments: number;
	pillarRoughness: number;
	runeActiveColor: string;
	runeEmissiveIntensity: number;
	runeOpenColor: string;
	runeOrbHeight: number;
	runeOrbHeightSegments: number;
	runeOrbRadius: number;
	runeOrbWidthSegments: number;
	runeSealedColor: string;
};

const disposeMeshResources = (mesh: Mesh): void => {
	mesh.geometry.dispose();

	if (Array.isArray(mesh.material)) {
		mesh.material.forEach((material) => {
			material.dispose();
		});
		return;
	}

	mesh.material.dispose();
};

export function SceneEnvironment({
	detailStoneColor,
	floorColor,
	floorMetalness,
	floorOffsetY,
	floorRoughness,
	floorRotationXRad,
	floorSize,
	gridDivisions,
	gridOffsetY,
	gridSize,
	pillarHeight,
	pillarMetalness,
	pillarPositionY,
	pillarRadius,
	pillarRadialSegments,
	pillarRoughness,
	runeActiveColor,
	runeEmissiveIntensity,
	runeOpenColor,
	runeOrbHeight,
	runeOrbHeightSegments,
	runeOrbRadius,
	runeOrbWidthSegments,
	runeSealedColor,
}: SceneEnvironmentProps) {
	const scene = useThree((state) => state.scene);

	useEffect(() => {
		const environmentGroup = new Group();

		const floor = new Mesh(
			new PlaneGeometry(...floorSize),
			new MeshStandardMaterial({
				color: floorColor,
				metalness: floorMetalness,
				roughness: floorRoughness,
				side: DoubleSide,
			}),
		);
		floor.receiveShadow = true;
		floor.rotation.x = floorRotationXRad;
		floor.position.y = floorOffsetY;
		environmentGroup.add(floor);

		const pillar = new Mesh(
			new CylinderGeometry(
				pillarRadius,
				pillarRadius,
				pillarHeight,
				pillarRadialSegments,
			),
			new MeshStandardMaterial({
				color: detailStoneColor,
				metalness: pillarMetalness,
				roughness: pillarRoughness,
			}),
		);
		pillar.castShadow = true;
		pillar.receiveShadow = true;
		pillar.position.y = pillarPositionY;
		environmentGroup.add(pillar);

		const runeOrb = new Mesh(
			new SphereGeometry(
				runeOrbRadius,
				runeOrbWidthSegments,
				runeOrbHeightSegments,
			),
			new MeshStandardMaterial({
				color: runeActiveColor,
				emissive: runeOpenColor,
				emissiveIntensity: runeEmissiveIntensity,
			}),
		);
		runeOrb.castShadow = true;
		runeOrb.position.y = runeOrbHeight;
		environmentGroup.add(runeOrb);

		const floorGrid = new GridHelper(
			gridSize,
			gridDivisions,
			runeSealedColor,
			detailStoneColor,
		);
		floorGrid.position.y = floorOffsetY + gridOffsetY;
		environmentGroup.add(floorGrid);

		scene.add(environmentGroup);

		return () => {
			scene.remove(environmentGroup);
			disposeMeshResources(floor);
			disposeMeshResources(pillar);
			disposeMeshResources(runeOrb);
		};
	}, [
		detailStoneColor,
		floorColor,
		floorMetalness,
		floorOffsetY,
		floorRoughness,
		floorRotationXRad,
		floorSize,
		gridDivisions,
		gridOffsetY,
		gridSize,
		pillarHeight,
		pillarMetalness,
		pillarPositionY,
		pillarRadius,
		pillarRadialSegments,
		pillarRoughness,
		runeActiveColor,
		runeEmissiveIntensity,
		runeOpenColor,
		runeOrbHeight,
		runeOrbHeightSegments,
		runeOrbRadius,
		runeOrbWidthSegments,
		runeSealedColor,
		scene,
	]);

	return null;
}
