import { Html } from "@react-three/drei";
import { useResponsiveGameLayout } from "@/features/responsive-layout";
import {
	WORLD_INTERACTION_KEY_STYLE,
	WORLD_INTERACTION_PROMPT_CONFIG,
	WORLD_INTERACTION_PROMPT_STYLE,
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
					style={{ pointerEvents: "none" }}
				>
					<div
						style={{
							...WORLD_INTERACTION_PROMPT_STYLE,
							transform: isDesktopLayout ? "none" : "scale(0.6)",
							transformOrigin: "center",
						}}
					>
						<span style={WORLD_INTERACTION_KEY_STYLE}>{interact.label}</span>
						<span>{interact.text}</span>
					</div>
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
					style={{ pointerEvents: "none" }}
				>
					<div
						style={{
							...WORLD_INTERACTION_PROMPT_STYLE,
							transform: isDesktopLayout ? "none" : "scale(0.6)",
							transformOrigin: "center",
						}}
					>
						<span style={WORLD_INTERACTION_KEY_STYLE}>{attack.label}</span>
						<span>{attack.text}</span>
					</div>
				</Html>
			)}
		</>
	);
}
