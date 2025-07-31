export function getDate(isoString: string): string {
	const date = new Date(isoString);
	return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
}
