import { SETTINGS_COPY } from "@/features/settings";
import { Button } from "@/shared/ui";

type SettingsPanelResetActionProps = {
	onReset: () => void;
};

export function SettingsPanelResetAction({
	onReset,
}: SettingsPanelResetActionProps) {
	return (
		<Button variant="secondary" onClick={onReset} className="min-h-11">
			{SETTINGS_COPY.RESET_BUTTON}
		</Button>
	);
}
