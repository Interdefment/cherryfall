export class Vector {
	constructor(private _x = 0, private _y = 0) {}

	get x(): number {
		return this._x;
	}
	get y(): number {
		return this._y;
	}
	set x(value: number) {
		this._x = value;
	}
	set y(value: number) {
		this._y = value;
	}

	get length(): number {
		return Math.sqrt(this._x * this._x + this._y * this._y);
	}
	get angle(): number {
		return Math.atan2(this._y, this._x);
	}

	set length(value: number) {
		const angle = this.angle;
		this._x = value * Math.cos(angle);
		this._y = value * Math.sin(angle);
	}

	set angle(value: number) {
		const length = this.length;
		this._x = length * Math.cos(value);
		this._y = length * Math.sin(value);
	}

	public add(value: Vector): Vector {
		this._x += value._x;
		this._y += value._y;
		return this;
	}

	public multiply(value: number): Vector {
		this._x *= value;
		this._y *= value;
		return this;
	}

	public normalize(): Vector {
		if (this.length === 0) {
			return this;
		}
		const invLength = 1 / this.length;
		return this.multiply(invLength);
	}

	public static sum(v1: Vector, v2: Vector): Vector {
		return new Vector(v1._x, v1._y).add(v2);
	}

	public static distance2(v1: Vector, v2: Vector) {
		return (
			(v1._x - v2._x) * (v1._x - v2._x) + (v1._y - v2._y) * (v1._y - v2._y)
		);
	}

	public static copy(v: Vector): Vector {
		return new Vector(v._x, v._y);
	}
}
