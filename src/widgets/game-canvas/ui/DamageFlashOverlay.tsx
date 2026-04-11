import { usePlayerDamageFlash } from "@/entities/player";

export function DamageFlashOverlay() {
	const showDamageFlash = usePlayerDamageFlash();

	if (!showDamageFlash) {
		return null;
	}

	return (
		<div
			className="pointer-events-none absolute inset-0 z-50 animate-pulse shadow-[inset_0_0_60px_20px_var(--color-destructive)]"
			style={{ opacity: 0.5 }}
			aria-hidden="true"
		/>
	);
}
