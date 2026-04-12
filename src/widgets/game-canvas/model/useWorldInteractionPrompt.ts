import { useMemo } from "react";
import {
	ATTACK_KEY_LABEL,
	ATTACK_TOUCH_LABEL,
	INTERACTION_KEY_LABEL,
	INTERACTION_TOUCH_LABEL,
	type InteractionCandidatesViewModel,
} from "@/features/dungeon-navigation";
import { useResponsiveGameLayout } from "@/features/responsive-layout";
import {
	getWorldAttackPromptPosition,
	getWorldInteractionPromptPosition,
} from "../lib";
import type { RoomPositionsById } from "../lib/getWorldInteractionPromptPosition";

export type WorldInteractionPromptProps = {
	interactionCandidates: InteractionCandidatesViewModel;
	roomPositionsById: RoomPositionsById;
};

export function useWorldInteractionPrompt({
	interactionCandidates,
	roomPositionsById,
}: WorldInteractionPromptProps) {
	const { isDesktopLayout } = useResponsiveGameLayout();

	const interactPosition = useMemo(() => {
		if (!interactionCandidates.hasInteract) {
			return null;
		}

		return getWorldInteractionPromptPosition(
			interactionCandidates.interactTargetId,
			roomPositionsById,
		);
	}, [
		interactionCandidates.hasInteract,
		interactionCandidates.interactTargetId,
		roomPositionsById,
	]);

	const attackPosition = useMemo(() => {
		if (!interactionCandidates.hasAttack) {
			return null;
		}

		return getWorldAttackPromptPosition(interactionCandidates.attackPosition);
	}, [interactionCandidates.attackPosition, interactionCandidates.hasAttack]);

	const interact = {
		isVisible: !!(interactPosition && interactionCandidates.interactPrompt),
		position: interactPosition,
		label: isDesktopLayout ? INTERACTION_KEY_LABEL : INTERACTION_TOUCH_LABEL,
		text: interactionCandidates.interactPrompt,
	};

	const attack = {
		isVisible: !!(attackPosition && interactionCandidates.attackPrompt),
		position: attackPosition,
		label: isDesktopLayout ? ATTACK_KEY_LABEL : ATTACK_TOUCH_LABEL,
		text: interactionCandidates.attackPrompt,
	};

	return {
		interact,
		attack,
	};
}
