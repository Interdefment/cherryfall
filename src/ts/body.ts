import { Vector } from './vector';

export interface BodyOptions {
	restitution?: number;
	gravity?: Vector;
	velocity?: Vector;
	texture?: HTMLImageElement;
}

const getDefaultOptions = (): BodyOptions => {
	return {
		restitution: 1,
		gravity: new Vector(),
		velocity: new Vector(),
	};
};

export class Body {
	public position: Vector;
	public velocity: Vector;
	public gravity: Vector;
	public restitution: number;

	constructor(posX = 0, posY = 0, options?: BodyOptions) {
		this.position = new Vector(posX, posY);
		this.velocity = new Vector();
		const defaultOptions = getDefaultOptions();
		this.velocity = options?.velocity || defaultOptions.velocity;
		this.gravity = options?.gravity || defaultOptions.gravity;
		this.restitution =
			options?.restitution === undefined
				? defaultOptions.restitution
				: options.restitution;
	}

	public accelerate(accel: Vector) {
		this.velocity.add(accel);
	}

	public update(): void {
		this.velocity.add(this.gravity);
		this.position.add(this.velocity);
	}

	public bounce(dim: 'x' | 'y'): void {
		this.velocity[dim] *= -1;
	}

	public stop(): void {
		this.velocity.x = 0;
		this.velocity.y = 0;
	}
}
