const s = (p) => {
	class Boid {
		constructor(x,y,color) {
			this.acceleration = p.createVector(0,0);
			this.velocity = p.createVector(p.random(-1,1),p.random(-1,1));
			this.position = p.createVector(x,y);
			this.r = 10.0;
			this.maxspeed = 3;
			this.maxforce = 0.05;
			this.color = color;
		}

	}
};


let myp5 = new p5(s);
