export const resolveToggleLabel = (
	enabled: boolean,
	onLabel: string,
	offLabel: string,
): string => (enabled ? onLabel : offLabel);
