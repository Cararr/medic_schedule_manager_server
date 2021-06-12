export function validateDateFormat(date: any): boolean {
	return /^\d{4}[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01])$/.test(date);
}

export function validateTimeFormat(time: any): boolean {
	return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}
