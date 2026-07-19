import { Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCw } from "lucide-react";

import { GAME_PAGE_PORTRAIT_GATE } from "@/pages/game/config";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui";
import { MARKETING_ROUTES } from "@/widgets/marketing-shell";

type GamePagePortraitGateProps = {
	isVisible: boolean;
};

export function GamePagePortraitGate({ isVisible }: GamePagePortraitGateProps) {
	if (!isVisible) {
		return null;
	}

	return (
		<Dialog open>
			<DialogContent
				role="alertdialog"
				showCloseButton={false}
				overlayClassName="z-[60] bg-background/90 backdrop-blur-sm"
				className="z-[61] gap-6 border border-dungeon-rune/20 bg-panel/95 p-6 text-center shadow-2xl shadow-background"
			>
				<DialogHeader className="items-center gap-4">
					<span className="flex size-14 items-center justify-center rounded-2xl border border-dungeon-gold/40 bg-dungeon-gold/10 text-dungeon-torch">
						<RotateCw aria-hidden="true" className="size-6" />
					</span>
					<DialogTitle className="text-xl font-semibold tracking-tight text-panel-title">
						{GAME_PAGE_PORTRAIT_GATE.TITLE}
					</DialogTitle>
					<DialogDescription className="space-y-2 text-sm leading-6 text-panel-body">
						<span className="block">{GAME_PAGE_PORTRAIT_GATE.DESCRIPTION}</span>
						<span className="block text-muted-foreground">
							{GAME_PAGE_PORTRAIT_GATE.BODY}
						</span>
					</DialogDescription>
				</DialogHeader>

				<Button asChild variant="dungeon-outline" className="min-h-11 w-full">
					<Link to={MARKETING_ROUTES.HOME}>
						<ArrowLeft aria-hidden="true" />
						{GAME_PAGE_PORTRAIT_GATE.HOME_ACTION_LABEL}
					</Link>
				</Button>
			</DialogContent>
		</Dialog>
	);
}
