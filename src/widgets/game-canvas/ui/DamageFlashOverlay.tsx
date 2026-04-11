import { usePlayerDamageFlash } from "@/entities/player";

export function DamageFlashOverlay() {
	const showDamageFlash = usePlayerDamageFlash();

	if (!showDamageFlash) {
		return null;
	}

	return (
		<div
			className="pointer-events-none absolute inset-0 z-50 animate-pulse"
			style={{
				boxShadow: "inset 0 0 60px 20px rgba(220, 38, 38, 0.6)",
			}}
			aria-hidden="true"
		/>
	);
}
