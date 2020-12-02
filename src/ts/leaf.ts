import { Body, BodyOptions } from './body';
import leaf1 from '../img/leaf-1.png';
import leaf2 from '../img/leaf-2.png';
import leaf3 from '../img/leaf-3.png';
import { getRandomOption, randomInt } from './random';
import { Vector } from './vector';

const files = [
	{ file: leaf1, hitbox: new Vector(77, 183), startAngle: 56 },
	{ file: leaf2, hitbox: new Vector(), startAngle: 20 },
	{ file: leaf3, hitbox: new Vector(), startAngle: 33 },
];
const images = files.map((item) => {
	const image = new Image();
	image.src = item.file;
	return {
		image,
		hitbox: item.hitbox,
		startAngle: item.startAngle,
	};
});

interface LeafOptions extends BodyOptions {
	textureSize?: Vector;
	texture?: HTMLImageElement;
}

export class Leaf extends Body {
	private texture: HTMLImageElement;
	private textureSize: Vector;
	public layer: number;

	public angle: number;

	public hitbox: Vector;
	public stopped?: boolean;

	private dx: number;

	constructor(x: number, y: number, hitbox: Vector, options?: LeafOptions) {
		super(x, y, options);
		this.layer = randomInt(images.length);
		this.texture = options.texture;
		this.hitbox = Vector.copy(images[this.layer].hitbox);
		this.textureSize = options.textureSize || this.hitbox;
		this.texture = images[this.layer].image;
		this.angle = images[this.layer].startAngle;

		this.dx = getRandomOption(-1, 1);
		++this.layer;
	}

	public update(): void {
		if (this.stopped) {
			return;
		}
		if (Math.abs(this.velocity.x) > 7) {
			this.dx *= -1;
		}
		this.angle += (this.dx * 2 * Math.PI) / 180;
		this.velocity.x += this.dx;
		super.update();
	}

	public stop(y?: number) {
		this.velocity.x = 0;
		this.velocity.y = 0;
		if (y !== undefined) {
			this.position.y = y;
		}
		this.stopped = true;
	}

	public draw(ctx: CanvasRenderingContext2D, height: number): void {
		if (this.texture) {
			ctx.save();
			ctx.translate(this.position.x, height - this.position.y);
			ctx.rotate(this.angle);
			ctx.drawImage(
				this.texture,
				-this.textureSize.x / 2,
				-this.textureSize.y / 2
			);
			ctx.restore();
		} else {
			console.log(this.layer);
			ctx.beginPath();
			ctx.rect(
				this.position.x - this.textureSize.x / 2,
				height - this.position.y - this.textureSize.y / 2,
				this.textureSize.x,
				this.textureSize.y
			);
			ctx.stroke();
		}
	}
}
