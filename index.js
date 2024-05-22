let app;

// https://love2d.org/wiki/BoundingBox.lua
let Collides = function (x1,y1,w1,h1, x2,y2,w2,h2) {
	return x1 < x2+w2 &&
	       x2 < x1+w1 &&
	       y1 < y2+h2 &&
	       y2 < y1+h1;
}

let ApplyPoint = function (v, p) {
	return v - p;
}

let Mouse = {
	x: 0,
	y: 0,
	buttons: {
		left: false,
		right: false,
		middle: false
	}
};

Mouse.getButtonIndices = function () {
	let index = [];
	index[0] = Mouse.buttons.left;
	index[1] = Mouse.buttons.right;
	index[2] = Mouse.buttons.middle;
	return index;
}

Mouse.isButtonDown = function (button) {
	let index = Mouse.getButtonIndices();
	return index[button];
}

Mouse.isAnyButtonDown = function () {
	let index = Mouse.getButtonIndices();
	return index[0] || index[1] || index[2];
}

let Canvas = {
	_canvas: null,
};

let Context = null;

let Frame = {
	index: 0,
	clips: []
};

Frame.addClip = function (clip) {
	let index = Frame.clips.push(clip);
	Frame.clips[index-1].OnCreate();
}

Canvas.resize = function (width, height) {
	let autoResize = !(width || height);

	if (autoResize) {
		Canvas._canvas.width = window.innerWidth;
		Canvas._canvas.height = window.innerHeight;
		return;
	}

	Canvas._canvas.width = width;
	Canvas._canvas.height = height;
}

window.onload = function () {
	app = new App();
	
	Canvas._canvas = app.context.canvas;
	Canvas.resize();

	Context = app.context;

	let clip = new Clip(10, 10, "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bitmap_VS_SVG.svg/1024px-Bitmap_VS_SVG.svg.png")
	
	clip.OnMouseClick = function () {
		if (Mouse.isButtonDown(0)) {
			this.SetScale(this.scale.width / 2);
		} else if (Mouse.isButtonDown(1)) {
			this.x = Mouse.x - this.width / 2;
			this.y = Mouse.y - this.height / 2;
		}
	}

	clip.OnCreate = function () {
		this.SetScale(0.5);
	}

	Frame.addClip( clip );
	// Frame.clips[0].scale.width = 0.5;
	// Frame.clips[0].scale.height = 0.5;

	// Frame.clips[0].OnCreate();

	app.load();
	app.loop();
}

window.onresize = function () {
	Canvas.resize();
}

window.onmousemove = function (mouse) {
	Mouse.x = mouse.x;
	Mouse.y = mouse.y;
}

window.onmousedown = function (mouse) {
	Mouse.buttons.left = mouse.which == 1 ? true : Mouse.buttons.left;
	Mouse.buttons.right = mouse.which == 3 ? true : Mouse.buttons.right;
	Mouse.buttons.middle = mouse.which == 2 ? true : Mouse.buttons.middle;
}

window.onmouseup = function (mouse) {
	Mouse.buttons.left = mouse.which == 1 ? false : Mouse.buttons.left;
	Mouse.buttons.right = mouse.which == 3 ? false : Mouse.buttons.right;
	Mouse.buttons.middle = mouse.which == 2 ? false : Mouse.buttons.middle;
}

window.oncontextmenu = function (e) {
	e.preventDefault
}