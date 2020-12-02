import { Body, BodyOptions } from './body';
import cherryPng1 from '../img/cherry-1.png';
import cherryPng2 from '../img/cherry-2.png';
import cherryPng3 from '../img/cherry-3.png';
import cherryPng4 from '../img/cherry-4.png';
import { randomInt } from './random';

const files = [cherryPng3, cherryPng2, cherryPng4, cherryPng1];
const images = files.map((file) => {
	const image = new Image();
	image.src = file;
	return image;
});

interface CherryOptions extends BodyOptions {
	textureRadius?: number;
	texture?: HTMLImageElement;
}

export class Cherry extends Body {
	private texture: HTMLImageElement;
	private textureRadius: number;
	public layer: number;

	public stopped?: boolean;
	public slideDirection?: number;

	public radius: number;
	public diameter: number;
	constructor(x: number, y: number, radius: number, options?: CherryOptions) {
		super(x, y, options);
		this.layer = randomInt(images.length);
		this.radius = radius;
		this.diameter = radius * 2;
		this.texture = options.texture;
		this.textureRadius = options.textureRadius || this.radius;
		this.texture = images[this.layer];
		this.slideDirection = 0;
	}

	public isSliding(): boolean {
		return Boolean(this.slideDirection);
	}

	public update(): void {
		if (this.stopped) {
			return;
		}
		super.update();
	}

	public stopSliding(): void {
		this.velocity.x = 0;
		this.slideDirection = 0;
	}

	public startSliding(direction: number): void {
		const sign = Math.sign(direction);
		this.velocity.y /= 4;
		this.velocity.x += Math.abs(this.velocity.y) * sign;
		this.velocity.y *= -0.5;
		this.slideDirection = sign;
	}

	public stop(y?: number) {
		this.velocity.x = 0;
		this.velocity.y = 0;
		if (y !== undefined) {
			this.position.y = y;
		}
		this.stopped = true;
	}

	public bounce(dim: 'x' | 'y') {
		this.velocity[dim] *= -0.2;
		// this.slideDirection *= -1;
	}

	public draw(ctx: CanvasRenderingContext2D, height: number): void {
		if (this.texture) {
			ctx.drawImage(
				this.texture,
				this.position.x - this.textureRadius,
				height - this.position.y - this.textureRadius
			);
		} else {
			ctx.beginPath();
			ctx.arc(
				this.position.x - this.textureRadius,
				height - this.position.y - this.textureRadius,
				this.textureRadius,
				0,
				Math.PI * 2
			);
			ctx.stroke();
		}
	}
}
