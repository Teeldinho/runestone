import { ATTACK_KEY_LABEL, INTERACTION_KEY_LABEL } from "../config";
import type { InteractionCandidatesViewModel } from "../model/useInteractionCandidates";

type InteractionPromptProps = {
	candidates: InteractionCandidatesViewModel;
};

export function InteractionPrompt({ candidates }: InteractionPromptProps) {
	if (!candidates.hasInteract && !candidates.hasAttack) {
		return null;
	}

	return (
		<div
			className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2"
			role="status"
			aria-live="polite"
		>
			{candidates.hasInteract && candidates.interactPrompt && (
				<div className="interaction-prompt">
					<span className="interaction-prompt-key">
						{INTERACTION_KEY_LABEL}
					</span>
					<span>{candidates.interactPrompt}</span>
				</div>
			)}
			{candidates.hasAttack && candidates.attackPrompt && (
				<div className="interaction-prompt">
					<span className="interaction-prompt-key">{ATTACK_KEY_LABEL}</span>
					<span>{candidates.attackPrompt}</span>
				</div>
			)}
		</div>
	);
}
