export function randomFloat(max: number, min = 0): number {
	return min + Math.random() * (max - min);
}

export function randomInt(max: number, min = 0): number {
	return Math.floor(randomFloat(max, min));
}

export function getRandomOption(...options: any[]): any {
	return options[randomInt(options.length)];
}

export function chance(value: number): boolean {
	return Math.random() * 100 < value;
}