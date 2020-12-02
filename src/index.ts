import './styles.css';
import { chance, randomInt } from './ts/random';
import { Cherry } from './ts/cherry';
import { Leaf } from './ts/leaf';
import { Vector } from './ts/vector';
import { Body } from './ts/body';

const gravity = -0.8;
const lGravity = -0.2;
const cherryHitbox = 50;

let width = Math.max(window.innerWidth, window.innerHeight) + 200;
let height = width;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = width;
canvas.height = height;
const realCtx = canvas.getContext('2d');

const virtualCanvas = document.createElement('canvas');
virtualCanvas.width = width;
virtualCanvas.height = height;
const ctx = virtualCanvas.getContext('2d');

window.addEventListener('resize', () => {
	width = Math.max(window.innerWidth, window.innerHeight) + 100;
	height = width;
	canvas.width = width;
	canvas.height = height;
	virtualCanvas.width = width;
	virtualCanvas.height = height;
});

const cherries: Cherry[][] = Array.from(new Array(5)).map(() => []);
const leaves: Leaf[][] = Array.from(new Array(5)).map(() => []);

const cherryMap = new Array(Math.ceil(width / cherryHitbox)).fill(0);
cherryMap[-1] = 0;

function isCompleted() {
	return cherryMap.find((v) => v * cherryHitbox < height) === undefined;
}

function dropCherry(x: number, y: number) {
	const cherry = new Cherry(x, y, cherryHitbox / 2, {
		gravity: new Vector(0, gravity),
	});
	cherries[cherry.layer].push(cherry);
}

function dropLeaf(x: number, y: number) {
	const leaf = new Leaf(x, y, new Vector(40, 60), {
		gravity: new Vector(0, lGravity),
	});
	leaves[leaf.layer].push(leaf);
}

const randomDrop = () => {
	if (isCompleted()) {
		return;
	}
	if (chance(4)) {
		dropLeaf(randomInt(width), height - 30);
		return;
	}
	const x = randomInt(width);
	const index = Math.floor(x / cherryHitbox);
	const y = Math.max(cherryMap[index] * cherryHitbox, height + 200);
	dropCherry(x, y);
};

function getBodyIndex(body: Body) {
	return Math.floor(body.position.x / cherryHitbox);
}

function stopCherry(cherry: Cherry, immidiate = false) {
	const index = getBodyIndex(cherry);
	if (immidiate) {
		cherry.stop();
		cherryMap[index] = Math.max(
			cherryMap[index],
			(cherry.position.y + cherryHitbox / 2) / cherryHitbox
		);
	} else {
		const stopPoint = cherryMap[index] * cherryHitbox;
		cherry.stop(stopPoint);
		cherryMap[index]++;
	}
}

function shouldCherryStop(index: number, y: number) {
	return Math.ceil(y / cherryHitbox) <= cherryMap[index];
}

function canCherrySlide(index: number) {
	return (
		(index > -1 && cherryMap[index] > cherryMap[index - 1]) ||
		(index < cherryMap.length && cherryMap[index] > cherryMap[index + 1])
	);
}

function getSlideDirection(index: number, x: number) {
	const remainder = x % cherryHitbox;
	let slideDirection = Math.round(remainder / cherryHitbox) ? 1 : -1;
	if (cherryMap[index] <= cherryMap[index - 1]) {
		slideDirection = 1;
	} else if (cherryMap[index] <= cherryMap[index + 1]) {
		slideDirection = -1;
	}
	return slideDirection;
}

function updateCherry(cherry: Cherry) {
	if (!cherry.stopped) {
		cherry.update();
		const index = getBodyIndex(cherry);
		const { x, y } = cherry.position;
		if (shouldCherryStop(index, y)) {
			if (cherry.isSliding()) {
				if (!canCherrySlide(index)) {
					stopCherry(cherry);
				}
			} else if (canCherrySlide(index)) {
				cherry.startSliding(getSlideDirection(index, x));
			} else {
				stopCherry(cherry);
			}
		}
		if (
			(y < (cherryMap[index] - 1) * cherryHitbox && !cherry.stopped) ||
			y < -cherryHitbox * 2 ||
			x < -cherryHitbox / 2
		) {
			stopCherry(cherry, true);
		}
	}
	cherry.draw(ctx, height);
}

function updateLeaf(leaf: Leaf) {
	if (!leaf.stopped) {
		leaf.update();
		const index = getBodyIndex(leaf);
		if (leaf.position.y <= cherryMap[index] * cherryHitbox) {
			leaf.stop();
		}
	}
	leaf.draw(ctx, height);
}

function render() {
	ctx.clearRect(0, 0, width, height);
	realCtx.clearRect(0, 0, width, height);

	for (let i = 0; i < 5; ++i) {
		cherries[i].forEach(updateCherry);
		leaves[i].forEach(updateLeaf);
	}
	realCtx.drawImage(virtualCanvas, 0, 0);
	requestAnimationFrame(render);
}

const scroller = document.getElementById('scroll');

function increaseScroll() {
	let windowRelativeBottom = document.documentElement.getBoundingClientRect()
		.bottom;
	while (windowRelativeBottom < document.documentElement.clientHeight + 100) {
		scroller.style.height = `${scroller.clientHeight * 1.1}px`;
		windowRelativeBottom = document.documentElement.getBoundingClientRect()
			.bottom;
	}
}

document.addEventListener('scroll', () => {
	randomDrop();
	increaseScroll();
});

render();
