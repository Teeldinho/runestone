import { Button } from "@/shared/ui";
import { HUD_COPY } from "@/widgets/hud/config";
import type { GameHudViewModel } from "@/widgets/hud/model";

type GameHudActionsSectionProps = {
	actionButtons: GameHudViewModel["actionButtons"];
	handleDungeonRunReset: GameHudViewModel["handleDungeonRunReset"];
};

export function GameHudActionsSection({
	actionButtons,
	handleDungeonRunReset,
}: GameHudActionsSectionProps) {
	return (
		<section className="mt-4 space-y-3">
			<h3 className="rune-text border-panel-border border-b pb-1">
				{HUD_COPY.ACTIONS.TITLE}
			</h3>

			<div className="flex flex-col gap-2">
				{actionButtons.map((actionButton) => (
					<Button
						key={actionButton.eventType}
						type="button"
						onClick={actionButton.handleDungeonActionTrigger}
						disabled={actionButton.isDisabled}
						variant="dungeon-outline"
						className="min-h-11 w-full"
					>
						{actionButton.label}
					</Button>
				))}
			</div>

			<div className="pt-4">
				<Button
					type="button"
					onClick={handleDungeonRunReset}
					variant="dungeon-destructive"
					size="dungeon-sm"
					className="min-h-11"
				>
					{HUD_COPY.ACTIONS.RESET_BUTTON}
				</Button>
			</div>
		</section>
	);
}

export type { GameHudActionsSectionProps };
