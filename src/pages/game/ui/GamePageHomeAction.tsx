import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

import {
	GAME_PAGE_CONTROLS,
	GAME_PAGE_HOME_ACTION_TEST_IDS,
} from "@/pages/game/config";
import { Button } from "@/shared/ui";
import { MARKETING_ROUTES } from "@/widgets/marketing-shell";

export function GamePageHomeAction() {
	return (
		<Button
			asChild
			data-testid={GAME_PAGE_HOME_ACTION_TEST_IDS.ROOT}
			variant="dungeon-outline"
			size="icon"
			className="size-11"
			aria-label={GAME_PAGE_CONTROLS.NAVIGATION.HOME_ARIA_LABEL}
		>
			<Link to={MARKETING_ROUTES.HOME}>
				<Home className="h-4 w-4" />
			</Link>
		</Button>
	);
}
