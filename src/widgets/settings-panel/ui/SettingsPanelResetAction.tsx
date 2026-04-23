import { SETTINGS_COPY } from "@/features/settings";
import { Button } from "@/shared/ui";

type SettingsPanelResetActionProps = {
	onReset: () => void;
};

export function SettingsPanelResetAction({
	onReset,
}: SettingsPanelResetActionProps) {
	return (
		<Button variant="secondary" onClick={onReset}>
			{SETTINGS_COPY.RESET_BUTTON}
		</Button>
	);
}
