import { SettingsPanel } from "@/widgets/settings-panel";

export function SettingsPage() {
	return (
		<main
			id="main-content"
			className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center p-8"
		>
			<SettingsPanel />
		</main>
	);
}
