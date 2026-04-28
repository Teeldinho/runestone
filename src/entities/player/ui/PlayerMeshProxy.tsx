import { lazy, Suspense } from "react";

type PlayerMeshProps = {
	initialPosition: readonly [number, number, number];
};

const PlayerMeshView = lazy(() =>
	import("./PlayerMesh").then((module) => ({ default: module.PlayerMesh })),
);

export function PlayerMesh({ initialPosition }: PlayerMeshProps) {
	return (
		<Suspense fallback={null}>
			<PlayerMeshView initialPosition={initialPosition} />
		</Suspense>
	);
}
