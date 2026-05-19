import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import { useMemo } from "react";
import * as THREE from "three";

import { GAME_FRAME_PRIORITIES } from "@/shared/config";
import { setPlayerCameraFollowPosition } from "@/shared/lib";

type UsePlayerCameraFollowPositionSyncInput = {
	readonly groupRef: RefObject<THREE.Group | null>;
};

export const usePlayerCameraFollowPositionSync = ({
	groupRef,
}: UsePlayerCameraFollowPositionSyncInput): void => {
	const worldPosition = useMemo(() => new THREE.Vector3(), []);

	useFrame(() => {
		const group = groupRef.current;

		if (!group) {
			return;
		}

		group.getWorldPosition(worldPosition);

		setPlayerCameraFollowPosition(
			worldPosition.x,
			worldPosition.y,
			worldPosition.z,
		);
	}, GAME_FRAME_PRIORITIES.PLAYER_CAMERA_FOLLOW_POSITION_SYNC);
};

export type { UsePlayerCameraFollowPositionSyncInput };
