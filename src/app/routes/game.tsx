import { createFileRoute } from "@tanstack/react-router";
import { GamePage } from "@/pages/game";
import { APP_CONFIG } from "../../../app.config";

export const Route = createFileRoute("/game")({
	ssr: APP_CONFIG.SSR,
	component: GamePage,
});
