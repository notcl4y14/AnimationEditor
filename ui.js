class UserInterface {
	constructor () {
		this.code = [];
	}

	add (v) {
		let index = this.code.push(v);
		this.code[index-1].parent = this;
		return this.code[index];
	}

	step () {
		for (let element of this.code) {
			let mouseHovers = Collides(MouseX, MouseY, 0, 0, element.position.x, element.position.y, element.size.width, element.size.height);
			let mouseDown = MouseDownLeft || MouseDownRight || MouseDownMiddle;

			if (mouseHovers && !element.mouseHovered) {
				element.mouseHovered = true;
				element.onMouseHover(Mouse);
			} else if (!mouseHovers && element.mouseHovered) {
				element.mouseHovered = false;
				element.onMouseLeave(Mouse);
			}

			if (!mouseHovers) continue;

			if (mouseDown && !element.mouseDown) {
				element.mouseDown = true;
				element.onMouseClick(Mouse);

				if (element instanceof UIButton) element.onClick();
			} else if (!mouseDown && element.mouseDown) {
				element.mouseDown = false;
				element.onMouseRelease(Mouse);
			}
		}
	}

	draw (context) {
		for (let element of this.code) {
			element?.draw(context);
		}
	}
}

// https://love2d.org/wiki/BoundingBox.lua
let Collides = function (x1,y1,w1,h1, x2,y2,w2,h2) {
	return x1 < x2+w2 &&
	       x2 < x1+w1 &&
	       y1 < y2+h2 &&
	       y2 < y1+h1;
}

let AlignTo = function (p, origin) {
	return p - origin;
}

let ToNumber = function (num1, num2) {
	if (!num1 || !num2) {
		return null;
	}
	
	switch (num1.constructor) {
		case Number:
			return num1;
		case UIPercentage:
			return num2/100 * num1.number;
		
		default:
			return null;
	}
	
	// return num1 instanceof Number
	// 	? num1
	// 	: num2/100 * num1.number;
}

class UIPercentage {
	constructor (number) {
		this.number = number;
	}
}

class UIElement {
	constructor (position, size, angle) {
		this.position = position;
		this.size = size;
		this.angle = angle;

		this.origin = {x: 0, y: 0};
		this.pivot = {x: 0, y: 0};
		
		this.styles = {};

		this.mouseHovered = false;
		this.mouseDown = false;

		this.parent = null;
		this.children = [];
	}

	addChild (v) {
		let index = this.children.push(v);
		this.children[index-1].parent = this;
		return this.children[index];
	}

	alignedPos () {
		return {
			x: AlignTo(this.position.x, this.origin.x),
			y: AlignTo(this.position.y, this.origin.y)
		};
	}
	
	getPos () {
		// console.log(this.styles.left);
		let left = ToNumber(this.styles.left, this.parent.size.width - this.parent.position.x);
		let right = ToNumber(this.styles.right, this.parent.size.width - this.parent.position.x);
		let top = ToNumber(this.styles.top, this.parent.size.height + this.parent.position.y);
		let bottom = ToNumber(this.styles.bottom, this.parent.size.height + this.parent.position.y);

		let x = this.styles["left"] == null ? this.position.x : left;
		let y = this.styles["top"] == null ? this.position.y : top;

		if (this.styles["left"] == null) {
			x = this.styles["right"] == null ? x : this.parent.size.width - right;
		}
		
		if (this.styles["top"] == null) {
			y = this.styles["bottom"] == null ? y : this.parent.size.height - bottom;
		}

		return { x, y };
	}

	onMouseClick (mouse) {}
	onMouseRelease (mouse) {}
	onMouseHover (mouse) {}
	onMouseLeave (mouse) {}
	onMouseScroll (mouse) {}
	
	step (ui) {}
	draw (context) {}
}

class UIButton extends UIElement {
	constructor (position, size, angle, text, bgColor, textColor) {
		super (position, size, angle);

		this.label = text;

		if (typeof(this.label) == "string") {
			this.label = new UILabel(position, size, angle, text, textColor);
		}

		this.styles["background-color"] = bgColor;
		this.styles["color"] = textColor;
		this.label.styles["left"] = new UIPercentage(50);
		this.label.styles["top"] = new UIPercentage(50);

		this.label.parent = this;
	}

	onClick () {}

	draw (context) {
		let x = AlignTo(this.position.x, this.origin.x);
		let y = AlignTo(this.position.y, this.origin.y);
		let width = this.size.width;
		let height = this.size.height;

		context.fillStyle = this.styles["background-color"];
		context.fillRect(x, y, width, height);

		this.label.styles.color = this.styles.color;
		this.label.draw(context);
	}
}

class UILabel extends UIElement {
	constructor (position, size, angle, label, color) {
		super (position, size, angle);

		this.label = label;

		this.styles["color"] = color;
		this.styles["left"] = new UIPercentage(50);
		this.styles["top"] = new UIPercentage(50);
	}

	draw (context) {
		let { x, y } = this.getPos();
		// x -= context.measureText(this.label).width/2;

		// console.log(x, y);

		// https://stackoverflow.com/a/28776084/22146374
		context.textBaseline = "top";
		// context.textAlign = "center";
		context.fillStyle = this.styles["color"];
		context.fillText(this.label, x, y);
	}
}