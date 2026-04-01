import { Html } from "@react-three/drei";
import { useMemo } from "react";

import {
	ATTACK_KEY_LABEL,
	INTERACTION_KEY_LABEL,
	useGameMachineRuntime,
	useInteractionCandidates,
} from "@/features/dungeon-navigation";

import { useSceneEnvironmentSettings } from "../model";

const PROMPT_STYLE: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	padding: "0.375rem 0.75rem",
	fontSize: "0.8rem",
	fontFamily: "Space Grotesk, sans-serif",
	fontWeight: 500,
	borderRadius: "4px",
	border: "1px solid rgba(245, 196, 81, 0.3)",
	background: "rgba(6, 9, 15, 0.85)",
	color: "white",
	pointerEvents: "none",
	whiteSpace: "nowrap",
	backdropFilter: "blur(8px)",
	marginTop: "0.25rem",
};

const KEY_STYLE: React.CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: "1.5rem",
	height: "1.5rem",
	padding: "0 0.375rem",
	fontSize: "0.7rem",
	fontWeight: 700,
	borderRadius: "3px",
	border: "1px solid #f5c451",
	color: "#f5c451",
	background: "rgba(245, 196, 81, 0.1)",
};

export function WorldInteractionPrompt() {
	const { snapshot } = useGameMachineRuntime();
	const { roomMeshSettings, enemyMeshSettings } = useSceneEnvironmentSettings();

	const interactionCandidates = useInteractionCandidates({
		currentRoomId: snapshot.context.currentRoomId,
		hasTreasureKey: snapshot.context.hasTreasureKey,
		enemiesRemaining: snapshot.context.enemiesRemaining,
	});

	const currentRoom = useMemo(
		() =>
			roomMeshSettings.find((r) => r.roomId === snapshot.context.currentRoomId),
		[roomMeshSettings, snapshot.context.currentRoomId],
	);

	const interactPosition = useMemo(() => {
		if (!interactionCandidates.hasInteract || !currentRoom) {
			return null;
		}

		if (interactionCandidates.interactEvent === "PICK_UP_KEY") {
			return [
				currentRoom.position[0],
				currentRoom.position[1] + 2.5,
				currentRoom.position[2],
			] as const;
		}

		return [
			currentRoom.position[0],
			currentRoom.position[1] + 3,
			currentRoom.position[2],
		] as const;
	}, [interactionCandidates, currentRoom]);

	const attackPosition = useMemo(() => {
		if (!interactionCandidates.hasAttack || enemyMeshSettings.length === 0) {
			return null;
		}

		const nearest = enemyMeshSettings[0];
		return [
			nearest.position[0],
			nearest.position[1] + 2.5,
			nearest.position[2],
		] as const;
	}, [interactionCandidates.hasAttack, enemyMeshSettings]);

	if (!interactionCandidates.hasInteract && !interactionCandidates.hasAttack) {
		return null;
	}

	return (
		<>
			{interactPosition && interactionCandidates.interactPrompt && (
				<Html
					position={[
						interactPosition[0],
						interactPosition[1],
						interactPosition[2],
					]}
					center
					distanceFactor={10}
					style={{ pointerEvents: "none" }}
				>
					<div style={PROMPT_STYLE}>
						<span style={KEY_STYLE}>{INTERACTION_KEY_LABEL}</span>
						<span>{interactionCandidates.interactPrompt}</span>
					</div>
				</Html>
			)}
			{attackPosition && interactionCandidates.attackPrompt && (
				<Html
					position={[attackPosition[0], attackPosition[1], attackPosition[2]]}
					center
					distanceFactor={10}
					style={{ pointerEvents: "none" }}
				>
					<div style={PROMPT_STYLE}>
						<span style={KEY_STYLE}>{ATTACK_KEY_LABEL}</span>
						<span>{interactionCandidates.attackPrompt}</span>
					</div>
				</Html>
			)}
		</>
	);
}
