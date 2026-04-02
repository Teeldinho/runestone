export const APP_CONFIG = {
	SSR: false,
} as const;

export type AppConfig = typeof APP_CONFIG;
