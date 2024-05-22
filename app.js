// class Button extends UIButton {
// 	constructor (position, size, angle, label) {
// 		super(position, size, angle, label, "rgb(220,220,220)", "rgb(10,10,10)");
// 	}

// 	onMouseHover (mouse) {
// 		this.styles["background-color"] = "rgb(100,100,100)";
// 	}

// 	onMouseLeave (mouse) {
// 		this.styles["background-color"] = "rgb(220,220,220)";
// 	}

// 	onMouseClick (mouse) {
// 		this.styles["background-color"] = "rgb(50,50,50)";
// 	}

// 	onMouseRelease (mouse) {
// 		this.styles["background-color"] = this.mouseHovered ? "rgb(100,100,100)" : "rgb(220,220,220)";
// 	}
	
// 	onClick () {
// 		this.label.label = "clicked!";
// 	}
// }

class App {
	constructor () {
		this.context = document.querySelector("canvas").getContext("2d");
		// this.ui = new UserInterface();

		// this.ui.add(new Button({x:10, y:10}, {width:50, height:25}, 0, "button"));
	}

	// //////////////

	load () {}

	// //////////////

	loop () {
		this.update();
		this.draw();

		requestAnimationFrame(() => this.loop.call(this));
	}

	// //////////////

	update () {
		for (let clip of Frame.clips) {
			let x = ApplyPoint(clip.x, clip.origin.x);
			let y = ApplyPoint(clip.y, clip.origin.y);

			let mouseHover = Collides(Mouse.x, Mouse.y, 0, 0, x, y, clip.width, clip.height);

			if (mouseHover && Mouse.isAnyButtonDown() && !clip._.mouseClick) {
				clip.OnMouseClick();
				clip._.mouseClick = true;
			} else if ((!mouseHover || !Mouse.isAnyButtonDown()) && clip._.mouseClick) {
				clip.OnMouseRelease();
				clip._.mouseClick = false;
			}

			if (mouseHover && !clip._.mouseHover) {
				clip._.mouseHover = true;
				clip.OnMouseHover();
			} else if (!mouseHover && clip._.mouseHover) {
				clip._.mouseHover = false;
				clip.OnMouseLeave();
			}
			
			clip.PreStep();
		}

		for (let clip of Frame.clips) {
			clip.Step();
		}

		for (let clip of Frame.clips) {
			clip.PostStep();
		}
	}

	draw () {
		this.context.fillStyle = "white";
		this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		
		for (let clip of Frame.clips) {
			clip.Draw();
		}
	}
}