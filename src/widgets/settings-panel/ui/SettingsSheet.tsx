import type { ReactNode } from "react";
import { SETTINGS_COPY } from "@/features/settings";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui";

import { useSettingsPanelViewModel } from "../model";
import { SettingsPanelContent } from "./SettingsPanelContent";

type SettingsSheetProps = {
	children: ReactNode;
};

export function SettingsSheet({ children }: SettingsSheetProps) {
	const settings = useSettingsPanelViewModel();

	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent
				side="right"
				className="flex w-full flex-col border-panel-border/70 bg-panel/95 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-2xl backdrop-blur-xl sm:w-[45rem] sm:max-w-2xl data-[side=right]:sm:max-w-2xl"
			>
				<SheetHeader className="space-y-2 border-panel-border/60 border-b bg-background/20 pr-16 pb-4">
					<SheetTitle className="text-xl font-semibold tracking-tight text-panel-title">
						{SETTINGS_COPY.PAGE_TITLE}
					</SheetTitle>
					<SheetDescription className="text-base text-panel-body">
						{SETTINGS_COPY.PAGE_DESCRIPTION}
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
					<SettingsPanelContent settings={settings} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
