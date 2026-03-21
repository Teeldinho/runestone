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

import type { CanvasEnvironmentSettings } from "../model";

type SceneEnvironmentProps = {
	environment: CanvasEnvironmentSettings;
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

export function SceneEnvironment({ environment }: SceneEnvironmentProps) {
	const scene = useThree((state) => state.scene);

	useEffect(() => {
		const { floor, grid, pillar, rune } = environment;

		const environmentGroup = new Group();

		const floorMesh = new Mesh(
			new PlaneGeometry(...floor.size),
			new MeshStandardMaterial({
				color: floor.color,
				metalness: floor.metalness,
				roughness: floor.roughness,
				side: DoubleSide,
			}),
		);
		floorMesh.receiveShadow = true;
		floorMesh.rotation.x = floor.rotationXRad;
		floorMesh.position.y = floor.offsetY;
		environmentGroup.add(floorMesh);

		const pillarMesh = new Mesh(
			new CylinderGeometry(
				pillar.radius,
				pillar.radius,
				pillar.height,
				pillar.radialSegments,
			),
			new MeshStandardMaterial({
				color: pillar.color,
				metalness: pillar.metalness,
				roughness: pillar.roughness,
			}),
		);
		pillarMesh.castShadow = true;
		pillarMesh.receiveShadow = true;
		pillarMesh.position.y = pillar.positionY;
		environmentGroup.add(pillarMesh);

		const runeOrb = new Mesh(
			new SphereGeometry(
				rune.orbRadius,
				rune.orbWidthSegments,
				rune.orbHeightSegments,
			),
			new MeshStandardMaterial({
				color: rune.activeColor,
				emissive: rune.openColor,
				emissiveIntensity: rune.emissiveIntensity,
			}),
		);
		runeOrb.castShadow = true;
		runeOrb.position.y = rune.orbHeight;
		environmentGroup.add(runeOrb);

		const floorGrid = new GridHelper(
			grid.size,
			grid.divisions,
			rune.sealedColor,
			pillar.color,
		);
		floorGrid.position.y = floor.offsetY + grid.offsetY;
		environmentGroup.add(floorGrid);

		scene.add(environmentGroup);

		return () => {
			scene.remove(environmentGroup);
			disposeMeshResources(floorMesh);
			disposeMeshResources(pillarMesh);
			disposeMeshResources(runeOrb);
		};
	}, [environment, scene]);

	return null;
}
