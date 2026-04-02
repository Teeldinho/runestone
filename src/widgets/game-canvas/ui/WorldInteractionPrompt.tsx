import { Html } from "@react-three/drei";
import { useMemo } from "react";

import {
	ATTACK_KEY_LABEL,
	INTERACTION_KEY_LABEL,
	useGameMachineRuntime,
	useInteractionCandidates,
} from "@/features/dungeon-navigation";

import { WORLD_INTERACTION_PROMPT_CONFIG } from "../config";
import {
	getWorldAttackPromptPosition,
	getWorldInteractionPromptPosition,
} from "../lib";
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
	border: "1px solid var(--panel-border)",
	background: "var(--panel)",
	color: "var(--foreground)",
	pointerEvents: "none",
	whiteSpace: "nowrap",
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
	border: "1px solid var(--dungeon-gold)",
	color: "var(--dungeon-gold)",
	background: "color-mix(in srgb, var(--dungeon-gold) 10%, transparent)",
};

export function WorldInteractionPrompt() {
	const { snapshot } = useGameMachineRuntime();
	const { roomMeshSettings } = useSceneEnvironmentSettings();

	const interactionCandidates = useInteractionCandidates({
		currentRoomId: snapshot.context.currentRoomId,
		hasTreasureKey: snapshot.context.hasTreasureKey,
		enemiesRemaining: snapshot.context.enemiesRemaining,
	});

	const interactPosition = useMemo(() => {
		if (!interactionCandidates.hasInteract) {
			return null;
		}

		return getWorldInteractionPromptPosition(
			interactionCandidates.interactTargetId,
			roomMeshSettings,
		);
	}, [
		interactionCandidates.hasInteract,
		interactionCandidates.interactTargetId,
		roomMeshSettings,
	]);

	const attackPosition = useMemo(() => {
		if (!interactionCandidates.hasAttack) {
			return null;
		}

		return getWorldAttackPromptPosition(interactionCandidates.attackPosition);
	}, [interactionCandidates.attackPosition, interactionCandidates.hasAttack]);

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
					distanceFactor={WORLD_INTERACTION_PROMPT_CONFIG.DISTANCE_FACTOR}
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
					distanceFactor={WORLD_INTERACTION_PROMPT_CONFIG.DISTANCE_FACTOR}
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
