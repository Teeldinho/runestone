import { Html } from "@react-three/drei";
import { useResponsiveGameLayout } from "@/features/responsive-layout";
import { Badge } from "@/shared/ui";
import { WORLD_INTERACTION_PROMPT_CONFIG } from "../config";
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
						<div className="mt-1 flex items-center gap-3 rounded-[6px] border border-panel-border bg-panel px-5 py-2.5 text-[1.1rem] font-medium [font-family:Space_Grotesk,sans-serif] whitespace-nowrap pointer-events-none shadow-lg">
							<span className="inline-flex h-10 min-w-10 items-center justify-center rounded-[4px] border border-dungeon-gold bg-[color-mix(in_srgb,var(--dungeon-gold)_10%,transparent)] px-3 text-[1rem] font-bold text-dungeon-gold">
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
						<div className="mt-1 flex items-center gap-3 rounded-[6px] border border-panel-border bg-panel px-5 py-2.5 text-[1.1rem] font-medium [font-family:Space_Grotesk,sans-serif] whitespace-nowrap pointer-events-none shadow-lg">
							<span className="inline-flex h-10 min-w-10 items-center justify-center rounded-[4px] border border-success bg-[color-mix(in_srgb,var(--success)_10%,transparent)] px-3 text-[1rem] font-bold text-success">
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
