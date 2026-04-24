import { SETTINGS_COPY } from "@/features/settings";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";

import { useSettingsPanelViewModel } from "../model";
import { SettingsPanelContent } from "./SettingsPanelContent";

export function SettingsPanel() {
	const settings = useSettingsPanelViewModel();

	return (
		<Card className="w-full border-panel-border bg-panel shadow-xl backdrop-blur">
			<CardHeader className="space-y-2">
				<CardTitle className="text-3xl font-semibold text-panel-title">
					{SETTINGS_COPY.PAGE_TITLE}
				</CardTitle>
				<CardDescription className="text-base text-panel-body">
					{SETTINGS_COPY.PAGE_DESCRIPTION}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-8">
				<SettingsPanelContent settings={settings} />
			</CardContent>
		</Card>
	);
}
