class Clip {
	constructor (x, y, drawSrc) {
		this.x = x;
		this.y = y;

		this.scale = {width: 1, height: 1};

		this.drawable = new Image();
		this.drawable.src = drawSrc;

		this.visible = true;

		this.origin = {x: 0, y: 0};
		this.pivot = {x: 0, y: 0};
		this.points = [];

		this._ = {
			mouseHover: false,
			mouseClick: false
		};
	}

	SetOrigin (pos) {
		this.origin = pos;
	}

	SetPivot (pos) {
		this.pivot = pos;
	}

	SetOriginPivot (pos) {
		this.origin = pos;
		this.pivot = pos;
	}

	SetScale (width, height = width) {
		this.scale.width = width;
		this.scale.height = height;
	}

	get width () {
		return this.drawable.width * this.scale.width;
	}

	get height () {
		return this.drawable.height * this.scale.height;
	}

	PreStep () {}
	Step () {}
	PostStep () {}
	
	OnCreate () {}
	OnDestroy () {}
	OnMouseHover () {}
	OnMouseLeave () {}
	OnMouseClick () {}
	OnMouseRelease () {}

	Draw () {
		let drawable = this.drawable;
		
		if (!drawable.complete) return;
		
		let x = ApplyPoint(this.x, this.origin.x);
		let y = ApplyPoint(this.y, this.origin.y);
		let scale = {
			width: drawable.width * this.scale.width,
			height: drawable.height * this.scale.height,
		};

		Context.fillStyle = "white";
		Context.drawImage(drawable, x, y, scale.width, scale.height);

		this.DrawObjectBox();
	}

	DrawObjectBox (outlineColor  = "rgb(100,100,100)", textColor = "rgb(255,255,255)") {
		let drawable = this.drawable;
		let x = ApplyPoint(this.x, this.origin.x);
		let y = ApplyPoint(this.y, this.origin.y);
		let scale = {
			width: drawable.width * this.scale.width,
			height: drawable.height * this.scale.height,
		};
		let string = `${this.constructor.name} - X: ${this.x}, Y: ${this.y}`;
		let text = Context.measureText(string);
		// console.log(text);
		// debugger;
		let fontHeight = text.fontBoundingBoxAscent + text.fontBoundingBoxDescent;

		// let oldDevicePixelRatio = Context.devicePixelRatio;
		
		Context.strokeStyle = outlineColor;
		// Context.devicePixelRatio = 1.5;
		Context.strokeRect(x, y, scale.width, scale.height);
		// Context.devicePixelRatio = oldDevicePixelRatio;

		Context.fillStyle = outlineColor;
		Context.strokeRect(x, y - fontHeight, text.width, fontHeight);
		Context.fillRect(x, y - fontHeight, text.width, fontHeight);

		Context.fillStyle = textColor;
		Context.textBaseline = "middle";
		Context.fillText(string, x, y - fontHeight/2);
	}
}