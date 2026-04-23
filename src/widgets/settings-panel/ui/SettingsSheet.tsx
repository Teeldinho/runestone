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

import { SettingsPanel } from "./SettingsPanel";

type SettingsSheetProps = {
	children: ReactNode;
};

export function SettingsSheet({ children }: SettingsSheetProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent
				side="right"
				className="w-full flex flex-col border-panel-border bg-panel shadow-xl backdrop-blur sm:w-[45rem] sm:max-w-2xl data-[side=right]:sm:max-w-2xl"
			>
				<SheetHeader className="sr-only">
					<SheetTitle>{SETTINGS_COPY.PAGE_TITLE}</SheetTitle>
					<SheetDescription>{SETTINGS_COPY.PAGE_DESCRIPTION}</SheetDescription>
				</SheetHeader>

				<div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
					<SettingsPanel />
				</div>
			</SheetContent>
		</Sheet>
	);
}
