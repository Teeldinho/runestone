import { Html } from "@react-three/drei";
import { useResponsiveGameLayout } from "@/features/responsive-layout";
import { Badge } from "@/shared/ui";
import {
	WORLD_INTERACTION_PROMPT_CLASS_NAMES,
	WORLD_INTERACTION_PROMPT_CONFIG,
} from "../config";
import { useWorldInteractionPrompt } from "../model";
import type { WorldInteractionPromptProps } from "../model/useWorldInteractionPrompt";

export function WorldInteractionPrompt(props: WorldInteractionPromptProps) {
	const { interact, attack } = useWorldInteractionPrompt(props);
	const { isDesktopLayout } = useResponsiveGameLayout();

	if (!interact.isVisible && !attack.isVisible) {
		return null;
	}

	return (
		<>
			{interact.isVisible && interact.position && (
				<Html
					zIndexRange={[10, 20]}
					position={[
						interact.position[0],
						interact.position[1],
						interact.position[2],
					]}
					center
					distanceFactor={WORLD_INTERACTION_PROMPT_CONFIG.DISTANCE_FACTOR}
				>
					{isDesktopLayout ? (
						<div className={WORLD_INTERACTION_PROMPT_CLASS_NAMES.PANEL}>
							<span
								className={`${WORLD_INTERACTION_PROMPT_CLASS_NAMES.KEY_BASE} ${WORLD_INTERACTION_PROMPT_CLASS_NAMES.INTERACT_KEY}`}
							>
								{interact.label}
							</span>
							<span>{interact.text}</span>
						</div>
					) : (
						<Badge className="h-4 w-4 animate-pulse rounded-full bg-dungeon-gold p-0 shadow-[0_0_10px_var(--dungeon-gold)]" />
					)}
				</Html>
			)}

			{attack.isVisible && attack.position && (
				<Html
					zIndexRange={[10, 20]}
					position={[
						attack.position[0],
						attack.position[1],
						attack.position[2],
					]}
					center
					distanceFactor={WORLD_INTERACTION_PROMPT_CONFIG.DISTANCE_FACTOR}
				>
					{isDesktopLayout ? (
						<div className={WORLD_INTERACTION_PROMPT_CLASS_NAMES.PANEL}>
							<span
								className={`${WORLD_INTERACTION_PROMPT_CLASS_NAMES.KEY_BASE} ${WORLD_INTERACTION_PROMPT_CLASS_NAMES.ATTACK_KEY}`}
							>
								{attack.label}
							</span>
							<span>{attack.text}</span>
						</div>
					) : (
						<Badge className="h-4 w-4 animate-pulse rounded-full bg-success p-0 shadow-[0_0_10px_var(--success)]" />
					)}
				</Html>
			)}
		</>
	);
}
